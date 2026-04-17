/**
 * ハーフモーダルシート (iOS風ボトムシート)
 * DESIGN_RULE §4.4 完全準拠
 *
 * 特徴:
 * - framer-motion のスプリングアニメーション
 * - スワイプダウンで閉じるドラッグジェスチャー
 * - 背面コンテンツ(#app-root)のスケールダウン・角丸化・暗転
 * - createPortal で #root 直下にレンダリング（transformの影響を回避）
 */

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
} from 'framer-motion'
import type { ReactNode } from 'react'

/** モーダル展開時の背面マージン */
const SHEET_MARGIN = 34

type HalfModalSheetProps = {
  /** モーダルの開閉状態 */
  isOpen: boolean
  /** 閉じるコールバック */
  onClose: () => void
  /** モーダルのタイトル（任意） */
  title?: string
  /** モーダル内のコンテンツ */
  children: ReactNode
}

export const HalfModalSheet: React.FC<HalfModalSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 375

  /** シートのY軸位置を追跡 */
  const y = useMotionValue(windowHeight)

  /** 背面のスケールダウン比率 */
  const scaleRatio = (windowWidth - SHEET_MARGIN) / windowWidth

  /** Y軸の変位に連動する背面のプロパティ */
  const bodyScale = useTransform(y, [0, windowHeight], [scaleRatio, 1])
  const bodyTranslateY = useTransform(y, [0, windowHeight], [14, 0])
  const bodyBorderRadius = useTransform(y, [0, windowHeight], [12, 0])
  const backdropOpacity = useTransform(y, [0, windowHeight], [0.4, 0])

  /** 背面(#app-root)のスタイルをリアルタイムに更新（React再レンダリング不要で60FPS維持） */
  useMotionValueEvent(bodyScale, 'change', (latestScale) => {
    const root = document.getElementById('app-root')
    if (root) {
      root.style.transform = `scale(${latestScale}) translateY(${bodyTranslateY.get()}px)`
      root.style.transformOrigin = 'top center'
      root.style.borderRadius = `${bodyBorderRadius.get()}px`
      root.style.overflow = 'hidden'
    }
  })

  /** モーダルが完全に閉じた時の背面スタイルクリーンアップ */
  useEffect(() => {
    if (!isOpen) {
      const root = document.getElementById('app-root')
      if (root) {
        root.style.transform = ''
        root.style.borderRadius = ''
        root.style.overflow = ''
      }
    }
  }, [isOpen])

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景オーバーレイ（クリックで閉じる） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
            style={{ opacity: backdropOpacity }}
          />

          {/* シート本体 */}
          <motion.div
            initial={{ y: windowHeight }}
            animate={{ y: 0 }}
            exit={{ y: windowHeight }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1} // 指の動きに遊びを持たせる
            style={{ y }}
            onDragEnd={(_e, { offset, velocity }) => {
              // スワイプの速度 or 移動距離で閉じるか判定
              if (offset.y > windowHeight * 0.25 || velocity.y > 400) {
                onClose()
              } else {
                // 閉じない場合は吸い付くように元の位置(y=0)へ戻る
                animate(y, 0, {
                  type: 'spring',
                  stiffness: 300,
                  damping: 36, // 少しだけしっとりと戻るように調整
                  mass: 0.8
                })
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[90dvh] w-full rounded-t-[32px] bg-background shadow-2xl flex flex-col pb-[env(safe-area-inset-bottom)]"
          >
            {/* ドラッグハンドル（ピル） */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-separator-opaque" />
            </div>

            {/* タイトル */}
            {title && (
              <div className="px-6 pb-2">
                <h2 className="text-title-2 text-label">{title}</h2>
              </div>
            )}

            {/* スクロール可能なコンテンツ領域 */}
            <div className="px-6 pb-6 flex-1 overflow-y-auto overscroll-y-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // #root 直下にポータルとしてレンダリング
  // (#app-root のtransformの影響を受けないようにするため)
  const portalTarget = document.getElementById('root')
  if (!portalTarget) return null

  return createPortal(content, portalTarget)
}

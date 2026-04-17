/**
 * PageTransition — iOS風の画面遷移アニメーション
 * 
 * react-router-dom のナビゲーション状態を検知し、
 * 進む (PUSH) 時は右からスライドイン、戻る (POP) 時は右へスライドアウトを実現します。
 */

import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useLocation, useNavigationType } from 'react-router-dom'
import React, { useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'

type PageTransitionProps = {
  children: ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const navigationType = useNavigationType()
  
  // 前回のパスを記録してタブ間移動か判別する
  const prevPathRef = React.useRef(location.pathname)

  // ルートタブの定義
  const rootTabs = ['/', '/organizations', '/notifications', '/mypage']
  
  // 今回の遷移度タブ間移動（スライド不要）かどうか
  const isTabSwitch = useMemo(() => {
    // 自身への遷移や初回は対象外
    if (prevPathRef.current === location.pathname) return false
    
    const isFromRoot = rootTabs.includes(prevPathRef.current)
    const isToRoot = rootTabs.includes(location.pathname)
    
    // 両方がルートタブセットに含まれる場合はタブ切り替えとみなす
    return isFromRoot && isToRoot
  }, [location.pathname])

  // アピール：現在のパスを次回用に更新
  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  // 遷移の方向を決定
  const direction = useMemo(() => {
    if (navigationType === 'POP') return -1 // 戻る
    return 1 // 進む、または置換
  }, [navigationType])

  /**
   * iOS風アニメーション定数
   * 進む時: 新画面が 100% -> 0、 旧画面が 0 -> -30% (少し動いて暗くなる)
   * 戻る時: 新画面が -30% -> 0、 旧画面が 0 -> 100% (右へ去る)
   */
  const variants: Variants = {
    initial: (dir: number) => {
      if (isTabSwitch) return { opacity: 0, x: 0, zIndex: 10 }
      return {
        x: dir > 0 ? '100%' : '-30%',
        opacity: dir > 0 ? 1 : 0.8,
        zIndex: dir > 0 ? 20 : 10,
      }
    },
    animate: {
      x: 0,
      opacity: 1,
      zIndex: 15,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 32 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (dir: number) => {
      if (isTabSwitch) return { opacity: 0, x: 0, zIndex: 10, transition: { duration: 0.1 } }
      return {
        x: dir > 0 ? '-30%' : '100%',
        opacity: dir > 0 ? 0.8 : 1,
        zIndex: dir > 0 ? 10 : 20,
        transition: {
          x: { type: 'spring', stiffness: 300, damping: 32 },
          opacity: { duration: 0.3 }
        }
      }
    }
  }

  return (
    <AnimatePresence 
      initial={false} 
      mode="popLayout" 
      custom={direction}
    >
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full bg-background overflow-y-auto overscroll-y-contain flex flex-col"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

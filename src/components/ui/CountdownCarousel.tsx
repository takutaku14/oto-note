/**
 * カウントダウン・カルーセル
 * 所属する全団体のカウントダウンバナーを横スクロールで表示
 * モバイルでの余白不整合を修正
 */

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { CountdownBanner } from './CountdownBanner'

type CarouselItem = {
  orgName: string
  orgColor: string
  seasonTitle: string
  concertDate: string
}

type CountdownCarouselProps = {
  items: CarouselItem[]
}

export const CountdownCarousel: React.FC<CountdownCarouselProps> = ({ items }) => {
  const [index, setIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null) // 外側の全幅コンテナ
  const innerRef = useRef<HTMLDivElement>(null)    // 内側のコンテンツ幅制限コンテナ

  // カード幅の計算と画面リサイズへの対応
  useEffect(() => {
    const updateWidth = () => {
      if (!innerRef.current) return
      const style = window.getComputedStyle(innerRef.current)
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const width = innerRef.current.offsetWidth - padding
      setCardWidth(width)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // 指定したインデックスの位置へスナップするアニメーションを実行
  const snapToCurrentIndex = () => {
    if (cardWidth === 0) return
    const targetX = -index * cardWidth

    animate(x, targetX, {
      type: 'spring',
      stiffness: 260,
      damping: 28,
      mass: 0.8
    })
  }

  // インデックス変更時またはカード幅確定時にアニメーションで移動
  useEffect(() => {
    snapToCurrentIndex()
  }, [index, cardWidth])

  // 1つしかない場合はカルーセルにせず単体表示
  if (items.length === 1) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        <CountdownBanner {...items[0]} />
      </div>
    )
  }

  // 複数ある場合
  return (
    <div className="relative w-full overflow-hidden pb-4" ref={containerRef}>
      {/* カルーセルコンテナ */}
      <div className="max-w-5xl mx-auto px-4" ref={innerRef}>
        <motion.div
          drag="x"
          // ドラッグ制限をバナー列の全幅に正しく設定（ワープ現象の防止）
          dragConstraints={{
            left: -(items.length - 1) * cardWidth,
            right: 0,
          }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (cardWidth === 0) return
            
            const offset = info.offset.x
            const velocity = info.velocity.x
            
            // 四分の一以上の移動、または一定以上の速度でフリックした場合に切り替え
            let newIndex = index
            if (offset > cardWidth / 4 || velocity > 500) {
              if (index > 0) newIndex = index - 1
            }
            else if (offset < -cardWidth / 4 || velocity < -500) {
              if (index < items.length - 1) newIndex = index + 1
            }

            if (newIndex !== index) {
              setIndex(newIndex)
            } else {
              // インデックスが変わらない場合も、ドラッグした位置から元の位置へ戻すアニメーションを実行
              snapToCurrentIndex()
            }
          }}
          style={{ x }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {items.map((item, i) => (
            <div
              key={`${item.orgName}-${i}`}
              className="w-full flex-shrink-0 pr-4" // 全てのカードに一貫した右余白(16px)を持たせる
              style={{ width: '100%' }}
            >
              <motion.div
                animate={{
                  scale: index === i ? 1 : 0.96,
                  opacity: index === i ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <CountdownBanner {...item} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ページインジケータ（ドット） */}
      <div className="flex justify-center gap-1.5 mt-4">
        {items.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === i ? 'w-6 bg-tint' : 'w-2 bg-label-quaternary'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

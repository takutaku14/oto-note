/**
 * カウントダウン・カルーセル
 * 所属する全団体のカウントダウンバナーを横スクロールで表示
 * モバイルでの余白不整合を修正
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="relative w-full overflow-hidden pb-4">
      {/* カルーセルコンテナ */}
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const threshold = 50
            if (info.offset.x < -threshold && index < items.length - 1) {
              setIndex(index + 1)
            } else if (info.offset.x > threshold && index > 0) {
              setIndex(index - 1)
            }
          }}
          className="flex cursor-grab active:cursor-grabbing"
          // 各カードの幅(100%) + ギャップ分(16px) を正確に移動
          animate={{ x: `calc(-${index * 100}% + (${index * 16}px))` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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

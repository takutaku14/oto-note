import { ReactNode, useEffect, useRef, useState } from 'react'

export type TimelineBlockProps = {
  /** 丸いアイコンコンテナの中に表示するアイコン */
  icon: ReactNode
  /** アイコンコンテナの背景色 */
  iconBgColor?: string
  /** サブコンテンツ（日付など、PC表示時の反対側テキスト） */
  dateContent: ReactNode
  /** 左右どちらに配置するか (mobile では常に右側配置に近い挙動になる) */
  direction?: 'left' | 'right'
  /** メインコンテンツ（イベントカード等） */
  children: ReactNode
}

export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  icon,
  iconBgColor = '#007AFF',
  dateContent,
  direction = 'right',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)

  // スクロール時のフェードイン/バウンスアニメーション監視
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // 一度表示されたら監視を解除（再度スクロールしてもアニメーションさせない場合）
          if (blockRef.current) {
            observer.unobserve(blockRef.current)
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px', // 画面の下から10%見えたら発火
        threshold: 0.1,
      }
    )

    if (blockRef.current) {
      observer.observe(blockRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isLeft = direction === 'left'

  return (
    <div ref={blockRef} className="relative flex items-start mb-10 md:mb-12 group">
      
      {/* タイムライン上のアイコン (中央または左端) */}
      <div 
        className={`absolute left-[24px] md:left-1/2 -ml-5 w-10 h-10 rounded-full border-4 border-background-grouped flex items-center justify-center text-white z-10 shadow-sm transition-transform duration-300 md:group-hover:scale-110 
          ${isVisible ? 'timeline-icon-bounce-in' : 'timeline-icon-hidden'}`}
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>

      {/* PC: コンテンツを左右に分けるラッパー */}
      <div className="flex w-full md:justify-between items-start">
        
        {/* 左側要素（PCで direction === 'left' の場合に表示されるカード） */}
        <div className={`hidden md:block w-[45%] ${isLeft ? '' : 'invisible'}`}>
          {isLeft && (
            <div className={`timeline-card-pointer is-left w-full ${isVisible ? 'timeline-content-bounce-in is-left' : 'timeline-content-hidden is-left'}`}>
              {children}
            </div>
          )}
        </div>

        {/* 右側要素（モバイル時はすべてこちら、PCでは direction === 'right' の場合のカード） */}
        <div className={`w-full pl-[56px] pr-2 md:pl-0 md:pr-0 md:w-[45%] ${!isLeft ? '' : 'md:hidden'}`}>
          <div className={`timeline-card-pointer is-right w-full ${isVisible ? 'timeline-content-bounce-in is-right' : 'timeline-content-hidden is-right'}`}>
            {/* モバイル表示時、またはPCで右側配置時 */}
            {(!isLeft || window.innerWidth < 768) && children}
          </div>
          {/* モバイル用日付表示 */}
          <div className={`md:hidden mt-2 ml-1 text-caption-1 font-medium text-label-secondary transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {dateContent}
          </div>
        </div>
      </div>

      {/* PC: 日付表示（カードの反対側に絶対配置） */}
      <div className={`hidden md:block absolute top-[10px] w-[45%] text-subhead font-bold text-label-secondary transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${isLeft ? 'left-[55%]' : 'right-[55%] text-right'}`}
      >
        {dateContent}
      </div>

    </div>
  )
}

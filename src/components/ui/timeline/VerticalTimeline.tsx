import type { ReactNode } from 'react'

export const VerticalTimeline: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="vertical-timeline max-w-5xl mx-auto md:px-6">
      {/* PC表示時のカテゴリ見出しヘッダー: 左右のカラムの役割を明示 */}
      <div className="hidden md:flex justify-between mb-12">
        <div className="w-[45%] text-center">
          <span className="inline-block px-6 py-2 rounded-full bg-background-grouped-secondary text-tint text-subhead font-bold shadow-sm border border-separator/50">
            練習予定
          </span>
        </div>
        <div className="w-[45%] text-center">
          <span className="inline-block px-6 py-2 rounded-full bg-background-grouped-secondary text-orange-500 text-subhead font-bold shadow-sm border border-separator/50">
            やることリスト
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

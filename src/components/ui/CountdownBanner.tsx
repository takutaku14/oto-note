/**
 * カウントダウンバナー
 * 「本番まであと○日」を表示するシーズン情報バナー
 * 要件定義書 §4.1 — カウントダウン機能
 */

import { Calendar } from 'lucide-react'

type CountdownBannerProps = {
  /** シーズン名（例：「第10回定期演奏会」） */
  seasonTitle: string
  /** 本番日 (YYYY-MM-DD) */
  concertDate: string
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  seasonTitle,
  concertDate,
}) => {
  const today = new Date()
  const concert = new Date(concertDate)
  const diffTime = concert.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // 本番日を過ぎていたら非表示
  if (diffDays < 0) return null

  return (
    <div
      className="mx-4 rounded-2xl p-4 text-white shadow-lg"
      style={{ background: 'linear-gradient(135deg, rgb(var(--color-tint)), #5856D6)' }}
    >
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 opacity-80 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-caption-1 opacity-80 truncate">{seasonTitle}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-title-1 font-bold">あと {diffDays} 日</span>
            <span className="text-subhead opacity-80">で本番</span>
          </div>
        </div>
      </div>
    </div>
  )
}

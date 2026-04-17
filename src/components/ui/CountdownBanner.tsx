/**
 * カウントダウンバナー
 * 「本番まであと○日」を表示するシーズン情報バナー
 * 要件定義書 §4.1 — カウントダウン機能
 */

import { Calendar } from 'lucide-react'
import { getContrastColor } from '../../utils/color'

type CountdownBannerProps = {
  /** 団体名 */
  orgName?: string
  /** 団体のテーマカラー */
  orgColor?: string
  /** シーズン名（例：「第10回定期演奏会」） */
  seasonTitle: string
  /** 本番日 (YYYY-MM-DD) */
  concertDate: string
  /** 追加のクラス名 */
  className?: string
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  orgName,
  orgColor,
  seasonTitle,
  concertDate,
  className = '',
}) => {
  const today = new Date()
  const concert = new Date(concertDate)
  const diffTime = concert.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // 本番日を過ぎていたら非表示
  if (diffDays < 0) return null

  // 背景グラデーションの作成（色が指定されていればそれを使用、なければデフォルトのTint）
  const baseColor = orgColor || 'rgb(var(--color-tint))'
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd, ${baseColor}aa)`,
  }

  const contrast = getContrastColor(orgColor)
  const textColor = contrast === 'black' ? 'text-[#1C1C1E]' : 'text-white'
  const subTextOpacity = contrast === 'black' ? 'opacity-70' : 'opacity-80'
  const iconOpacity = contrast === 'black' ? 'opacity-60' : 'opacity-80'

  return (
    <div
      className={`rounded-2xl p-4 shadow-lg ${textColor} ${className}`}
      style={backgroundStyle}
    >
      <div className="flex items-center gap-3">
        <Calendar className={`h-9 w-9 ${iconOpacity} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="mb-0.5">
            {orgName && (
              <p className="text-caption-1 font-bold opacity-90 truncate leading-tight uppercase tracking-wider">
                {orgName}
              </p>
            )}
            <p className={`text-caption-2 ${subTextOpacity} truncate leading-tight`}>
              {seasonTitle}
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-title-1 font-bold tracking-tight">あと {diffDays} 日</span>
            <span className={`text-subhead ${subTextOpacity}`}>で本番</span>
          </div>
        </div>
      </div>
    </div>
  )
}

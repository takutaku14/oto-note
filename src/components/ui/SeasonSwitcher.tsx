/**
 * シーズン切り替えプルダウン
 * 現在のアクティブシーズンを表示し、タップでシーズンを切り替える
 */

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { HalfModalSheet } from './HalfModalSheet'
import { useSeasons } from '../../hooks/useSeasons'

export const SeasonSwitcher: React.FC = () => {
  const { seasons, activeSeason, setActiveSeason } = useSeasons()
  const [isOpen, setIsOpen] = useState(false)

  if (seasons.length === 0) return null

  const handleSelect = (seasonId: string) => {
    setActiveSeason(seasonId)
    setIsOpen(false)
  }

  return (
    <>
      {/* トリガーボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-fill text-subhead text-label active:opacity-50 transition-opacity"
      >
        <span className="truncate max-w-[180px]">
          {activeSeason?.title || 'シーズン未設定'}
        </span>
        <ChevronDown className="w-4 h-4 text-label-secondary flex-shrink-0" />
      </button>

      {/* シーズン選択モーダル */}
      <HalfModalSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="シーズンを選択">
        <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
          {seasons.map((season, index) => {
            const isActive = season.id === activeSeason?.id
            return (
              <button
                key={season.id}
                onClick={() => handleSelect(season.id)}
                className="relative flex w-full items-center justify-between py-3 px-4 text-left active:bg-fill transition-colors duration-150"
              >
                <div className="flex-1 min-w-0">
                  <span className={`text-body ${isActive ? 'text-tint font-semibold' : 'text-label'}`}>
                    {season.title}
                  </span>
                  {season.concertDate && (
                    <p className="text-caption-1 text-label-tertiary mt-0.5">
                      本番日: {season.concertDate}
                    </p>
                  )}
                </div>
                {isActive && <Check className="w-5 h-5 text-tint flex-shrink-0" />}
                {index < seasons.length - 1 && (
                  <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
                )}
              </button>
            )
          })}
        </div>
      </HalfModalSheet>
    </>
  )
}

/**
 * シーズン作成モーダル
 * HalfModalSheet を利用したシーズン作成フォーム
 */

import { useState } from 'react'
import { HalfModalSheet } from '../../components/ui/HalfModalSheet'
import { ActionButton } from '../../components/ui/ActionButton'
import { useSeasons } from '../../hooks/useSeasons'

type CreateSeasonSheetProps = {
  isOpen: boolean
  onClose: () => void
}

export const CreateSeasonSheet: React.FC<CreateSeasonSheetProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [concertDate, setConcertDate] = useState('')
  const [setAsActive, setSetAsActive] = useState(true)
  const { createSeason, setActiveSeason } = useSeasons()

  const handleCreate = () => {
    const trimmed = title.trim()
    if (!trimmed) return

    const seasonId = createSeason(trimmed, concertDate || undefined)
    if (setAsActive) {
      setActiveSeason(seasonId)
    }

    setTitle('')
    setConcertDate('')
    setSetAsActive(true)
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setConcertDate('')
    setSetAsActive(true)
    onClose()
  }

  return (
    <HalfModalSheet isOpen={isOpen} onClose={handleClose} title="シーズンを作成">
      <div className="space-y-5">
        {/* シーズン名 */}
        <div>
          <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">
            シーズン名
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：第10回定期演奏会"
            className="w-full rounded-xl bg-fill px-4 py-3 text-body text-label placeholder:text-label-quaternary outline-none focus:ring-2 focus:ring-tint transition-shadow"
            autoFocus
          />
        </div>

        {/* 本番日（任意） */}
        <div>
          <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">
            本番日（任意）
          </label>
          <input
            type="date"
            value={concertDate}
            onChange={(e) => setConcertDate(e.target.value)}
            className="w-full rounded-xl bg-fill px-4 py-3 text-body text-label outline-none focus:ring-2 focus:ring-tint transition-shadow"
          />
          <p className="text-caption-1 text-label-tertiary mt-1 px-1">
            設定するとカウントダウンが表示されます
          </p>
        </div>

        {/* アクティブに設定するか */}
        <label className="flex items-center justify-between py-3 px-4 rounded-xl bg-background-grouped-secondary cursor-pointer">
          <span className="text-body text-label">作成後にアクティブにする</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={setAsActive}
              onChange={(e) => setSetAsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-fill rounded-full peer-checked:bg-green-500 transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform duration-200" />
          </div>
        </label>

        {/* 作成ボタン */}
        <ActionButton
          label="作成する"
          onClick={handleCreate}
          disabled={!title.trim()}
          fullWidth
        />
      </div>
    </HalfModalSheet>
  )
}

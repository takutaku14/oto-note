import React, { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { ActionButton } from '../../../components/ui/ActionButton'
import { HalfModalSheet } from '../../../components/ui/HalfModalSheet'
import type { AppEvent } from '../../../types'

type CalendarExportButtonProps = {
  event: AppEvent
}

export const CalendarExportButton: React.FC<CalendarExportButtonProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 日付のフォーマット (簡易実装)
  const eventDate = event.category === 'practice' || event.category === 'section' || event.category === 'duty' 
    ? event.date 
    : 'dueDate' in event ? event.dueDate : undefined

  if (!eventDate) return null

  // モック: Googleカレンダー用リンクを生成して別タブで開く
  const handleExportGoogle = () => {
    // 実際の実装では日付や時間を考慮したURLを生成する
    const title = encodeURIComponent(event.title)
    const dates = encodeURIComponent(eventDate.replace(/-/g, '') + 'T000000Z/' + eventDate.replace(/-/g, '') + 'T235959Z')
    const details = encodeURIComponent(event.memo || '音ノート イベント')
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`
    
    window.open(url, '_blank')
    setIsModalOpen(false)
  }

  // モック: icsファイルのダウンロードアラート
  const handleExportIcs = () => {
    alert('モック版: iCalファイル (.ics) をダウンロードしました。')
    setIsModalOpen(false)
  }

  // 既に連携済みの場合はチェックマークなどを表示する設計だが、ここではまだモックUIのみとする
  const isExported = 'externalCalendarEventId' in event && !!event.externalCalendarEventId

  return (
    <>
      <ActionButton
        label={isExported ? "カレンダー連携済み" : "カレンダーに追加"}
        variant="secondary"
        icon={isExported ? <Calendar className="w-5 h-5 text-green-500" /> : <Calendar className="w-5 h-5" />}
        fullWidth
        onClick={() => setIsModalOpen(true)}
      />

      <HalfModalSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="カレンダーへ追加"
      >
        <div className="space-y-4 pt-2">
          <p className="text-body text-label-secondary mb-4">
            このイベントをご自身のカレンダーアプリに登録します。
          </p>
          <button
            onClick={handleExportGoogle}
            className="flex items-center gap-3 w-full p-4 bg-background-grouped-secondary rounded-xl active:opacity-50 transition-opacity"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-body font-semibold text-label">Google カレンダー</div>
              <div className="text-caption-1 text-label-secondary">Googleカレンダーを開いて登録します</div>
            </div>
          </button>

          <button
            onClick={handleExportIcs}
            className="flex items-center gap-3 w-full p-4 bg-background-grouped-secondary rounded-xl active:opacity-50 transition-opacity"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-body font-semibold text-label">カレンダーアプリ (.ics)</div>
              <div className="text-caption-1 text-label-secondary">iOSカレンダー等で開けるファイルをダウンロード</div>
            </div>
          </button>
        </div>
      </HalfModalSheet>
    </>
  )
}

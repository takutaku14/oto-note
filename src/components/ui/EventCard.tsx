/**
 * イベントカード
 * タイムライン上の1イベントを表示するカードコンポーネント
 * 要件定義書 §4.2 — マイタイムライン用カード
 *
 * 特徴:
 * - 団体カラーバッジ（どの団体の予定か一目で識別）
 * - カテゴリアイコン + テーマカラー
 * - タップ時の active:scale フィードバック
 */

import type { AppEvent } from '../../types'
import { EVENT_CATEGORY_META } from '../../constants/eventCategories'

type EventCardProps = {
  /** 表示するイベントデータ */
  event: AppEvent
  /** 団体名（タイムライン表示時） */
  orgName?: string
  /** 団体カラー（タイムラインのバッジ表示用） */
  orgColor?: string
  /** クリックハンドラ */
  onClick?: () => void
}

/**
 * イベントから表示用の日付テキストを取得
 */
const getDateDisplay = (event: AppEvent): string => {
  switch (event.category) {
    case 'practice':
    case 'section':
    case 'duty':
      return event.date
    case 'billing':
    case 'survey':
    case 'return':
      return `期限: ${event.dueDate}`
    case 'notice':
      return event.dueDate ? `期限: ${event.dueDate}` : ''
  }
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  orgName,
  orgColor,
  onClick,
}) => {
  const meta = EVENT_CATEGORY_META[event.category]
  const dateText = getDateDisplay(event)

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-background-grouped-secondary rounded-xl p-4 active:scale-[0.98] transition-transform duration-150 ease-apple-ease shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* カテゴリアイコン */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: meta.color + '18' }}
        >
          <meta.Icon className="h-5 w-5" style={{ color: meta.color }} />
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* 団体カラーバッジ（マイタイムラインで使用） */}
          {orgName && (
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: orgColor }}
              />
              <span className="text-caption-1 text-label-secondary truncate">{orgName}</span>
            </div>
          )}

          {/* イベントタイトル */}
          <h3 className="text-headline text-label line-clamp-1">{event.title}</h3>

          {/* 日付・期限 */}
          {dateText && (
            <p className="text-subhead text-label-secondary mt-0.5">{dateText}</p>
          )}
        </div>

        {/* シェブロン */}
        {onClick && (
          <svg className="h-5 w-5 text-label-tertiary flex-shrink-0 mt-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  )
}

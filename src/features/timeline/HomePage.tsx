/**
 * ホーム画面 — マイタイムライン完全版
 * 全団体横断のイベント・タスクを時系列で表示
 * 要件定義書 §4.2
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Filter } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTimeline } from '../../hooks/useTimeline'
import { useNotifications } from '../../hooks/useNotifications'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useMockData } from '../../hooks/useMockData'
import { CountdownCarousel } from '../../components/ui/CountdownCarousel'
import { EventCard } from '../../components/ui/EventCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { VerticalTimeline } from '../../components/ui/timeline/VerticalTimeline'
import { TimelineBlock } from '../../components/ui/timeline/TimelineBlock'
import { EVENT_CATEGORY_META, getEventDirection } from '../../constants/eventCategories'
import type { AppEvent } from '../../types'

/** タイムラインの横に表示する日付・時刻を取得 */
const getTimelineDateContent = (event: AppEvent): string => {
  switch (event.category) {
    case 'practice':
    case 'section':
      return event.timetable[0]?.startTime || event.date
    case 'duty':
      return event.date
    case 'billing':
    case 'survey':
    case 'return':
      return event.dueDate
    case 'notice':
      return event.dueDate || ''
    default:
      return ''
  }
}

/** 日付文字列を曜日付きで表示 */
const formatDateHeader = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  if (dateStr === todayStr) return `今日 — ${month}月${day}日（${weekday}）`
  if (dateStr === tomorrowStr) return `明日 — ${month}月${day}日（${weekday}）`
  return `${month}月${day}日（${weekday}）`
}

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth()
  const { timelineEvents, groupedByDate } = useTimeline()
  const { unreadCount } = useNotifications()
  const { organizations } = useOrganizations()
  const data = useMockData()
  const navigate = useNavigate()
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false)

  // 全団体の本番日のカウントダウンを集計
  const upcomingConcerts = useMemo(() => {
    const now = new Date()
    const concerts: {
      orgName: string
      orgColor: string
      seasonTitle: string
      concertDate: string
      diff: number
    }[] = []

    for (const org of organizations) {
      if (!org.currentSeasonId) continue
      const season = data.seasons.find((s) => s.id === org.currentSeasonId)
      if (!season?.concertDate) continue
      const diff = new Date(season.concertDate).getTime() - now.getTime()
      
      // 本番当日またはそれ以降のもののみ追加
      if (diff > -(1000 * 60 * 60 * 24)) {
        concerts.push({
          orgName: org.name,
          orgColor: org.color || '',
          seasonTitle: season.title,
          concertDate: season.concertDate,
          diff,
        })
      }
    }

    // 日付が近い順にソート
    return concerts.sort((a, b) => a.diff - b.diff)
  }, [organizations, data.seasons])

  // フィルタ適用後のグルーピング
  const filteredGrouped = useMemo(() => {
    if (!showUnansweredOnly) return groupedByDate
    const filtered: Record<string, typeof timelineEvents> = {}
    for (const [date, events] of Object.entries(groupedByDate)) {
      const unanswered = events.filter(
        (te) => !te.myResponse || te.myResponse.status === 'unanswered' || te.myResponse.status === 'unpaid'
      )
      if (unanswered.length > 0) filtered[date] = unanswered
    }
    return filtered
  }, [groupedByDate, showUnansweredOnly, timelineEvents])

  const dateKeys = Object.keys(filteredGrouped).sort()

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー (iOS/PWAのSafe Area Topを確保) */}
      <div className="sticky top-0 z-40 bg-background-grouped/80 backdrop-blur-xl border-b border-separator pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-subhead text-label-secondary">おかえりなさい</p>
            <h1 className="text-title-2 font-bold text-label">
              {currentUser?.displayName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* フィルターボタン */}
            <button
              onClick={() => setShowUnansweredOnly(!showUnansweredOnly)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 active:scale-90 ${
                showUnansweredOnly
                  ? 'bg-tint text-white'
                  : 'bg-fill text-label'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            {/* 通知ベル */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-fill active:scale-90 transition-transform duration-150"
            >
              <Bell className="w-5 h-5 text-label" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 flex items-center justify-center px-1 rounded-full bg-red-500 text-white text-caption-2 font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* フィルター表示 */}
        {showUnansweredOnly && (
          <div className="px-4 pb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tint/10 text-caption-1 text-tint font-medium">
              <Filter className="w-3 h-3" />
              未完了のみ表示中
            </span>
          </div>
        )}
      </div>

      {/* カウントダウン・カルーセル */}
      {upcomingConcerts.length > 0 && (
        <div className="pt-4 overflow-hidden">
          <CountdownCarousel items={upcomingConcerts} />
        </div>
      )}

      {/* タイムライン */}
      {dateKeys.length === 0 ? (
        <EmptyState
          title={showUnansweredOnly ? '未完了のタスクはありません' : 'イベントがありません'}
          description={showUnansweredOnly ? 'すべてのタスクが完了しています 🎉' : '団体に参加するとイベントが表示されます'}
        />
      ) : (
        <div className="pt-4">
          <VerticalTimeline>
            {dateKeys.map((dateKey) => (
              <div key={dateKey}>
                {/* 日付セクションバッジ（軸上に配置） */}
                <div className="relative flex items-center md:justify-center z-10 mb-6 pl-2 md:pl-0">
                  <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-full h-full bg-background-grouped" />
                  </div>
                  <span className="bg-background-grouped-secondary px-4 py-1.5 rounded-full text-caption-1 font-bold text-label-secondary shadow-sm">
                    {formatDateHeader(dateKey)}
                  </span>
                </div>

                {/* イベントカードリスト */}
                {filteredGrouped[dateKey].map((te) => {
                  const meta = EVENT_CATEGORY_META[te.event.category]
                  return (
                    <TimelineBlock
                      key={te.event.id}
                      icon={<meta.Icon className="h-5 w-5" />}
                      iconBgColor={meta.color}
                      dateContent={getTimelineDateContent(te.event)}
                      direction={getEventDirection(te.event.category)}
                    >
                      <EventCard
                        event={te.event}
                        orgName={te.orgName}
                        orgColor={te.orgColor}
                        responseStatus={te.myResponse?.status}
                        onClick={() => navigate(`/org/${te.event.orgId}/events/${te.event.id}`)}
                      />
                    </TimelineBlock>
                  )
                })}
              </div>
            ))}
          </VerticalTimeline>
        </div>
      )}

      <div className="h-8" />
    </div>
  )
}

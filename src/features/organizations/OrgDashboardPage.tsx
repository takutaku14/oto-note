/**
 * 団体別ダッシュボード
 * 特定団体のイベント一覧、シーズン切り替え、カウントダウン
 */

import { useNavigate } from 'react-router-dom'
import { Bell, Plus, Settings } from 'lucide-react'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useEvents } from '../../hooks/useEvents'
import { useNotifications } from '../../hooks/useNotifications'
import { CountdownBanner } from '../../components/ui/CountdownBanner'
import { EventCard } from '../../components/ui/EventCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { SeasonSwitcher } from '../../components/ui/SeasonSwitcher'
import { VerticalTimeline } from '../../components/ui/timeline/VerticalTimeline'
import { TimelineBlock } from '../../components/ui/timeline/TimelineBlock'
import { EVENT_CATEGORY_META, getEventDirection } from '../../constants/eventCategories'

export const OrgDashboardPage: React.FC = () => {
  const { org, season, isAdmin } = useCurrentOrg()
  const { upcomingEvents, pastEvents, getMyResponse } = useEvents()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-title-2 font-bold text-label truncate">{org.name}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 設定（幹部のみ） */}
            {isAdmin && (
              <button
                onClick={() => navigate(`/org/${org.id}/admin/settings`)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-fill active:scale-90 transition-transform duration-150"
              >
                <Settings className="w-5 h-5 text-label" />
              </button>
            )}
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
        {/* シーズン切り替え */}
        <div className="px-4 pb-3">
          <SeasonSwitcher />
        </div>
      </div>

      {/* カウントダウンバナー */}
      {season?.concertDate && (
        <div className="pt-4">
          <CountdownBanner seasonTitle={season.title} concertDate={season.concertDate} />
        </div>
      )}

      {/* 今後のイベント */}
      {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
        <EmptyState
          title="まだイベントがありません"
          description={isAdmin ? '「＋」ボタンから新しいイベントを作成しましょう' : '幹部がイベントを作成するとここに表示されます'}
          action={isAdmin ? { label: 'イベントを作成', onClick: () => navigate(`/org/${org.id}/admin/events/new`) } : undefined}
        />
      ) : (
        <div className="pt-4">
          <VerticalTimeline>
            {/* 今後の予定 */}
            {upcomingEvents.length > 0 && (
              <>
                <div className="relative flex items-center md:justify-center z-10 mb-6 pl-2 md:pl-0">
                  <span className="bg-tint/10 text-tint px-4 py-1.5 rounded-full text-caption-1 font-bold shadow-sm">
                    今後の予定（{upcomingEvents.length}件）
                  </span>
                </div>
                {upcomingEvents.map((event, idx) => {
                  const meta = EVENT_CATEGORY_META[event.category]
                  const response = getMyResponse(event.id)
                  return (
                    <TimelineBlock
                      key={event.id}
                      icon={<meta.Icon className="h-5 w-5" />}
                      iconBgColor={meta.color}
                      dateContent={event.time || event.date}
                      direction={getEventDirection(event.category)}
                    >
                      <EventCard
                        event={event}
                        responseStatus={response?.status}
                        onClick={() => navigate(`/org/${org.id}/events/${event.id}`)}
                      />
                    </TimelineBlock>
                  )
                })}
              </>
            )}

            {/* 過去のイベント */}
            {pastEvents.length > 0 && (
              <>
                <div className="relative flex items-center md:justify-center z-10 mb-6 pl-2 md:pl-0 mt-8">
                  <span className="bg-fill px-4 py-1.5 rounded-full text-caption-1 font-bold text-label-secondary shadow-sm">
                    過去のイベント（{pastEvents.length}件）
                  </span>
                </div>
                {pastEvents.map((event, idx) => {
                  const meta = EVENT_CATEGORY_META[event.category]
                  const response = getMyResponse(event.id)
                  const globalIdx = upcomingEvents.length + idx
                  return (
                    <TimelineBlock
                      key={event.id}
                      icon={<meta.Icon className="h-5 w-5" />}
                      iconBgColor={meta.color}
                      dateContent={event.time || event.date}
                      direction={getEventDirection(event.category)}
                    >
                      <div className="opacity-60 transition-opacity hover:opacity-100">
                        <EventCard
                          event={event}
                          responseStatus={response?.status}
                          onClick={() => navigate(`/org/${org.id}/events/${event.id}`)}
                        />
                      </div>
                    </TimelineBlock>
                  )
                })}
              </>
            )}
          </VerticalTimeline>
        </div>
      )}

      {/* FAB（幹部のみ） */}
      {isAdmin && (
        <button
          onClick={() => navigate(`/org/${org.id}/admin/events/new`)}
          className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-tint text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform duration-150 z-30"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      <div className="h-8" />
    </div>
  )
}

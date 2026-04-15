/**
 * ホーム画面（簡易版）
 * Phase 1 では所属団体カードの一覧 + カウントダウンを表示。
 * Phase 2 で完全なマイタイムラインに拡張予定。
 */

import { useNavigate } from 'react-router-dom'
import { ChevronRight, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useMockData } from '../../hooks/useMockData'
import { CountdownBanner } from '../../components/ui/CountdownBanner'

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth()
  const { organizations, getMembershipForOrg } = useOrganizations()
  const data = useMockData()
  const navigate = useNavigate()

  // 未読通知数
  const unreadCount = data.notifications.filter(
    (n) => n.userId === currentUser?.uid && !n.isRead
  ).length

  /**
   * 全所属団体のアクティブシーズンの中で、最も近い本番日を持つものを取得
   */
  const upcomingConcert = (() => {
    const now = new Date()
    let nearest: { seasonTitle: string; concertDate: string } | null = null
    let minDiff = Infinity

    for (const org of organizations) {
      if (!org.currentSeasonId) continue
      const season = data.seasons.find((s) => s.id === org.currentSeasonId)
      if (!season?.concertDate) continue
      const diff = new Date(season.concertDate).getTime() - now.getTime()
      if (diff > 0 && diff < minDiff) {
        minDiff = diff
        nearest = { seasonTitle: season.title, concertDate: season.concertDate }
      }
    }
    return nearest
  })()

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-subhead text-label-secondary">おかえりなさい</p>
            <h1 className="text-title-2 font-bold text-label">
              {currentUser?.displayName}
            </h1>
          </div>
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

      {/* カウントダウンバナー */}
      {upcomingConcert && (
        <div className="pt-4">
          <CountdownBanner
            seasonTitle={upcomingConcert.seasonTitle}
            concertDate={upcomingConcert.concertDate}
          />
        </div>
      )}

      {/* 所属団体カード一覧 */}
      <div className="px-4 pt-6">
        <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          所属団体
        </h2>

        {organizations.length === 0 ? (
          <div className="rounded-xl bg-background-grouped-secondary py-12 px-4 flex flex-col items-center">
            <p className="text-headline text-label mb-1">まだ団体に参加していません</p>
            <p className="text-subhead text-label-secondary text-center">
              「団体」タブから参加・作成できます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {organizations.map((org) => {
              const membership = getMembershipForOrg(org.id)
              const season = org.currentSeasonId
                ? data.seasons.find((s) => s.id === org.currentSeasonId)
                : undefined

              // この団体のイベント数（簡易表示用）
              const eventCount = data.events.filter(
                (e) =>
                  e.orgId === org.id &&
                  e.targetUserIds.includes(currentUser?.uid || '')
              ).length

              return (
                <button
                  key={org.id}
                  onClick={() => navigate(`/org/${org.id}`)}
                  className="w-full rounded-2xl bg-background-grouped-secondary p-4 text-left active:scale-[0.98] transition-transform duration-150 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {/* 団体カラーアイコン */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-title-3"
                      style={{ backgroundColor: org.color || 'rgb(var(--color-tint))' }}
                    >
                      {org.name.charAt(0)}
                    </div>

                    {/* 団体情報 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-headline text-label truncate">{org.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {season && (
                          <span className="text-caption-1 text-label-secondary truncate">
                            {season.title}
                          </span>
                        )}
                        {eventCount > 0 && (
                          <span className="text-caption-2 text-tint font-medium">
                            {eventCount}件の予定
                          </span>
                        )}
                      </div>
                      {membership?.part && (
                        <p className="text-caption-2 text-label-tertiary mt-0.5">
                          {membership.part}
                        </p>
                      )}
                    </div>

                    {/* シェブロン */}
                    <ChevronRight className="w-5 h-5 text-label-tertiary flex-shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* フッター余白 */}
      <div className="h-8" />
    </div>
  )
}

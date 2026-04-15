/**
 * NotificationsPage — 通知一覧（通知センター）
 * 個人宛の通知インボックス、既読/未読ステータス表示
 */

import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle2, ChevronRight, AlertCircle, CalendarClock, UserPlus } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useOrganizations } from '../../hooks/useOrganizations'
import { EmptyState } from '../../components/ui/EmptyState'
import type { NotificationType } from '../../types'

/** 通知タイプに応じたアイコンと色 */
const getNotificationMeta = (type: NotificationType) => {
  switch (type) {
    case 'important_notice':
      return { Icon: CalendarClock, color: 'text-blue-500', bg: 'bg-blue-500/10' }
    case 'reminder':
      return { Icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' }
    case 'manager_assigned':
      return { Icon: UserPlus, color: 'text-green-500', bg: 'bg-green-500/10' }
    default:
      return { Icon: Bell, color: 'text-gray-500', bg: 'bg-gray-500/10' }
  }
}

/** 相対時間のフォーマット */
const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'たった今'
  if (diffInMinutes < 60) return `${diffInMinutes}分前`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}時間前`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}日前`
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
}

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const { organizations } = useOrganizations()
  const navigate = useNavigate()

  const handleNotificationClick = (id: string, link: string) => {
    markAsRead(id)
    navigate(link)
  }

  const handleMarkAllRead = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markAsRead(n.id))
  }

  // 通知表示用のデータ（団体名を結合）
  const displayNotifications = notifications.map((n) => {
    const org = organizations.find((o) => o.id === n.orgId)
    return { ...n, orgName: org?.name }
  })

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-label" />
            <h1 className="text-large-title font-bold text-label">通知</h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-subhead text-tint active:opacity-50 transition-opacity"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>すべて既読</span>
            </button>
          )}
        </div>
      </div>

      {displayNotifications.length === 0 ? (
        <EmptyState
          title="通知はありません"
          description="新しいお知らせや予定が追加されるとここに表示されます"
        />
      ) : (
        <div className="px-4 pt-4">
          <div className="overflow-hidden rounded-xl bg-background-grouped-secondary shadow-sm">
            {displayNotifications.map((notification, index) => {
              const meta = getNotificationMeta(notification.type)
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`relative w-full text-left flex items-start gap-3 p-4 transition-colors duration-150 ${
                    notification.isRead ? 'bg-transparent' : 'bg-tint/5'
                  } active:bg-fill`}
                >
                  {/* 未読ドット */}
                  {!notification.isRead && (
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-tint" />
                  )}

                  {/* アイコン */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${meta.bg}`}>
                    <meta.Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-subhead line-clamp-2 ${notification.isRead ? 'font-medium text-label' : 'font-bold text-label'}`}>
                        {notification.title}
                      </p>
                      <span className="flex-shrink-0 text-caption-2 text-label-tertiary">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-caption-1 text-label-secondary line-clamp-2 mb-1.5">
                      {notification.body}
                    </p>

                    {/* 団体名バッジ */}
                    {notification.orgName && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-fill text-caption-2 text-label-secondary">
                        {notification.orgName}
                      </span>
                    )}
                  </div>

                  {/* シェブロン */}
                  <div className="flex-shrink-0 self-center ml-1">
                    <ChevronRight className="w-5 h-5 text-label-tertiary" />
                  </div>

                  {/* セパレーター */}
                  {index < displayNotifications.length - 1 && (
                    <div className="absolute bottom-0 left-[3.25rem] right-0 h-[0.5px] bg-separator" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      <div className="h-8" />
    </div>
  )
}

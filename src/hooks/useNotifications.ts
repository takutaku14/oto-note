/**
 * useNotifications — 通知データを提供する Hook
 */

import { useMemo, useCallback } from 'react'
import { useMockData } from './useMockData'
import { useAuth } from './useAuth'

export const useNotifications = () => {
  const { currentUser } = useAuth()
  const data = useMockData()

  /** 現在ユーザーの全通知（新しい順） */
  const notifications = useMemo(
    () =>
      data.notifications
        .filter((n) => n.userId === currentUser?.uid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [data.notifications, currentUser]
  )

  /** 未読件数 */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  /** 既読化 */
  const markAsRead = useCallback(
    (notifId: string) => {
      data.markNotificationRead(notifId)
    },
    [data]
  )

  return {
    notifications,
    unreadCount,
    markAsRead,
  }
}

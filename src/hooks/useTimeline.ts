/**
 * useTimeline — 全団体横断のマイタイムラインデータを提供する Hook
 *
 * 全所属団体のイベントを横断的に取得し、
 * targetUserIds に自分が含まれるもののみ時系列でソートして返す。
 */

import { useMemo } from 'react'
import { useMockData } from './useMockData'
import { useAuth } from './useAuth'
import { useOrganizations } from './useOrganizations'
import type { AppEvent, EventResponse } from '../types'

/** タイムライン表示用のイベント（団体情報と回答ステータスを付加） */
export type TimelineEvent = {
  event: AppEvent
  orgName: string
  orgColor: string
  /** 自分の回答ステータス（未回答なら undefined） */
  myResponse: EventResponse | undefined
}

/**
 * イベントから日付キー (YYYY-MM-DD) を抽出するヘルパー
 */
const getEventDate = (event: AppEvent): string => {
  switch (event.category) {
    case 'practice':
    case 'section':
    case 'duty':
      return event.date
    case 'billing':
    case 'survey':
    case 'return':
      return event.dueDate
    case 'notice':
      return event.dueDate || event.createdAt.slice(0, 10)
  }
}

export const useTimeline = () => {
  const { currentUser } = useAuth()
  const { organizations } = useOrganizations()
  const data = useMockData()

  /** 全団体横断のタイムラインイベント */
  const timelineEvents = useMemo(() => {
    if (!currentUser) return []

    const orgMap = new Map(organizations.map((o) => [o.id, o]))
    const result: TimelineEvent[] = []

    for (const event of data.events) {
      const org = orgMap.get(event.orgId)
      if (!org) continue

      // 自分が対象のイベントのみ
      if (!event.targetUserIds.includes(currentUser.uid)) continue

      // 自分の回答を検索
      const myResponse = data.responses.find(
        (r) => r.eventId === event.id && r.userId === currentUser.uid
      )

      result.push({
        event,
        orgName: org.name,
        orgColor: org.color || '#007AFF',
        myResponse,
      })
    }

    // 日付で昇順ソート（直近が上）
    result.sort((a, b) => {
      const dateA = getEventDate(a.event)
      const dateB = getEventDate(b.event)
      return dateA.localeCompare(dateB)
    })

    return result
  }, [currentUser, organizations, data.events, data.responses])

  /** 未回答のイベントのみ */
  const unansweredEvents = useMemo(
    () => timelineEvents.filter((te) => !te.myResponse || te.myResponse.status === 'unanswered'),
    [timelineEvents]
  )

  /** 日付別にグルーピング */
  const groupedByDate = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {}
    for (const te of timelineEvents) {
      const dateKey = getEventDate(te.event)
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(te)
    }
    return groups
  }, [timelineEvents])

  return {
    timelineEvents,
    unansweredEvents,
    groupedByDate,
  }
}

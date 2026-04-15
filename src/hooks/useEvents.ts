/**
 * useEvents — 団体別イベントデータを提供する Hook
 */

import { useMemo, useCallback } from 'react'
import { useMockData } from './useMockData'
import { useAuth } from './useAuth'
import { useCurrentOrg } from './useCurrentOrg'
import type { AppEvent, EventResponse } from '../types'

/** イベントから日付キー (YYYY-MM-DD) を取得 */
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

export const useEvents = () => {
  const { currentUser } = useAuth()
  const { org, season } = useCurrentOrg()
  const data = useMockData()

  /** 現在の団体 + アクティブシーズンのイベント一覧 */
  const events = useMemo(
    () =>
      data.events.filter(
        (e) => e.orgId === org.id && (!season || e.seasonId === season.id)
      ),
    [data.events, org.id, season]
  )

  /** 自分が対象のイベント */
  const myEvents = useMemo(
    () =>
      events.filter((e) =>
        currentUser ? e.targetUserIds.includes(currentUser.uid) : false
      ),
    [events, currentUser]
  )

  /** 今日以降のイベント（日付昇順） */
  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return myEvents
      .filter((e) => getEventDate(e) >= today)
      .sort((a, b) => getEventDate(a).localeCompare(getEventDate(b)))
  }, [myEvents])

  /** 過去のイベント */
  const pastEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return myEvents
      .filter((e) => getEventDate(e) < today)
      .sort((a, b) => getEventDate(b).localeCompare(getEventDate(a)))
  }, [myEvents])

  /** イベント単体取得 */
  const getEventById = useCallback(
    (eventId: string) => data.events.find((e) => e.id === eventId),
    [data.events]
  )

  /** イベントに対する自分の回答を取得 */
  const getMyResponse = useCallback(
    (eventId: string): EventResponse | undefined =>
      data.responses.find(
        (r) => r.eventId === eventId && r.userId === currentUser?.uid
      ),
    [data.responses, currentUser]
  )

  return {
    events,
    myEvents,
    upcomingEvents,
    pastEvents,
    getEventById,
    getMyResponse,
  }
}

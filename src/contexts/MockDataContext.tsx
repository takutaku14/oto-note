/**
 * MockDataContext — モックデータの CRUD 管理
 *
 * Phase 0 で定義したモックデータを useState で管理し、
 * 読み書きメソッドを提供する疑似データベース層。
 * Phase 6 で Firestore に置き換え予定。
 */

import { createContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Organization, Season, Membership, AppEvent, EventResponse, Board, Comment, Notification } from '../types'
import {
  mockOrganizations,
  mockSeasons,
  mockMemberships,
  mockEvents,
  mockResponses,
  mockBoards,
  mockComments,
  mockNotifications,
} from '../mocks'

/** MockDataContext が提供する型 */
export type MockDataContextValue = {
  /* ====== データ ====== */
  organizations: Organization[]
  seasons: Season[]
  memberships: Membership[]
  events: AppEvent[]
  responses: EventResponse[]
  boards: Board[]
  comments: Comment[]
  notifications: Notification[]

  /* ====== 団体操作 ====== */
  addOrganization: (org: Organization) => void
  updateOrganization: (orgId: string, updates: Partial<Organization>) => void

  /* ====== シーズン操作 ====== */
  addSeason: (season: Season) => void

  /* ====== メンバーシップ操作 ====== */
  addMembership: (membership: Membership) => void
  updateMembership: (userId: string, orgId: string, updates: Partial<Membership>) => void

  /* ====== イベント操作（Phase 2 で拡張） ====== */
  addEvent: (event: AppEvent) => void

  /* ====== レスポンス操作（Phase 3 で拡張） ====== */
  updateResponse: (eventId: string, userId: string, updates: Partial<EventResponse>) => void

  /* ====== 通知操作 ====== */
  markNotificationRead: (notifId: string) => void
}

export const MockDataContext = createContext<MockDataContextValue | null>(null)

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
  const [seasons, setSeasons] = useState<Season[]>(mockSeasons)
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships)
  const [events, setEvents] = useState<AppEvent[]>(mockEvents)
  const [responses, setResponses] = useState<EventResponse[]>(mockResponses)
  const [boards] = useState<Board[]>(mockBoards)
  const [comments] = useState<Comment[]>(mockComments)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  /* ====== 団体操作 ====== */
  const addOrganization = useCallback((org: Organization) => {
    setOrganizations((prev) => [...prev, org])
  }, [])

  const updateOrganization = useCallback((orgId: string, updates: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, ...updates } : o))
    )
  }, [])

  /* ====== シーズン操作 ====== */
  const addSeason = useCallback((season: Season) => {
    setSeasons((prev) => [...prev, season])
  }, [])

  /* ====== メンバーシップ操作 ====== */
  const addMembership = useCallback((membership: Membership) => {
    setMemberships((prev) => [...prev, membership])
  }, [])

  const updateMembership = useCallback((userId: string, orgId: string, updates: Partial<Membership>) => {
    setMemberships((prev) =>
      prev.map((m) =>
        m.userId === userId && m.orgId === orgId ? { ...m, ...updates } : m
      )
    )
  }, [])

  /* ====== イベント操作 ====== */
  const addEvent = useCallback((event: AppEvent) => {
    setEvents((prev) => [...prev, event])
  }, [])

  /* ====== レスポンス操作 ====== */
  const updateResponse = useCallback((eventId: string, userId: string, updates: Partial<EventResponse>) => {
    setResponses((prev) =>
      prev.map((r) =>
        r.eventId === eventId && r.userId === userId ? { ...r, ...updates } : r
      )
    )
  }, [])

  /* ====== 通知操作 ====== */
  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    )
  }, [])

  const value: MockDataContextValue = {
    organizations, seasons, memberships, events, responses, boards, comments, notifications,
    addOrganization, updateOrganization,
    addSeason,
    addMembership, updateMembership,
    addEvent,
    updateResponse,
    markNotificationRead,
  }

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
}

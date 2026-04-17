/**
 * MockDataContext — モックデータの CRUD 管理
 *
 * Phase 0 で定義したモックデータを useState で管理し、
 * 読み書きメソッドを提供する疑似データベース層。
 * Phase 2 にて localStorage への永続化とリセット機能を追加。
 * Phase 6 で Firestore に置き換え予定。
 */

import { createContext, useState, useCallback, useEffect } from 'react'
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

const STORAGE_KEY = 'oto-note-mock-data'

type StoredData = {
  organizations: Organization[]
  seasons: Season[]
  memberships: Membership[]
  events: AppEvent[]
  responses: EventResponse[]
  boards: Board[]
  comments: Comment[]
  notifications: Notification[]
}

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

  /* ====== イベント操作 ====== */
  addEvent: (event: AppEvent) => void
  updateEvent: (eventId: string, updates: Partial<AppEvent>) => void
  deleteEvent: (eventId: string) => void

  /* ====== レスポンス操作 ====== */
  updateResponse: (eventId: string, userId: string, updates: Partial<EventResponse>) => void
  upsertResponse: (response: EventResponse) => void

  /* ====== 通知操作 ====== */
  markNotificationRead: (notifId: string) => void

  /* ====== 管理操作 ====== */
  resetAllData: () => void
}

export const MockDataContext = createContext<MockDataContextValue | null>(null)

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初期化時に localStorage を確認
  const getInitialData = (): StoredData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse mock data from localStorage', e)
    }
    return {
      organizations: mockOrganizations,
      seasons: mockSeasons,
      memberships: mockMemberships,
      events: mockEvents,
      responses: mockResponses,
      boards: mockBoards,
      comments: mockComments,
      notifications: mockNotifications,
    }
  }

  const initialData = getInitialData()

  const [organizations, setOrganizations] = useState<Organization[]>(initialData.organizations)
  const [seasons, setSeasons] = useState<Season[]>(initialData.seasons)
  const [memberships, setMemberships] = useState<Membership[]>(initialData.memberships)
  const [events, setEvents] = useState<AppEvent[]>(initialData.events)
  const [responses, setResponses] = useState<EventResponse[]>(initialData.responses)
  const [boards, setBoards] = useState<Board[]>(initialData.boards)
  const [comments, setComments] = useState<Comment[]>(initialData.comments)
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications)

  // データが更新されるたびに localStorage に保存
  useEffect(() => {
    const dataToStore: StoredData = {
      organizations,
      seasons,
      memberships,
      events,
      responses,
      boards,
      comments,
      notifications,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
  }, [organizations, seasons, memberships, events, responses, boards, comments, notifications])

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

  const updateEvent = useCallback((eventId: string, updates: Partial<AppEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, ...updates } as AppEvent : e))
    )
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    // イベント削除時に関連するレスポンスも削除
    setResponses((prev) => prev.filter((r) => r.eventId !== eventId))
  }, [])

  /* ====== レスポンス操作 ====== */
  const updateResponse = useCallback((eventId: string, userId: string, updates: Partial<EventResponse>) => {
    setResponses((prev) =>
      prev.map((r) =>
        r.eventId === eventId && r.userId === userId ? { ...r, ...updates } : r
      )
    )
  }, [])

  const upsertResponse = useCallback((response: EventResponse) => {
    setResponses((prev) => {
      const exists = prev.some((r) => r.eventId === response.eventId && r.userId === response.userId)
      if (exists) {
        return prev.map((r) =>
          r.eventId === response.eventId && r.userId === response.userId ? { ...r, ...response } : r
        )
      }
      return [...prev, response]
    })
  }, [])

  /* ====== 通知操作 ====== */
  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    )
  }, [])

  /* ====== 管理操作 ====== */
  const resetAllData = useCallback(() => {
    setOrganizations(mockOrganizations)
    setSeasons(mockSeasons)
    setMemberships(mockMemberships)
    setEvents(mockEvents)
    setResponses(mockResponses)
    setBoards(mockBoards)
    setComments(mockComments)
    setNotifications(mockNotifications)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: MockDataContextValue = {
    organizations, seasons, memberships, events, responses, boards, comments, notifications,
    addOrganization, updateOrganization,
    addSeason,
    addMembership, updateMembership,
    addEvent, updateEvent, deleteEvent,
    updateResponse, upsertResponse,
    markNotificationRead,
    resetAllData,
  }

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
}


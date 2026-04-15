import type { EventResponse } from '../types'

/**
 * モック回答データ
 * 出欠・集金の各ステータスパターンを網羅
 */
export const mockResponses: EventResponse[] = [
  /* ---- event-1 (全体練習) への出欠回答 ---- */
  {
    id: 'user-1',
    eventId: 'event-1',
    userId: 'user-1',
    status: 'present',
    updatedAt: '2026-04-02T08:00:00Z',
  },
  {
    id: 'user-2',
    eventId: 'event-1',
    userId: 'user-2',
    status: 'present',
    updatedAt: '2026-04-02T09:00:00Z',
  },
  {
    id: 'user-3',
    eventId: 'event-1',
    userId: 'user-3',
    status: 'absent',
    detail: '仕事の都合で欠席します',
    updatedAt: '2026-04-03T18:00:00Z',
  },

  /* ---- event-2 (演奏会参加費) への集金回答 ---- */
  {
    id: 'user-1',
    eventId: 'event-2',
    userId: 'user-1',
    status: 'receipt_verified', // 受領確認済（双方向確認完了）
    updatedAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'user-2',
    eventId: 'event-2',
    userId: 'user-2',
    status: 'paid_reported', // 支払報告済（幹部確認待ち）
    updatedAt: '2026-04-10T15:00:00Z',
  },
  {
    id: 'user-3',
    eventId: 'event-2',
    userId: 'user-3',
    status: 'unpaid', // 未払い
    updatedAt: '2026-04-01T10:00:00Z',
  },

  /* ---- event-3 (お知らせ) への確認回答 ---- */
  {
    id: 'user-1',
    eventId: 'event-3',
    userId: 'user-1',
    status: 'confirmed',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'user-2',
    eventId: 'event-3',
    userId: 'user-2',
    status: 'unanswered', // 未確認
    updatedAt: '2026-04-10T09:00:00Z',
  },
]

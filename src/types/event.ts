/**
 * イベント型定義（ユニバーサル・イベントモデル）
 * 基本設計書 §5 — コレクション: events
 * 要件定義書 §4.4 — スケジュール・タスク機能の統合
 *
 * 共通フィールド (EventBase) + カテゴリ固有フィールドの判別共用型で表現
 */

/** イベントカテゴリ */
export type EventCategory =
  | 'practice'   // 練習（全体練習）
  | 'section'    // セクション練習
  | 'billing'    // 集金
  | 'survey'     // アンケート
  | 'notice'     // お知らせ
  | 'duty'       // 当番
  | 'return'     // 備品返却

/** タイムテーブルの1エントリ */
export type TimetableEntry = {
  /** 開始時刻 (HH:mm) */
  startTime: string
  /** 終了時刻 (HH:mm) */
  endTime: string
  /** 内容 */
  content: string
  /** 場所 */
  location?: string
}

/* ================================
 * イベント共通フィールド
 * ================================ */
export type EventBase = {
  id: string
  orgId: string
  seasonId: string
  title: string
  memo?: string
  /** このイベントの対象メンバーのUID配列 */
  targetUserIds: string[]
  /** 作成者のUID */
  authorId: string
  /** 責任者のUID（ステータス管理権限を持つ） */
  managerId: string
  createdAt: string
}

/* ================================
 * カテゴリ別イベント型
 * ================================ */

/** 練習（全体練習） */
export type PracticeEvent = EventBase & {
  category: 'practice'
  /** 練習日 (YYYY-MM-DD) */
  date: string
  /** タイムテーブル */
  timetable: TimetableEntry[]
  /** 外部カレンダー連携用ID */
  externalCalendarEventId?: string
}

/** セクション練習 */
export type SectionEvent = EventBase & {
  category: 'section'
  date: string
  timetable: TimetableEntry[]
  /** 対象セクション名 */
  targetSection?: string
}

/** 集金 */
export type BillingEvent = EventBase & {
  category: 'billing'
  /** 支払期限 (YYYY-MM-DD) */
  dueDate: string
  /** 金額（円） */
  amount: number
}

/** アンケート */
export type SurveyEvent = EventBase & {
  category: 'survey'
  dueDate: string
  /** 外部アンケートフォームURL */
  formUrl: string
}

/** お知らせ */
export type NoticeEvent = EventBase & {
  category: 'notice'
  /** 確認期限（任意） */
  dueDate?: string
}

/** 当番 */
export type DutyEvent = EventBase & {
  category: 'duty'
  /** 当番日 (YYYY-MM-DD) */
  date: string
  dueDate?: string
}

/** 備品返却 */
export type ReturnEvent = EventBase & {
  category: 'return'
  dueDate: string
  /** 返却対象物のリスト */
  items: string[]
}

/** イベント（すべてのカテゴリのユニオン型） */
export type AppEvent =
  | PracticeEvent
  | SectionEvent
  | BillingEvent
  | SurveyEvent
  | NoticeEvent
  | DutyEvent
  | ReturnEvent

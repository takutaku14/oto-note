/**
 * レスポンス（回答）型定義
 * 基本設計書 §5 — コレクション: responses（イベントのサブコレクション）
 * 要件定義書 §4.4 — 出欠・集金の双方向確認ステップ
 */

/** 出欠のステータス */
export type AttendanceStatus = 'unanswered' | 'present' | 'absent' | 'pending'

/** 集金のステータス（双方向確認ステップ） */
export type BillingStatus = 'unpaid' | 'paid_reported' | 'receipt_verified'

/** 汎用タスクのステータス（お知らせ確認・当番・備品返却） */
export type TaskStatus = 'unanswered' | 'confirmed'

/** アンケートのステータス */
export type SurveyStatus = 'unanswered' | 'answered'

/** 全ステータスのユニオン型 */
export type ResponseStatus =
  | AttendanceStatus
  | BillingStatus
  | TaskStatus
  | SurveyStatus

/** イベントに対するメンバーの回答 */
export type EventResponse = {
  /** レスポンスID（= userId と同値） */
  id: string
  /** 対象イベントID */
  eventId: string
  /** 回答者のUID */
  userId: string
  /** 回答ステータス */
  status: ResponseStatus
  /** 付加情報（欠席理由など） */
  detail?: string
  /** 最終更新日時 (ISO 8601) */
  updatedAt: string
}

/**
 * 通知型定義
 * 基本設計書 §5 — コレクション: notifications（membershipsのサブコレクション）
 * 要件定義書 §4.7 — プッシュ通知と「アプリ内通知センター」
 */

/** 通知の種別 */
export type NotificationType =
  | 'important_notice'   // 重要なお知らせ
  | 'manager_assigned'   // 責任者への任命
  | 'reminder'           // リマインド（将来拡張）

/** アプリ内通知（個人の通知インボックス） */
export type Notification = {
  id: string
  /** 通知元の団体ID */
  orgId: string
  /** 送信先ユーザーのUID */
  userId: string
  /** 通知種別 */
  type: NotificationType
  /** 通知タイトル */
  title: string
  /** 通知本文 */
  body: string
  /** タップ時の遷移先パス（アプリ内ルーティング） */
  link: string
  /** 既読フラグ */
  isRead: boolean
  /** 作成日時 (ISO 8601) */
  createdAt: string
}

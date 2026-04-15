/**
 * メンバーシップ型定義
 * 基本設計書 §5 — コレクション: memberships（団体のサブコレクション）
 * 要件定義書 §4.6 — 階層型パート・バッジ・ステータス管理
 */

/** システム権限ロール */
export type MemberRole = 'admin' | 'member'

/** 在籍ステータス */
export type MemberStatus =
  | 'active'     // 現役
  | 'inactive'   // 休団
  | 'withdrawn'  // 退団（論理削除）

/** メンバーシップ（ユーザーと団体の所属関係） */
export type Membership = {
  /** ユーザーのUID */
  userId: string
  /** 所属する団体のID */
  orgId: string
  /** システム権限（幹部 / 一般メンバー） */
  role: MemberRole
  /** セクション名（例：「弦楽器」） */
  section: string
  /** パート名（例：「第1ヴァイオリン」） */
  part: string
  /** 役職バッジ（例：['インスペクター', 'パートリーダー']） */
  badges: string[]
  /** 在籍ステータス */
  status: MemberStatus
  /** 表示名（ユーザーの displayName のキャッシュ） */
  displayName: string
}

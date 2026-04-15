/**
 * ユーザー型定義
 * 基本設計書 §5 — コレクション: users
 */
export type User = {
  /** Firebase Auth の UID */
  uid: string
  /** メールアドレス */
  email: string
  /** 表示名 */
  displayName: string
  /** 現在選択中の団体ID */
  currentOrgId?: string
  /** FCM プッシュ通知用デバイストークン（複数端末対応） */
  fcmTokens: string[]
}

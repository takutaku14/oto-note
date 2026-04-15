/**
 * 団体・シーズン型定義
 * 基本設計書 §5 — コレクション: organizations, seasons
 */

/** 団体（テナント） */
export type Organization = {
  /** 団体の一意識別子 */
  id: string
  /** 団体名 */
  name: string
  /** 招待リンク用トークン */
  inviteToken: string
  /** 作成日時 (ISO 8601) */
  createdAt: string
  /** 現在アクティブなシーズンID */
  currentSeasonId?: string
  /** 団体カラー（タイムラインのバッジ表示用） */
  color?: string
  /** OAuth連携で取得した外部APIトークン（幹部設定用） */
  googleAuthTokens?: Record<string, string>
}

/** シーズン（公演期間） */
export type Season = {
  /** シーズンの一意識別子 */
  id: string
  /** 所属する団体のID */
  orgId: string
  /** シーズン名（例：「第10回定期演奏会」） */
  title: string
  /** 本番日 (ISO 8601 日付文字列) — カウントダウン表示に使用 */
  concertDate?: string
  /** 作成日時 (ISO 8601) */
  createdAt: string
}

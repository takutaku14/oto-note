/**
 * 掲示板型定義
 * 基本設計書 §5 — コレクション: boards（団体のサブコレクション）
 * 要件定義書 §4.5 — 掲示板・コミュニケーション機能
 */

/** 掲示板カテゴリ */
export type BoardCategory =
  | 'question'    // 質問
  | 'discussion'  // 議論
  | 'free_talk'   // 雑談
  | 'general'     // その他

/** 掲示板スレッド */
export type Board = {
  id: string
  orgId: string
  seasonId: string
  /** カテゴリ */
  category: BoardCategory
  /** スレッドタイトル */
  title: string
  /** 本文 */
  body: string
  /** 作成者UID */
  authorId: string
  /**
   * 閲覧可能な対象メンバーのUID配列
   * 空配列の場合は全員公開
   */
  targetUserIds: string[]
  /** Google Drive等への共有資料リンク */
  externalLinks: string[]
  createdAt: string
}

/** コメント */
export type Comment = {
  id: string
  /** 所属するスレッドID */
  boardId: string
  /** 投稿者UID */
  authorId: string
  /** コメント本文 */
  body: string
  /** 添付された外部リンク */
  externalLinks: string[]
  createdAt: string
}

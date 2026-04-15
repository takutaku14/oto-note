import type { Board, Comment } from '../types'

/** モック掲示板スレッドデータ */
export const mockBoards: Board[] = [
  {
    id: 'board-1',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'discussion',
    title: '次回の選曲について',
    body: '次回定期演奏会の選曲案を募集します。ジャンル問わずご提案ください！',
    authorId: 'user-1',
    targetUserIds: [], // 全員公開
    externalLinks: [],
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'board-2',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'free_talk',
    title: '雑談スレッド 🎶',
    body: '練習の合間のひとやすみ。自由に話しましょう！',
    authorId: 'user-2',
    targetUserIds: [], // 全員公開
    externalLinks: [],
    createdAt: '2026-03-20T14:00:00Z',
  },
  {
    id: 'board-3',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'question',
    title: '【幹部会議】次期シーズンの方針について',
    body: '幹部メンバー限定の議論スレッドです。',
    authorId: 'user-1',
    targetUserIds: ['user-1'], // 幹部のみ
    externalLinks: [],
    createdAt: '2026-04-01T09:00:00Z',
  },
]

/** モックコメントデータ */
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    boardId: 'board-1',
    authorId: 'user-2',
    body: 'ドヴォルザークの「新世界より」はいかがでしょうか？みんな知っている曲で集客にも良さそうです。',
    externalLinks: [],
    createdAt: '2026-03-16T08:00:00Z',
  },
  {
    id: 'comment-2',
    boardId: 'board-1',
    authorId: 'user-3',
    body: 'ブラームスの交響曲第1番も候補に入れたいです！弦楽器が大活躍できます 🎻',
    externalLinks: [],
    createdAt: '2026-03-16T12:00:00Z',
  },
  {
    id: 'comment-3',
    boardId: 'board-1',
    authorId: 'user-1',
    body: 'どちらも良いですね。次回練習時に投票を取りましょう。参考楽譜のリンクを共有します。',
    externalLinks: ['https://drive.google.com/example/scores'],
    createdAt: '2026-03-17T10:00:00Z',
  },
]

import type { AppEvent } from '../types'

/**
 * モックイベントデータ
 * 各カテゴリの代表的なイベントを1件ずつ用意
 */
export const mockEvents: AppEvent[] = [
  /* ---- 練習 (practice) ---- */
  {
    id: 'event-1',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'practice',
    title: '第3回全体練習',
    memo: '弦楽器は弓順の確認をお願いします。',
    targetUserIds: ['user-1', 'user-2', 'user-3'],
    authorId: 'user-1',
    managerId: 'user-1',
    createdAt: '2026-04-01T10:00:00Z',
    date: '2026-05-10',
    timetable: [
      { startTime: '13:00', endTime: '14:30', content: '弦楽器セクション練習', location: 'A練習室' },
      { startTime: '14:45', endTime: '17:00', content: '全体合奏', location: 'メインホール' },
    ],
  },

  /* ---- 集金 (billing) ---- */
  {
    id: 'event-2',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'billing',
    title: '演奏会参加費',
    memo: '銀行振込または次回練習時に現金でお支払いください。',
    targetUserIds: ['user-1', 'user-2', 'user-3'],
    authorId: 'user-1',
    managerId: 'user-1',
    createdAt: '2026-04-01T10:00:00Z',
    dueDate: '2026-05-31',
    amount: 5000,
  },

  /* ---- お知らせ (notice) ---- */
  {
    id: 'event-3',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'notice',
    title: '演奏会チラシのデザイン決定',
    memo: '添付の画像をご確認ください。修正意見がある方は掲示板へお願いします。',
    targetUserIds: ['user-1', 'user-2', 'user-3'],
    authorId: 'user-1',
    managerId: 'user-1',
    createdAt: '2026-04-10T09:00:00Z',
    dueDate: '2026-04-20',
  },

  /* ---- アンケート (survey) ---- */
  {
    id: 'event-4',
    orgId: 'org-2',
    seasonId: 'season-2',
    category: 'survey',
    title: '春コンサート打ち上げアンケート',
    memo: '出欠と食物アレルギーの有無を回答してください。',
    targetUserIds: ['user-1', 'user-2'],
    authorId: 'user-2',
    managerId: 'user-2',
    createdAt: '2026-04-05T12:00:00Z',
    dueDate: '2026-05-15',
    formUrl: 'https://forms.google.com/example',
  },

  /* ---- 当番 (duty) ---- */
  {
    id: 'event-5',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'duty',
    title: '練習室の鍵当番',
    memo: '練習開始30分前に到着してください。鍵は事務室で受け取ります。',
    targetUserIds: ['user-2'],
    authorId: 'user-1',
    managerId: 'user-2',
    createdAt: '2026-04-08T14:00:00Z',
    date: '2026-05-10',
  },

  /* ---- セクション練習 (section) ---- */
  {
    id: 'event-6',
    orgId: 'org-1',
    seasonId: 'season-1',
    category: 'section',
    title: '弦楽器セクション自主練',
    memo: '後半の弦楽合奏曲を中心に練習します。',
    targetUserIds: ['user-1', 'user-3'],
    authorId: 'user-1',
    managerId: 'user-1',
    createdAt: '2026-04-12T11:00:00Z',
    date: '2026-05-03',
    timetable: [
      { startTime: '10:00', endTime: '12:00', content: '弦楽合奏曲 通し練習', location: 'B練習室' },
    ],
    targetSection: '弦楽器',
  },
]

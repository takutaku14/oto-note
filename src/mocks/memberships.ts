import type { Membership } from '../types'

/**
 * モックメンバーシップデータ
 * マルチテナント構造: 同一ユーザーが複数団体に所属可能
 */
export const mockMemberships: Membership[] = [
  /* ================================
   * org-1: アンサンブル・ソノーレ
   * ================================ */
  {
    userId: 'user-1',
    orgId: 'org-1',
    role: 'admin',
    section: '弦楽器',
    part: '第1ヴァイオリン',
    badges: ['インスペクター'],
    status: 'active',
    displayName: '田中 太郎',
  },
  {
    userId: 'user-2',
    orgId: 'org-1',
    role: 'member',
    section: '木管楽器',
    part: 'フルート',
    badges: ['パートリーダー'],
    status: 'active',
    displayName: '鈴木 花子',
  },
  {
    userId: 'user-3',
    orgId: 'org-1',
    role: 'member',
    section: '弦楽器',
    part: 'チェロ',
    badges: [],
    status: 'active',
    displayName: '佐藤 一郎',
  },
  {
    userId: 'user-4',
    orgId: 'org-1',
    role: 'member',
    section: '金管楽器',
    part: 'ホルン',
    badges: [],
    status: 'inactive', // 休団中
    displayName: '山田 美咲',
  },
  {
    userId: 'user-5',
    orgId: 'org-1',
    role: 'member',
    section: '弦楽器',
    part: 'ヴィオラ',
    badges: [],
    status: 'withdrawn', // 退団済み
    displayName: '渡辺 健太',
  },

  /* ================================
   * org-2: 室内楽の会 コン・ブリオ
   * ================================ */
  {
    userId: 'user-1',
    orgId: 'org-2',
    role: 'member',
    section: '弦楽器',
    part: '第1ヴァイオリン',
    badges: [],
    status: 'active',
    displayName: '田中 太郎',
  },
  {
    userId: 'user-2',
    orgId: 'org-2',
    role: 'admin',
    section: '木管楽器',
    part: 'フルート',
    badges: [],
    status: 'active',
    displayName: '鈴木 花子',
  },
]

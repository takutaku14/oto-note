import type { User } from '../types'

/** 現在ログイン中のユーザーID（モック用） */
export const CURRENT_USER_ID = 'user-1'

/** モックユーザーデータ */
export const mockUsers: User[] = [
  {
    uid: 'user-1',
    email: 'tanaka@example.com',
    displayName: '田中 太郎',
    currentOrgId: 'org-1',
    fcmTokens: [],
  },
  {
    uid: 'user-2',
    email: 'suzuki@example.com',
    displayName: '鈴木 花子',
    currentOrgId: 'org-1',
    fcmTokens: [],
  },
  {
    uid: 'user-3',
    email: 'sato@example.com',
    displayName: '佐藤 一郎',
    currentOrgId: 'org-1',
    fcmTokens: [],
  },
  {
    uid: 'user-4',
    email: 'yamada@example.com',
    displayName: '山田 美咲',
    currentOrgId: 'org-1',
    fcmTokens: [],
  },
  {
    uid: 'user-5',
    email: 'watanabe@example.com',
    displayName: '渡辺 健太',
    currentOrgId: 'org-2',
    fcmTokens: [],
  },
]

import type { Notification } from '../types'

/** モック通知データ（user-1 宛） */
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    orgId: 'org-1',
    userId: 'user-1',
    type: 'important_notice',
    title: '演奏会チラシのデザイン決定',
    body: 'チラシデザインが確定しました。イベント詳細画面からご確認ください。',
    link: '/org/org-1/events/event-3',
    isRead: false,
    createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'notif-2',
    orgId: 'org-1',
    userId: 'user-1',
    type: 'manager_assigned',
    title: '鍵当番の責任者に任命されました',
    body: '5/10 の練習室鍵当番の責任者として田中 太郎さんが指名されました。',
    link: '/org/org-1/events/event-5',
    isRead: true,
    createdAt: '2026-04-08T14:00:00Z',
  },
  {
    id: 'notif-3',
    orgId: 'org-2',
    userId: 'user-1',
    type: 'important_notice',
    title: '打ち上げアンケートのお願い',
    body: '春コンサートの打ち上げについて、出欠とアレルギー情報のアンケートにご回答ください。',
    link: '/org/org-2/events/event-4',
    isRead: false,
    createdAt: '2026-04-05T12:00:00Z',
  },
]

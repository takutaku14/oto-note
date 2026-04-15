import type { Season } from '../types'

/** モックシーズンデータ */
export const mockSeasons: Season[] = [
  {
    id: 'season-1',
    orgId: 'org-1',
    title: '第10回定期演奏会',
    concertDate: '2026-07-15',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'season-2',
    orgId: 'org-2',
    title: '春のサロンコンサート',
    concertDate: '2026-06-01',
    createdAt: '2026-02-01T00:00:00Z',
  },
]

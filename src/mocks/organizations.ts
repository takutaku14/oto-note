import type { Organization } from '../types'

/** モック団体データ（2団体） */
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'アンサンブル・ソノーレ',
    inviteToken: 'invite-sonore-abc123',
    createdAt: '2024-04-01T00:00:00Z',
    currentSeasonId: 'season-1',
    color: '#007AFF',
  },
  {
    id: 'org-2',
    name: '室内楽の会 コン・ブリオ',
    inviteToken: 'invite-conbrio-def456',
    createdAt: '2025-01-15T00:00:00Z',
    currentSeasonId: 'season-2',
    color: '#34C759',
  },
]

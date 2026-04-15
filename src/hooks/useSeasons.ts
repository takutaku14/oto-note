/**
 * useSeasons — シーズンデータのアクセス・操作を提供する Hook
 */

import { useCallback, useMemo } from 'react'
import { useMockData } from './useMockData'
import { useCurrentOrg } from './useCurrentOrg'
import type { Season } from '../types'

export const useSeasons = () => {
  const { org } = useCurrentOrg()
  const data = useMockData()

  /** 現在の団体に属するシーズン一覧（作成日順） */
  const seasons = useMemo(
    () =>
      data.seasons
        .filter((s) => s.orgId === org.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [data.seasons, org.id]
  )

  /** アクティブシーズン */
  const activeSeason = useMemo(
    () => seasons.find((s) => s.id === org.currentSeasonId),
    [seasons, org.currentSeasonId]
  )

  /** 新規シーズンを作成 */
  const createSeason = useCallback(
    (title: string, concertDate?: string) => {
      const seasonId = `season-${Date.now()}`
      const season: Season = {
        id: seasonId,
        orgId: org.id,
        title,
        concertDate,
        createdAt: new Date().toISOString(),
      }
      data.addSeason(season)
      return seasonId
    },
    [org.id, data]
  )

  /** アクティブシーズンを切り替え */
  const setActiveSeason = useCallback(
    (seasonId: string) => {
      data.updateOrganization(org.id, { currentSeasonId: seasonId })
    },
    [org.id, data]
  )

  return {
    seasons,
    activeSeason,
    createSeason,
    setActiveSeason,
  }
}

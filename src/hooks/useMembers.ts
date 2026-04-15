/**
 * useMembers — メンバーデータのアクセス・操作を提供する Hook
 */

import { useCallback, useMemo } from 'react'
import { useMockData } from './useMockData'
import { useCurrentOrg } from './useCurrentOrg'
import type { MemberRole, MemberStatus } from '../types'

export const useMembers = () => {
  const { org } = useCurrentOrg()
  const data = useMockData()

  /** 全メンバー（退団者も含む） */
  const allMembers = useMemo(
    () => data.memberships.filter((m) => m.orgId === org.id),
    [data.memberships, org.id]
  )

  /** 退団者を除くメンバー */
  const activeMembers = useMemo(
    () => allMembers.filter((m) => m.status !== 'withdrawn'),
    [allMembers]
  )

  /** 一般名簿用（退団者非表示） */
  const visibleMembers = useMemo(
    () => activeMembers,
    [activeMembers]
  )

  /** セクション別にグルーピング */
  const groupBySection = useCallback(
    (members: typeof allMembers) => {
      const groups: Record<string, typeof allMembers> = {}
      for (const m of members) {
        const section = m.section || 'セクション未設定'
        if (!groups[section]) groups[section] = []
        groups[section].push(m)
      }
      return groups
    },
    []
  )

  /** ステータスでフィルタ */
  const filterByStatus = useCallback(
    (status: MemberStatus | 'all') => {
      if (status === 'all') return allMembers
      return allMembers.filter((m) => m.status === status)
    },
    [allMembers]
  )

  /** ステータス変更 */
  const updateMemberStatus = useCallback(
    (userId: string, status: MemberStatus) => {
      data.updateMembership(userId, org.id, { status })
    },
    [data, org.id]
  )

  /** ロール変更 */
  const updateMemberRole = useCallback(
    (userId: string, role: MemberRole) => {
      data.updateMembership(userId, org.id, { role })
    },
    [data, org.id]
  )

  /** バッジ更新 */
  const updateMemberBadges = useCallback(
    (userId: string, badges: string[]) => {
      data.updateMembership(userId, org.id, { badges })
    },
    [data, org.id]
  )

  return {
    allMembers,
    activeMembers,
    visibleMembers,
    groupBySection,
    filterByStatus,
    updateMemberStatus,
    updateMemberRole,
    updateMemberBadges,
  }
}

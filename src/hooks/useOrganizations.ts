/**
 * useOrganizations — 団体データのアクセス・操作を提供する Hook
 *
 * - 退団済み団体の除外ロジック
 * - 新規団体の作成（admin として自動登録）
 * - 招待トークンでの参加
 */

import { useCallback, useMemo } from 'react'
import { useMockData } from './useMockData'
import { useAuth } from './useAuth'
import type { Organization, Membership } from '../types'

export const useOrganizations = () => {
  const { currentUser } = useAuth()
  const data = useMockData()

  /** 現在ユーザーのメンバーシップ一覧（全団体） */
  const myMemberships = useMemo(
    () => data.memberships.filter((m) => m.userId === currentUser?.uid),
    [data.memberships, currentUser]
  )

  /** 所属団体一覧（退団済みを除外） */
  const organizations = useMemo(() => {
    const activeOrgIds = myMemberships
      .filter((m) => m.status !== 'withdrawn')
      .map((m) => m.orgId)
    return data.organizations.filter((o) => activeOrgIds.includes(o.id))
  }, [data.organizations, myMemberships])

  /** 団体IDからメンバーシップ情報を取得 */
  const getMembershipForOrg = useCallback(
    (orgId: string) => myMemberships.find((m) => m.orgId === orgId),
    [myMemberships]
  )

  /** 新規団体を作成（作成者を admin として自動登録） */
  const createOrganization = useCallback(
    (name: string) => {
      if (!currentUser) return

      const orgId = `org-${Date.now()}`
      const org: Organization = {
        id: orgId,
        name,
        inviteToken: `invite-${orgId}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      }

      const membership: Membership = {
        userId: currentUser.uid,
        orgId,
        role: 'admin',
        section: '',
        part: '',
        badges: [],
        status: 'active',
        displayName: currentUser.displayName,
      }

      data.addOrganization(org)
      data.addMembership(membership)

      return orgId
    },
    [currentUser, data]
  )

  /** 招待トークンで団体に参加 */
  const joinOrganization = useCallback(
    (inviteToken: string, section: string, part: string) => {
      if (!currentUser) return null

      const org = data.organizations.find((o) => o.inviteToken === inviteToken)
      if (!org) return null

      // 既に所属している場合はその団体IDを返す
      const existing = data.memberships.find(
        (m) => m.userId === currentUser.uid && m.orgId === org.id
      )
      if (existing) return org.id

      const membership: Membership = {
        userId: currentUser.uid,
        orgId: org.id,
        role: 'member',
        section,
        part,
        badges: [],
        status: 'active',
        displayName: currentUser.displayName,
      }

      data.addMembership(membership)
      return org.id
    },
    [currentUser, data]
  )

  /** 招待トークンから団体を検索 */
  const findOrgByInviteToken = useCallback(
    (token: string) => data.organizations.find((o) => o.inviteToken === token),
    [data.organizations]
  )

  /** 既に所属しているか確認 */
  const isAlreadyMember = useCallback(
    (orgId: string) => data.memberships.some((m) => m.userId === currentUser?.uid && m.orgId === orgId),
    [data.memberships, currentUser]
  )

  return {
    organizations,
    myMemberships,
    getMembershipForOrg,
    createOrganization,
    joinOrganization,
    findOrgByInviteToken,
    isAlreadyMember,
  }
}

/**
 * OrgContext — 現在の団体・シーズン・メンバーシップ情報
 *
 * OrgGuard 内で提供され、/org/:orgId 配下の全コンポーネントで使用可能。
 * URL パラメータ :orgId から自動的に団体情報を解決する。
 */

import { createContext } from 'react'
import type { Organization, Season, Membership } from '../types'

/** OrgContext が提供する型 */
export type OrgContextValue = {
  /** 現在の団体 */
  org: Organization
  /** アクティブなシーズン（未設定の場合は undefined） */
  season: Season | undefined
  /** 現在ユーザーのこの団体での Membership */
  membership: Membership
  /** 幹部かどうかのショートカット */
  isAdmin: boolean
}

export const OrgContext = createContext<OrgContextValue | null>(null)

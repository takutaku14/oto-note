/**
 * OrgGuard — 団体メンバーシップガード
 *
 * URL パラメータ :orgId から団体情報を解決し、OrgContext に提供する。
 * 退団者の場合はアクセス拒否画面を表示する。
 */

import { useParams, Outlet, Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useMockData } from '../../hooks/useMockData'
import { OrgContext } from '../../contexts/OrgContext'

export const OrgGuard: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>()
  const { currentUser } = useAuth()
  const data = useMockData()

  // 団体を検索
  const org = data.organizations.find((o) => o.id === orgId)

  // 団体が見つからない
  if (!org) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-20">
        <ShieldX className="w-16 h-16 text-label-tertiary mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">団体が見つかりません</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          この団体は存在しないか、削除されています。
        </p>
        <Link to="/" className="text-body text-tint active:opacity-50 transition-opacity">
          ホームに戻る
        </Link>
      </div>
    )
  }

  // 現在ユーザーのメンバーシップを検索
  const membership = data.memberships.find(
    (m) => m.userId === currentUser?.uid && m.orgId === orgId
  )

  // メンバーシップが無い または 退団済み → アクセス拒否
  if (!membership || membership.status === 'withdrawn') {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-20">
        <ShieldX className="w-16 h-16 text-orange-500 mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">アクセスできません</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          この団体にはアクセスする権限がありません。
          {membership?.status === 'withdrawn' && (
            <>
              <br />
              退団済みのため、この団体の情報は閲覧できません。
            </>
          )}
        </p>
        <Link to="/" className="text-body text-tint active:opacity-50 transition-opacity">
          ホームに戻る
        </Link>
      </div>
    )
  }

  // アクティブシーズンを取得
  const season = org.currentSeasonId
    ? data.seasons.find((s) => s.id === org.currentSeasonId)
    : undefined

  // OrgContext に値を提供
  const contextValue = {
    org,
    season,
    membership,
    isAdmin: membership.role === 'admin',
  }

  return (
    <OrgContext.Provider value={contextValue}>
      <Outlet />
    </OrgContext.Provider>
  )
}

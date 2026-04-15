/**
 * AdminGuard — 幹部権限ガード
 * OrgContext の membership.role が admin でない場合はアクセス拒否
 */

import { Outlet, Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'

export const AdminGuard: React.FC = () => {
  const { isAdmin, org } = useCurrentOrg()

  if (!isAdmin) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-20">
        <ShieldAlert className="w-16 h-16 text-orange-500 mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">権限がありません</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          この画面は幹部（管理者）専用です。
        </p>
        <Link
          to={`/org/${org.id}`}
          className="text-body text-tint active:opacity-50 transition-opacity"
        >
          ダッシュボードに戻る
        </Link>
      </div>
    )
  }

  return <Outlet />
}

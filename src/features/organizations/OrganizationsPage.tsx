/**
 * 団体一覧ページ
 * 所属団体の一覧表示 + 新規作成モーダル
 * 退団済み団体は自動的に除外される
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Shield, ChevronRight } from 'lucide-react'
import { useOrganizations } from '../../hooks/useOrganizations'
import { CreateOrgSheet } from './CreateOrgSheet'

export const OrganizationsPage: React.FC = () => {
  const { organizations, getMembershipForOrg } = useOrganizations()
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div
      className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]"
    >
      {/* ナビゲーションバー風ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-large-title font-bold text-label">団体</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-tint text-white active:scale-90 transition-transform duration-150"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 団体リスト */}
      <div className="px-4 pt-4">
        {organizations.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <p className="text-headline text-label mb-1">まだ団体に参加していません</p>
            <p className="text-subhead text-label-secondary text-center">
              招待リンクから参加するか、
              <br />
              新しい団体を作成しましょう
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
            {organizations.map((org, index) => {
              const membership = getMembershipForOrg(org.id)
              return (
                <button
                  key={org.id}
                  onClick={() => navigate(`/org/${org.id}`)}
                  className="relative flex w-full items-center py-3 px-4 text-left active:bg-fill transition-colors duration-150"
                >
                  {/* 団体カラーアイコン */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 text-white font-bold text-headline"
                    style={{ backgroundColor: org.color || 'rgb(var(--color-tint))' }}
                  >
                    {org.name.charAt(0)}
                  </div>

                  {/* 団体情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-body text-label truncate">{org.name}</p>
                      {membership?.role === 'admin' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50">
                          <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-caption-2 font-medium text-blue-600 dark:text-blue-400">幹部</span>
                        </span>
                      )}
                    </div>
                    {membership && (
                      <p className="text-caption-1 text-label-tertiary mt-0.5">
                        {membership.part || membership.section || 'パート未設定'}
                        {membership.status === 'inactive' && ' · 休団中'}
                      </p>
                    )}
                  </div>

                  {/* シェブロン */}
                  <ChevronRight className="w-5 h-5 text-label-tertiary flex-shrink-0" />

                  {/* セパレーター */}
                  {index < organizations.length - 1 && (
                    <div className="absolute bottom-0 left-[4.75rem] right-0 h-[0.5px] bg-separator" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 団体作成モーダル */}
      <CreateOrgSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}

/**
 * メンバー管理画面（幹部専用）
 * 退団者も含む全メンバー表示 + ステータスフィルター + 詳細編集シート
 */

import { useState, useMemo } from 'react'
import { Shield, ChevronRight } from 'lucide-react'
import { useMembers } from '../../hooks/useMembers'
import { Badge } from '../../components/ui/Badge'
import { MemberDetailSheet } from './MemberDetailSheet'
import type { Membership, MemberStatus } from '../../types'

/** フィルターの選択肢 */
const STATUS_FILTERS: { value: MemberStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全員' },
  { value: 'active', label: '現役' },
  { value: 'inactive', label: '休団' },
  { value: 'withdrawn', label: '退団' },
]

export const MemberManagePage: React.FC = () => {
  const { allMembers, filterByStatus, groupBySection } = useMembers()
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all')
  const [selectedMember, setSelectedMember] = useState<Membership | null>(null)

  const filteredMembers = useMemo(
    () => filterByStatus(statusFilter),
    [filterByStatus, statusFilter]
  )
  const grouped = groupBySection(filteredMembers)
  const sectionNames = Object.keys(grouped)

  /** ステータスに応じたバッジバリアント */
  const statusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'active':
        return <Badge label="現役" variant="success" />
      case 'inactive':
        return <Badge label="休団" variant="warning" />
      case 'withdrawn':
        return <Badge label="退団" variant="danger" />
    }
  }

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center gap-3 px-4 py-3">
          <Shield className="w-6 h-6 text-label" />
          <h1 className="text-large-title font-bold text-label">メンバー管理</h1>
          <span className="text-subhead text-label-secondary ml-auto">
            {allMembers.length}名
          </span>
        </div>
      </div>

      {/* ステータスフィルター（セグメントコントロール） */}
      <div className="px-4 pt-4">
        <div className="flex rounded-xl bg-fill p-1 gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex-1 py-2 rounded-lg text-subhead font-medium transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-background-grouped-secondary text-label shadow-sm'
                  : 'text-label-secondary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* メンバーリスト */}
      {sectionNames.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-headline text-label-secondary">該当するメンバーがいません</p>
        </div>
      ) : (
        sectionNames.map((section) => (
          <div key={section} className="px-4 pt-4">
            <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
              {section}（{grouped[section].length}名）
            </h2>
            <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
              {grouped[section].map((member, index) => (
                <button
                  key={member.userId}
                  onClick={() => setSelectedMember(member)}
                  className="relative flex w-full items-center py-3 px-4 text-left active:bg-fill transition-colors duration-150"
                >
                  {/* アバター */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      member.status === 'withdrawn' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-fill'
                    }`}
                  >
                    <span
                      className={`text-headline ${
                        member.status === 'withdrawn'
                          ? 'text-red-400'
                          : 'text-label-secondary'
                      }`}
                    >
                      {member.displayName.charAt(0)}
                    </span>
                  </div>

                  {/* メンバー情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-body text-label">{member.displayName}</span>
                      {statusBadge(member.status)}
                      {member.role === 'admin' && <Badge label="幹部" variant="primary" />}
                      {member.badges.map((badge) => (
                        <Badge key={badge} label={badge} variant="default" />
                      ))}
                    </div>
                    <p className="text-caption-1 text-label-tertiary mt-0.5">
                      {member.part || 'パート未設定'}
                    </p>
                  </div>

                  {/* シェブロン */}
                  <ChevronRight className="w-5 h-5 text-label-tertiary flex-shrink-0" />

                  {/* セパレーター */}
                  {index < grouped[section].length - 1 && (
                    <div className="absolute bottom-0 left-[4.25rem] right-0 h-[0.5px] bg-separator" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      {/* メンバー詳細シート */}
      <MemberDetailSheet
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  )
}

/**
 * MemberSelector — 対象者の一括選択コンポーネント
 * 要件定義書 §4.3 — セクション/バッジ/権限でのショートカット選択
 *
 * イベント作成、掲示板作成で共通利用する。
 * 休団者はデフォルト未選択だが手動で選択可能。
 */

import { useMemo, useCallback } from 'react'
import { Check, Users, Shield } from 'lucide-react'
import { useMembers } from '../../hooks/useMembers'
import { Badge } from '../ui/Badge'

type MemberSelectorProps = {
  /** 選択中のユーザーIDリスト */
  selectedUserIds: string[]
  /** 選択変更コールバック */
  onChange: (ids: string[]) => void
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  selectedUserIds,
  onChange,
}) => {
  const { activeMembers, allMembers, groupBySection } = useMembers()

  // 退団者を除いたメンバー（選択対象）
  const selectableMembers = useMemo(
    () => allMembers.filter((m) => m.status !== 'withdrawn'),
    [allMembers]
  )

  const grouped = groupBySection(selectableMembers)
  const sectionNames = Object.keys(grouped)

  // ユニークなバッジ一覧
  const uniqueBadges = useMemo(() => {
    const badges = new Set<string>()
    for (const m of selectableMembers) {
      for (const b of m.badges) badges.add(b)
    }
    return Array.from(badges)
  }, [selectableMembers])

  const selectedSet = useMemo(() => new Set(selectedUserIds), [selectedUserIds])

  /** 個別トグル */
  const toggleMember = useCallback(
    (userId: string) => {
      if (selectedSet.has(userId)) {
        onChange(selectedUserIds.filter((id) => id !== userId))
      } else {
        onChange([...selectedUserIds, userId])
      }
    },
    [selectedUserIds, selectedSet, onChange]
  )

  /** 全員選択（休団者除外） */
  const selectAll = useCallback(() => {
    onChange(activeMembers.filter((m) => m.status === 'active').map((m) => m.userId))
  }, [activeMembers, onChange])

  /** 全解除 */
  const deselectAll = useCallback(() => {
    onChange([])
  }, [onChange])

  /** 幹部のみ選択 */
  const selectAdminsOnly = useCallback(() => {
    onChange(
      selectableMembers
        .filter((m) => m.role === 'admin' && m.status === 'active')
        .map((m) => m.userId)
    )
  }, [selectableMembers, onChange])

  /** バッジ指定で選択 */
  const selectByBadge = useCallback(
    (badge: string) => {
      onChange(
        selectableMembers
          .filter((m) => m.badges.includes(badge) && m.status === 'active')
          .map((m) => m.userId)
      )
    },
    [selectableMembers, onChange]
  )

  /** セクション一括トグル */
  const toggleSection = useCallback(
    (sectionName: string) => {
      const members = grouped[sectionName] || []
      const sectionIds = members.map((m) => m.userId)
      const allSelected = sectionIds.every((id) => selectedSet.has(id))

      if (allSelected) {
        // 全解除
        onChange(selectedUserIds.filter((id) => !sectionIds.includes(id)))
      } else {
        // 全選択
        const newIds = new Set(selectedUserIds)
        for (const id of sectionIds) newIds.add(id)
        onChange(Array.from(newIds))
      }
    },
    [grouped, selectedUserIds, selectedSet, onChange]
  )

  return (
    <div className="space-y-3">
      {/* 選択カウンター */}
      <div className="flex items-center justify-between px-1">
        <span className="text-subhead text-label-secondary">
          {selectedUserIds.length} / {selectableMembers.length} 名選択中
        </span>
        <button
          onClick={selectedUserIds.length > 0 ? deselectAll : selectAll}
          className="text-subhead text-tint active:opacity-50 transition-opacity"
        >
          {selectedUserIds.length > 0 ? '全解除' : '全員選択'}
        </button>
      </div>

      {/* ショートカットボタン群 */}
      <div className="flex flex-wrap gap-2 px-1">
        <button
          onClick={selectAll}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-fill text-caption-1 text-label active:opacity-50 transition-opacity"
        >
          <Users className="w-3.5 h-3.5" />
          現役全員
        </button>
        <button
          onClick={selectAdminsOnly}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-fill text-caption-1 text-label active:opacity-50 transition-opacity"
        >
          <Shield className="w-3.5 h-3.5" />
          幹部のみ
        </button>
        {uniqueBadges.map((badge) => (
          <button
            key={badge}
            onClick={() => selectByBadge(badge)}
            className="px-3 py-1.5 rounded-full bg-fill text-caption-1 text-label active:opacity-50 transition-opacity"
          >
            {badge}
          </button>
        ))}
      </div>

      {/* セクション別メンバーリスト */}
      {sectionNames.map((section) => {
        const members = grouped[section]
        const sectionIds = members.map((m) => m.userId)
        const selectedCount = sectionIds.filter((id) => selectedSet.has(id)).length
        const allSelected = selectedCount === sectionIds.length

        return (
          <div key={section}>
            {/* セクションヘッダー（一括トグル） */}
            <button
              onClick={() => toggleSection(section)}
              className="flex items-center justify-between w-full px-4 py-2 text-left active:opacity-50"
            >
              <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide">
                {section}（{selectedCount}/{members.length}）
              </span>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                allSelected
                  ? 'bg-tint border-tint'
                  : selectedCount > 0
                    ? 'bg-tint/30 border-tint'
                    : 'border-label-tertiary'
              }`}>
                {(allSelected || selectedCount > 0) && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </button>

            {/* メンバーリスト */}
            <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
              {members.map((member, index) => {
                const isSelected = selectedSet.has(member.userId)
                const isInactive = member.status === 'inactive'

                return (
                  <button
                    key={member.userId}
                    onClick={() => toggleMember(member.userId)}
                    className="relative flex w-full items-center py-2.5 px-4 text-left active:bg-fill transition-colors duration-150"
                  >
                    {/* チェックボックス */}
                    <div className={`w-5 h-5 rounded flex items-center justify-center border mr-3 flex-shrink-0 ${
                      isSelected ? 'bg-tint border-tint' : 'border-label-tertiary'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>

                    {/* メンバー情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-body ${isInactive ? 'text-label-tertiary' : 'text-label'}`}>
                          {member.displayName}
                        </span>
                        <span className="text-caption-1 text-label-tertiary">
                          {member.part}
                        </span>
                        {member.badges.map((b) => (
                          <Badge key={b} label={b} variant="primary" size="sm" />
                        ))}
                        {isInactive && <Badge label="休団中" variant="warning" size="sm" />}
                      </div>
                    </div>

                    {/* セパレーター */}
                    {index < members.length - 1 && (
                      <div className="absolute bottom-0 left-12 right-0 h-[0.5px] bg-separator" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

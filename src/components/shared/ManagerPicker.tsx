/**
 * ManagerPicker — 責任者（Manager）選択コンポーネント
 * デフォルトはイベント作成者。名簿から任意のメンバーに委譲可能。
 */

import { useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'
import { HalfModalSheet } from '../ui/HalfModalSheet'
import { useMembers } from '../../hooks/useMembers'

type ManagerPickerProps = {
  /** 現在選択中の責任者UID */
  selectedUserId: string
  /** 変更コールバック */
  onChange: (userId: string) => void
}

export const ManagerPicker: React.FC<ManagerPickerProps> = ({
  selectedUserId,
  onChange,
}) => {
  const { activeMembers, groupBySection } = useMembers()
  const [isOpen, setIsOpen] = useState(false)

  const grouped = groupBySection(activeMembers.filter((m) => m.status === 'active'))
  const sectionNames = Object.keys(grouped)

  // 選択中のメンバー名
  const selectedMember = activeMembers.find((m) => m.userId === selectedUserId)

  const handleSelect = (userId: string) => {
    onChange(userId)
    setIsOpen(false)
  }

  return (
    <>
      {/* トリガーボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between py-3 px-4 rounded-xl bg-background-grouped-secondary text-left active:bg-fill transition-colors duration-150"
      >
        <div>
          <p className="text-caption-1 text-label-secondary">責任者</p>
          <p className="text-body text-label">
            {selectedMember?.displayName || '未選択'}
            {selectedMember && (
              <span className="text-caption-1 text-label-tertiary ml-2">
                {selectedMember.part}
              </span>
            )}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-label-tertiary flex-shrink-0" />
      </button>

      {/* 選択モーダル */}
      <HalfModalSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="責任者を選択">
        <div className="space-y-4">
          {sectionNames.map((section) => (
            <div key={section}>
              <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-1 pb-2">
                {section}
              </h3>
              <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
                {grouped[section].map((member, index) => {
                  const isSelected = member.userId === selectedUserId
                  return (
                    <button
                      key={member.userId}
                      onClick={() => handleSelect(member.userId)}
                      className="relative flex w-full items-center justify-between py-3 px-4 text-left active:bg-fill transition-colors duration-150"
                    >
                      <div>
                        <span className={`text-body ${isSelected ? 'text-tint font-semibold' : 'text-label'}`}>
                          {member.displayName}
                        </span>
                        <span className="text-caption-1 text-label-tertiary ml-2">
                          {member.part}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-tint flex-shrink-0" />}
                      {index < grouped[section].length - 1 && (
                        <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </HalfModalSheet>
    </>
  )
}

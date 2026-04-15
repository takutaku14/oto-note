/**
 * カスケードパート選択 UI
 * 階層型の「セクション → 楽器」選択コンポーネント
 *
 * 要件定義書 §4.6 — 表記揺れを防ぐための一貫した選択UI
 * Phase 2 以降のイベント作成や対象者選択でも再利用する
 */

import { useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'
import { ORCHESTRA_PARTS } from '../../constants'

type CascadePartPickerProps = {
  /** 選択済みのセクション名 */
  selectedSection: string
  /** 選択済みの楽器名 */
  selectedPart: string
  /** 選択が変更されたときのコールバック */
  onChange: (section: string, part: string) => void
}

export const CascadePartPicker: React.FC<CascadePartPickerProps> = ({
  selectedSection,
  selectedPart,
  onChange,
}) => {
  /** 展開中のセクション（null の場合はセクション一覧表示） */
  const [expandedSection, setExpandedSection] = useState<string | null>(
    selectedSection || null
  )

  /** セクションをタップした時の処理 */
  const handleSectionClick = (sectionName: string) => {
    if (expandedSection === sectionName) {
      // 同じセクションを再度タップ → 閉じる
      setExpandedSection(null)
    } else {
      setExpandedSection(sectionName)
    }
  }

  /** 楽器を選択した時の処理 */
  const handlePartSelect = (sectionName: string, partName: string) => {
    onChange(sectionName, partName)
  }

  return (
    <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
      {ORCHESTRA_PARTS.map((group, groupIndex) => (
        <div key={group.section}>
          {/* セクションヘッダー */}
          <button
            onClick={() => handleSectionClick(group.section)}
            className="relative flex w-full items-center justify-between py-3 px-4 text-left active:bg-fill transition-colors duration-150"
          >
            <div className="flex items-center gap-2">
              <span className="text-body text-label">{group.section}</span>
              {/* 選択済みのパートがこのセクション内にある場合、パート名を表示 */}
              {selectedSection === group.section && selectedPart && (
                <span className="text-subhead text-tint">{selectedPart}</span>
              )}
            </div>
            <ChevronRight
              className={`w-4 h-4 text-label-tertiary transition-transform duration-200 ${
                expandedSection === group.section ? 'rotate-90' : ''
              }`}
            />
            {/* セパレーター */}
            {groupIndex < ORCHESTRA_PARTS.length - 1 && expandedSection !== group.section && (
              <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
            )}
          </button>

          {/* 楽器リスト（展開時） */}
          {expandedSection === group.section && (
            <div className="bg-fill/30">
              {group.instruments.map((instrument, instIndex) => {
                const isSelected = selectedSection === group.section && selectedPart === instrument
                return (
                  <button
                    key={instrument}
                    onClick={() => handlePartSelect(group.section, instrument)}
                    className="relative flex w-full items-center justify-between py-2.5 pl-10 pr-4 text-left active:bg-fill transition-colors duration-150"
                  >
                    <span className={`text-body ${isSelected ? 'text-tint font-semibold' : 'text-label'}`}>
                      {instrument}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-tint flex-shrink-0" />}

                    {/* セパレーター */}
                    {instIndex < group.instruments.length - 1 && (
                      <div className="absolute bottom-0 left-10 right-0 h-[0.5px] bg-separator" />
                    )}
                  </button>
                )
              })}
              {/* セクション最後のセパレーター */}
              {groupIndex < ORCHESTRA_PARTS.length - 1 && (
                <div className="h-[0.5px] bg-separator" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

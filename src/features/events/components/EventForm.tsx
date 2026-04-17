import { useState, useEffect } from 'react'
import { CategorySelector } from './CategorySelector'
import { CategoryFields } from './CategoryFields'
import { MemberSelector } from '../../../components/shared/MemberSelector'
import { ManagerPicker } from '../../../components/shared/ManagerPicker'
import { ActionButton } from '../../../components/ui/ActionButton'
import type { EventCategory, AppEvent } from '../../../types'

type EventFormProps = {
  mode: 'create' | 'edit'
  initialData?: Partial<AppEvent>
  isSubmitting: boolean
  onSubmit: (data: Partial<AppEvent> & { category: EventCategory }) => void
}

export const EventForm: React.FC<EventFormProps> = ({ mode, initialData, isSubmitting, onSubmit }) => {
  // Step 1: Category (In edit mode, category is fixed)
  const [category, setCategory] = useState<EventCategory | null>(initialData?.category || null)

  // Step 2: Common Fields
  const [title, setTitle] = useState(initialData?.title || '')
  const [memo, setMemo] = useState(initialData?.memo || '')
  const [targetUserIds, setTargetUserIds] = useState<string[]>(initialData?.targetUserIds || [])
  const [managerId, setManagerId] = useState<string>(initialData?.managerId || '')

  // Step 2: Category Specific Data
  const [catData, setCatData] = useState<Record<string, any>>(() => {
    if (!initialData) return {}
    // 不要なベースフィールドを除外して固有フィールドを初期化
    const { id, orgId, seasonId, title: _t, memo: _m, category: _c, targetUserIds: _tu, authorId: _a, managerId: _mi, createdAt: _ca, ...rest } = initialData
    return rest
  })

  // Set default managerId if empty
  useEffect(() => {
    if (!managerId && initialData?.authorId) {
       setManagerId(initialData.authorId)
    }
  }, [initialData, managerId])

  const isValid = category && title.trim().length > 0 && targetUserIds.length > 0

  const handleSubmit = () => {
    if (!isValid) return
    const submitData = {
      category,
      title: title.trim(),
      memo: memo.trim() || undefined,
      targetUserIds,
      managerId,
      ...catData
    }
    onSubmit(submitData)
  }

  // Edit mode ALWAYS shows Step 2
  const showCategorySelect = mode === 'create' && !category

  if (showCategorySelect) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-2 font-bold text-label mb-1">イベントの種類</h2>
          <p className="text-subhead text-label-secondary">
            作成するイベントのカテゴリを選択してください。
          </p>
        </div>
        <CategorySelector selectedCategory={category} onSelect={setCategory} />
        {/* Step2へ進む。UI上はカテゴリを選択すると自動的（または次へボタン）に遷移するが、ここではボタンを用意 */}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* 共通フィールド */}
      <div className="space-y-5">
        <div>
          <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：第5回 全体練習"
            className="w-full rounded-xl bg-fill px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-tint"
          />
        </div>
        <div>
          <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">メモ (任意)</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="持ち物や注意事項など"
            rows={3}
            className="w-full rounded-xl bg-fill px-4 py-3 text-body resize-none focus:outline-none focus:ring-2 focus:ring-tint"
          />
        </div>
      </div>

      <hr className="border-separator" />

      {/* カテゴリ固有フィールド */}
      {category && (
        <CategoryFields
          category={category}
          data={catData}
          onChange={(updates) => setCatData({ ...catData, ...updates })}
        />
      )}

      <hr className="border-separator" />

      {/* 権限・対象者設定 */}
      <div className="space-y-6">
        <div>
          <h3 className="text-title-3 font-bold text-label mb-2">対象者</h3>
          <p className="text-caption-1 text-label-secondary mb-4">
            このイベントに参加・回答するメンバーを選択してください。休団者はデフォルトで除外されます。
          </p>
          <MemberSelector
            selectedUserIds={targetUserIds}
            onChange={setTargetUserIds}
          />
        </div>

        <div>
          <h3 className="text-title-3 font-bold text-label mb-2">権限の委譲 (任意)</h3>
          <p className="text-caption-1 text-label-secondary mb-4">
            回答状況の確認などを行う「責任者」を別のメンバーに委譲できます。
          </p>
          <ManagerPicker
            selectedUserId={managerId}
            onChange={setManagerId}
          />
        </div>
      </div>

      {/* アクション */}
      <ActionButton
        label={mode === 'create' ? 'イベントを作成' : '変更を保存'}
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
        fullWidth
      />
      <div className="h-8" />
    </div>
  )
}

/**
 * CategoryFields — カテゴリごとの動的入力フィールド
 */

import type { EventCategory } from '../../../types'
import { TimetableEditor } from './TimetableEditor'
import { CascadePartPicker } from '../../../components/shared/CascadePartPicker'
import { Plus, X } from 'lucide-react'

type CategoryFieldsProps = {
  category: EventCategory
  data: Record<string, any>
  onChange: (updates: Record<string, any>) => void
}

export const CategoryFields: React.FC<CategoryFieldsProps> = ({
  category,
  data,
  onChange,
}) => {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  switch (category) {
    case 'practice':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">練習日</label>
            <input
              type="date"
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">タイムテーブル</label>
            <TimetableEditor
              timetable={data.timetable || []}
              onChange={(t) => handleChange('timetable', t)}
            />
          </div>
        </div>
      )

    case 'section':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">練習日</label>
            <input
              type="date"
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">対象セクション/パート (任意)</label>
            <CascadePartPicker
              selectedSection={data.targetSection || ''}
              selectedPart=""
              onChange={(section) => handleChange('targetSection', section)} // ここではセクション名のみ使用
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">タイムテーブル</label>
            <TimetableEditor
              timetable={data.timetable || []}
              onChange={(t) => handleChange('timetable', t)}
            />
          </div>
        </div>
      )

    case 'billing':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">支払期限</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">金額 (円)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={data.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value ? parseInt(e.target.value, 10) : 0)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
              placeholder="例: 3000"
            />
          </div>
        </div>
      )

    case 'survey':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">回答期限</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">フォームURL</label>
            <input
              type="url"
              value={data.formUrl || ''}
              onChange={(e) => handleChange('formUrl', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
              placeholder="https://forms.google.com/..."
            />
          </div>
        </div>
      )

    case 'notice':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">確認期限 (任意)</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <p className="text-caption-1 text-label-tertiary">
            未回答者には、期限が近づくとリマインドが送信されます（Phase 6 以降）
          </p>
        </div>
      )

    case 'duty':
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">当番日</label>
            <input
              type="date"
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">完了期限 (任意)</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
        </div>
      )

    case 'return': {
      const items = (data.items || []) as string[]
      return (
        <div className="space-y-5">
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">返却期限</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl bg-fill px-4 py-3 text-body"
            />
          </div>
          <div>
            <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">返却する備品リスト</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[i] = e.target.value
                      handleChange('items', newItems)
                    }}
                    className="flex-1 rounded-lg bg-fill px-3 py-2 text-body"
                  />
                  <button
                    onClick={() => handleChange('items', items.filter((_, idx) => idx !== i))}
                    className="p-2 text-label-tertiary active:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleChange('items', [...items, ''])}
                className="flex items-center gap-1 text-sm text-tint py-2"
              >
                <Plus className="w-4 h-4" /> 備品を追加
              </button>
            </div>
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

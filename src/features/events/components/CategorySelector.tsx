/**
 * CategorySelector — イベント作成時のカテゴリ選択グリッド
 */

import { EVENT_CATEGORY_META } from '../../../constants/eventCategories'
import type { EventCategory } from '../../../types'

type CategorySelectorProps = {
  /** 選択中のカテゴリ */
  selectedCategory: EventCategory | null
  /** 選択変更コールバック */
  onSelect: (category: EventCategory) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const categories = Object.entries(EVENT_CATEGORY_META) as [EventCategory, typeof EVENT_CATEGORY_META[EventCategory]][]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {categories.map(([key, meta]) => {
        const isSelected = selectedCategory === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
              isSelected
                ? 'bg-background-grouped-secondary shadow-md scale-105 border-2 border-tint'
                : 'bg-fill active:bg-fill/80 active:scale-95 border-2 border-transparent'
            }`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
              style={{ backgroundColor: meta.color + '20' }}
            >
              <meta.Icon className="w-6 h-6" style={{ color: meta.color }} />
            </div>
            <span className={`text-caption-1 font-semibold ${isSelected ? 'text-tint' : 'text-label-secondary'}`}>
              {meta.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

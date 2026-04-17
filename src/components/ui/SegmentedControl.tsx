import { motion } from 'framer-motion'

/** 
 * セグメントコントロールの選択肢型 
 */
export type SegmentedControlOption<T> = {
  label: string
  value: T
}

type SegmentedControlProps<T> = {
  /** 選択肢のリスト */
  options: readonly SegmentedControlOption<T>[]
  /** 現在選択されている値 */
  value: T
  /** 変更時のコールバック */
  onChange: (value: T) => void
  /** 追加のスタイルクラス */
  className?: string
}

/** 
 * iOS 標準の UISegmentedControl を精緻に再現したコンポーネント
 * Apple Human Interface Guidelines に準拠し、物理ベースのアニメーションを提供
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = ''
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((opt) => opt.value === value)

  return (
    <div
      className={`relative flex p-[2px] bg-fill rounded-[8px] select-none ${className}`}
      style={{
        // iOS風の微細な内側の影
        boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 選択中の背景スライダー (Liquid Glass 表現) */}
      <motion.div
        className="absolute top-[2px] bottom-[2px] left-[2px] bg-white rounded-[6.5px] shadow-sm z-0 dark:bg-label-quaternary"
        initial={false}
        animate={{
          x: `${activeIndex * 100}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 38,
          mass: 1,
        }}
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          // ダークモード時はより馴染むように少し透明度を調整
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04)',
        }}
      />

      {options.map((option, i) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative flex-1 py-1.5 text-[13px] font-medium z-10 transition-colors duration-200 outline-none
            ${value === option.value ? 'text-label' : 'text-label-secondary active:opacity-60'}
          `}
        >
          {/* セパレーター（隣り合う非選択項目の間） */}
          {i > 0 && i !== activeIndex && i !== activeIndex + 1 && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-[1px] bg-separator transition-opacity" />
          )}
          {option.label}
        </button>
      ))}
    </div>
  )
}

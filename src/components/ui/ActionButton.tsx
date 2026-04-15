/**
 * アクションボタン
 * DESIGN_RULE §5.1 準拠のタップフィードバック付きボタン
 *
 * - primary: Tintカラー塗りつぶし（主要アクション）
 * - secondary: 背景色付き＋Tintテキスト（補助アクション）
 * - danger: 赤色（破壊的操作）
 */

import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ActionButtonProps = {
  /** ボタンのラベルテキスト */
  label: string
  /** クリックハンドラ */
  onClick?: () => void
  /** ボタンのバリアント */
  variant?: 'primary' | 'secondary' | 'danger'
  /** サイズ */
  size?: 'sm' | 'md' | 'lg'
  /** フル幅表示 */
  fullWidth?: boolean
  /** 無効化状態 */
  disabled?: boolean
  /** ロード中状態 */
  isLoading?: boolean
  /** 左アイコン（任意） */
  icon?: ReactNode
}

/** バリアント別のスタイル */
const variantStyles = {
  primary:   'bg-tint text-white',
  secondary: 'bg-background-secondary text-tint',
  danger:    'bg-red-500 text-white dark:bg-red-600',
} as const

/** サイズ別のスタイル */
const sizeStyles = {
  sm: 'px-4 py-2 text-subhead',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-headline',
} as const

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        active:scale-95 transition-transform duration-150 ease-apple-spring
        disabled:opacity-40 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon
      )}
      {label}
    </button>
  )
}

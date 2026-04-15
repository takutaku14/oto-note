/**
 * バッジ
 * 役職（インスペクター、パートリーダー等）やステータス表示に使う小型ラベル
 * 要件定義書 §4.6 — 役職バッジ機能
 */

/** バッジの色バリアント */
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'

type BadgeProps = {
  /** ラベルテキスト */
  label: string
  /** 色バリアント */
  variant?: BadgeVariant
  /** サイズ */
  size?: 'sm' | 'md'
}

/** バリアント別のスタイルマップ */
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-fill text-label-secondary',
  primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-caption-2'
    : 'px-2.5 py-1 text-footnote'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeClasses}`}>
      {label}
    </span>
  )
}

/**
 * エンプティステート（空状態）
 * データが未登録の場合に表示する、アイコン＋メッセージ＋アクションボタン
 */

import { Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  /** 表示アイコン（デフォルト: Inbox） */
  icon?: LucideIcon
  /** タイトルテキスト */
  title: string
  /** 説明テキスト */
  description?: string
  /** アクションボタン（任意） */
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* アイコン */}
      <div className="h-16 w-16 rounded-full bg-fill flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-label-tertiary" />
      </div>

      {/* タイトル */}
      <h3 className="text-headline text-label mb-1 text-center">{title}</h3>

      {/* 説明 */}
      {description && (
        <p className="text-subhead text-label-secondary text-center max-w-xs">
          {description}
        </p>
      )}

      {/* アクションボタン */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2.5 bg-tint text-white font-semibold rounded-xl active:scale-95 transition-transform duration-150 ease-apple-spring"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

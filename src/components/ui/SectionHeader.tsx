/**
 * セクションヘッダー
 * Grouped UI のセクション見出し + オプションのアクションボタン
 */

type SectionHeaderProps = {
  /** セクション見出しテキスト */
  title: string
  /** 右端に表示するアクション（任意） */
  action?: {
    label: string
    onClick: () => void
  }
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => {
  return (
    <div className="flex items-center justify-between px-4 pt-6 pb-2 md:px-8">
      <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide">
        {title}
      </h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-subhead text-tint active:opacity-50 transition-opacity duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

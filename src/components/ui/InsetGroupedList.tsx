/**
 * Inset Grouped List (iOS風 角丸リスト)
 * DESIGN_RULE §4.2 完全準拠
 *
 * 特徴:
 * - Grouped Background の階層的な背景色
 * - セパレーターの左インセット（アイコン有無で動的に変更）
 * - タップ時の active:bg-fill 即時フィードバック
 */

import type { ReactNode } from 'react'

/** リストアイテムの Props */
export type ListItemProps = {
  /** 左のアイコン（任意） */
  icon?: ReactNode
  /** メインテキスト */
  title: string
  /** サブテキスト */
  subtitle?: string
  /** 右に表示する値テキスト */
  value?: string
  /** クリックハンドラ（指定するとシェブロン矢印が表示される） */
  onClick?: () => void
}

/** InsetGroupedList の Props */
type InsetGroupedListProps = {
  /** リストに表示する項目の配列 */
  items: ListItemProps[]
  /** セクションヘッダー（任意） */
  header?: string
}

export const InsetGroupedList: React.FC<InsetGroupedListProps> = ({ items, header }) => {
  return (
    <div className="w-full py-2 px-4 md:px-8">
      {/* セクションヘッダー */}
      {header && (
        <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          {header}
        </h3>
      )}

      {/* リスト本体（角丸カード） */}
      <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
        {items.map((item, index) => (
          <ListItem
            key={index}
            {...item}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

/** 内部用: 個々のリストアイテム */
const ListItem: React.FC<ListItemProps & { isLast?: boolean }> = ({
  icon,
  title,
  subtitle,
  value,
  isLast,
  onClick,
}) => {
  /** アイコン有無でセパレーターのインセット位置を変更 */
  const separatorInsetClass = icon ? 'left-14' : 'left-4'

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`relative flex w-full items-center transition-colors duration-150 ease-out text-left
        ${onClick ? 'active:bg-fill cursor-pointer' : ''}`}
    >
      <div className="flex w-full items-center py-2.5 pl-4">
        {/* アイコン領域 */}
        {icon && (
          <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-tint text-white">
            {icon}
          </div>
        )}

        {/* コンテンツ領域 */}
        <div className="flex flex-1 flex-col justify-center pr-4 min-h-[28px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-body text-label line-clamp-1">{title}</span>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {value && <span className="text-body text-label-secondary">{value}</span>}
              {/* iOS風シェブロン（右矢印） */}
              {onClick && (
                <svg className="h-4 w-4 text-label-tertiary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          {/* サブタイトル */}
          {subtitle && (
            <span className="text-subhead text-label-secondary line-clamp-1 mt-0.5">{subtitle}</span>
          )}
        </div>
      </div>

      {/* セパレーター線（最後の要素には非表示） */}
      {!isLast && (
        <div className={`absolute bottom-0 right-0 h-[0.5px] bg-separator ${separatorInsetClass}`} />
      )}
    </Component>
  )
}

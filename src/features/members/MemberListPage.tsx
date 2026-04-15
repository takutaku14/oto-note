/**
 * メンバー名簿（一般メンバー向け）
 * セクション別グルーピング表示。退団者は非表示。
 */

import { Users } from 'lucide-react'
import { useMembers } from '../../hooks/useMembers'
import { Badge } from '../../components/ui/Badge'

export const MemberListPage: React.FC = () => {
  const { visibleMembers, groupBySection } = useMembers()
  const grouped = groupBySection(visibleMembers)
  const sectionNames = Object.keys(grouped)

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center gap-3 px-4 py-3">
          <Users className="w-6 h-6 text-label" />
          <h1 className="text-large-title font-bold text-label">メンバー</h1>
          <span className="text-subhead text-label-secondary ml-auto">
            {visibleMembers.length}名
          </span>
        </div>
      </div>

      {/* セクション別リスト */}
      {sectionNames.map((section) => (
        <div key={section} className="px-4 pt-4">
          <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
            {section}
          </h2>
          <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
            {grouped[section].map((member, index) => (
              <div
                key={member.userId}
                className="relative flex items-center py-3 px-4"
              >
                {/* アバター */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    member.status === 'inactive'
                      ? 'bg-fill/60'
                      : 'bg-fill'
                  }`}
                >
                  <span
                    className={`text-headline ${
                      member.status === 'inactive'
                        ? 'text-label-quaternary'
                        : 'text-label-secondary'
                    }`}
                  >
                    {member.displayName.charAt(0)}
                  </span>
                </div>

                {/* メンバー情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-body ${
                        member.status === 'inactive' ? 'text-label-tertiary' : 'text-label'
                      }`}
                    >
                      {member.displayName}
                    </span>
                    {/* 役職バッジ */}
                    {member.badges.map((badge) => (
                      <Badge key={badge} label={badge} variant="primary" />
                    ))}
                    {/* 休団バッジ */}
                    {member.status === 'inactive' && (
                      <Badge label="休団中" variant="warning" />
                    )}
                  </div>
                  <p className="text-caption-1 text-label-tertiary mt-0.5">
                    {member.part}
                  </p>
                </div>

                {/* セパレーター */}
                {index < grouped[section].length - 1 && (
                  <div className="absolute bottom-0 left-[4.25rem] right-0 h-[0.5px] bg-separator" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

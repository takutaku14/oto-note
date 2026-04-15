/**
 * 団体設定ページ（幹部専用）
 * シーズン管理・招待リンク・団体情報
 */

import { useState } from 'react'
import { Check, Plus, Copy, CheckCircle2, Calendar, Settings } from 'lucide-react'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useSeasons } from '../../hooks/useSeasons'
import { CreateSeasonSheet } from './CreateSeasonSheet'

export const OrgSettingsPage: React.FC = () => {
  const { org } = useCurrentOrg()
  const { seasons, activeSeason, setActiveSeason } = useSeasons()
  const [isCreateSeasonOpen, setIsCreateSeasonOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  /** 招待リンクをクリップボードにコピー */
  const handleCopyInviteLink = async () => {
    const link = `${window.location.origin}/join/${org.inviteToken}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      id="app-root"
      className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]"
    >
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center gap-3 px-4 py-3">
          <Settings className="w-6 h-6 text-label" />
          <h1 className="text-large-title font-bold text-label">団体設定</h1>
        </div>
      </div>

      {/* ====== 団体情報セクション ====== */}
      <div className="px-4 pt-6">
        <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          団体情報
        </h2>
        <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
          {/* 団体名 */}
          <div className="relative flex items-center justify-between py-3 px-4">
            <span className="text-body text-label-secondary">団体名</span>
            <span className="text-body text-label">{org.name}</span>
            <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
          </div>

          {/* 招待リンク */}
          <button
            onClick={handleCopyInviteLink}
            className="relative flex w-full items-center justify-between py-3 px-4 text-left active:bg-fill transition-colors duration-150"
          >
            <span className="text-body text-label-secondary">招待リンク</span>
            <div className="flex items-center gap-2">
              <span className="text-subhead text-tint">
                {copied ? 'コピーしました！' : 'コピー'}
              </span>
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-tint" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ====== シーズン管理セクション ====== */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide">
            シーズン管理
          </h2>
          <button
            onClick={() => setIsCreateSeasonOpen(true)}
            className="flex items-center gap-1 text-subhead text-tint active:opacity-50 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>新規作成</span>
          </button>
        </div>

        {seasons.length === 0 ? (
          <div className="rounded-xl bg-background-grouped-secondary py-8 px-4 flex flex-col items-center">
            <Calendar className="w-12 h-12 text-label-tertiary mb-2" />
            <p className="text-body text-label-secondary text-center">
              シーズンがまだありません
            </p>
            <p className="text-caption-1 text-label-tertiary text-center mt-1">
              「新規作成」から公演期間を追加しましょう
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
            {seasons.map((season, index) => {
              const isActive = season.id === org.currentSeasonId
              return (
                <button
                  key={season.id}
                  onClick={() => setActiveSeason(season.id)}
                  className="relative flex w-full items-center justify-between py-3 px-4 text-left active:bg-fill transition-colors duration-150"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-body ${isActive ? 'text-tint font-semibold' : 'text-label'}`}>
                        {season.title}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/50 text-caption-2 font-medium text-green-600 dark:text-green-400">
                          アクティブ
                        </span>
                      )}
                    </div>
                    {season.concertDate && (
                      <p className="text-caption-1 text-label-tertiary mt-0.5">
                        本番日: {season.concertDate}
                      </p>
                    )}
                  </div>

                  {isActive && <Check className="w-5 h-5 text-tint flex-shrink-0" />}

                  {/* セパレーター */}
                  {index < seasons.length - 1 && (
                    <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* アクティブシーズン情報 */}
        {activeSeason && (
          <p className="text-caption-1 text-label-tertiary px-4 mt-2">
            現在のアクティブシーズン: {activeSeason.title}
          </p>
        )}
      </div>

      {/* ====== 外部連携セクション（プレースホルダー） ====== */}
      <div className="px-4 pt-6 pb-8">
        <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          外部連携
        </h2>
        <div className="rounded-xl bg-background-grouped-secondary py-4 px-4">
          <p className="text-body text-label-tertiary text-center">
            Google カレンダー・Drive 連携は今後のアップデートで実装予定です
          </p>
        </div>
      </div>

      {/* シーズン作成モーダル */}
      <CreateSeasonSheet isOpen={isCreateSeasonOpen} onClose={() => setIsCreateSeasonOpen(false)} />
    </div>
  )
}

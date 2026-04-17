/**
 * 招待参加ページ
 * 招待リンク /join/:inviteToken からアクセスし、パートを選んで団体に参加する
 */

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Music, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useOrganizations } from '../../hooks/useOrganizations'
import { CascadePartPicker } from '../../components/shared/CascadePartPicker'
import { ActionButton } from '../../components/ui/ActionButton'

export const JoinPage: React.FC = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { findOrgByInviteToken, isAlreadyMember, joinOrganization } = useOrganizations()

  const [selectedSection, setSelectedSection] = useState('')
  const [selectedPart, setSelectedPart] = useState('')
  const [joined, setJoined] = useState(false)

  // 団体をトークンから検索
  const org = inviteToken ? findOrgByInviteToken(inviteToken) : undefined
  const alreadyMember = org ? isAlreadyMember(org.id) : false

  /** 参加処理 */
  const handleJoin = () => {
    if (!inviteToken || !selectedSection || !selectedPart) return
    const orgId = joinOrganization(inviteToken, selectedSection, selectedPart)
    if (orgId) {
      setJoined(true)
      setTimeout(() => navigate(`/org/${orgId}`, { replace: true }), 1500)
    }
  }

  // 未ログインの場合
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-8">
        <AlertCircle className="w-16 h-16 text-label-tertiary mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">ログインが必要です</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          団体に参加するには、まずログインしてください。
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-tint text-white font-semibold rounded-xl active:scale-95 transition-transform duration-150"
        >
          ログイン画面へ
        </Link>
      </div>
    )
  }

  // 無効なトークンの場合
  if (!org) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-8">
        <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">無効な招待リンク</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          この招待リンクは無効です。リンクを発行した幹部にお問い合わせください。
        </p>
        <Link
          to="/"
          className="text-body text-tint active:opacity-50 transition-opacity"
        >
          ホームに戻る
        </Link>
      </div>
    )
  }

  // 参加完了
  if (joined) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-8">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">参加完了！</h1>
        <p className="text-body text-label-secondary">
          「{org.name}」に参加しました。ダッシュボードへ移動します…
        </p>
      </div>
    )
  }

  // 既に参加済み
  if (alreadyMember) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-8">
        <Users className="w-16 h-16 text-tint mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">すでに参加しています</h1>
        <p className="text-body text-label-secondary text-center mb-6">
          あなたは「{org.name}」のメンバーです。
        </p>
        <Link
          to={`/org/${org.id}`}
          className="px-6 py-3 bg-tint text-white font-semibold rounded-xl active:scale-95 transition-transform duration-150"
        >
          ダッシュボードへ
        </Link>
      </div>
    )
  }

  // 参加フォーム
  return (
    <div className="min-h-dvh bg-background">
      {/* ヒーローセクション (iOS/PWAのSafe Area Topを確保) */}
      <div className="flex flex-col items-center pt-[calc(env(safe-area-inset-top)+4rem)] pb-8 px-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4"
          style={{ backgroundColor: org.color || 'rgb(var(--color-tint))' }}
        >
          <Music className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-title-1 font-bold text-label mb-1">{org.name}</h1>
        <p className="text-body text-label-secondary">に参加する</p>
      </div>

      {/* パート選択 */}
      <div className="px-4 pb-8">
        <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          パートを選択してください
        </h2>
        <CascadePartPicker
          selectedSection={selectedSection}
          selectedPart={selectedPart}
          onChange={(section, part) => {
            setSelectedSection(section)
            setSelectedPart(part)
          }}
        />

        {/* 選択結果 */}
        {selectedPart && (
          <p className="text-subhead text-tint text-center mt-4">
            {selectedSection} / {selectedPart}
          </p>
        )}

        {/* 参加ボタン */}
        <div className="mt-6 px-4">
          <ActionButton
            label="参加する"
            onClick={handleJoin}
            disabled={!selectedPart}
            fullWidth
          />
        </div>

        {/* 戻るリンク */}
        <div className="text-center mt-4">
          <Link to="/" className="text-subhead text-tint active:opacity-50 transition-opacity">
            キャンセル
          </Link>
        </div>
      </div>
    </div>
  )
}

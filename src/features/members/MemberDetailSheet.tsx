/**
 * メンバー詳細・編集シート（幹部向け）
 * ステータス変更 / ロール変更 / バッジ管理
 */

import { useState, useEffect } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { HalfModalSheet } from '../../components/ui/HalfModalSheet'
import { ActionButton } from '../../components/ui/ActionButton'
import { useMembers } from '../../hooks/useMembers'
import type { Membership, MemberStatus, MemberRole } from '../../types'

type MemberDetailSheetProps = {
  member: Membership | null
  isOpen: boolean
  onClose: () => void
}

/** ステータスの日本語ラベルと色 */
const STATUS_OPTIONS: { value: MemberStatus; label: string; color: string }[] = [
  { value: 'active', label: '現役', color: 'bg-green-500' },
  { value: 'inactive', label: '休団', color: 'bg-orange-500' },
  { value: 'withdrawn', label: '退団', color: 'bg-red-500' },
]

export const MemberDetailSheet: React.FC<MemberDetailSheetProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { updateMemberStatus, updateMemberRole, updateMemberBadges } = useMembers()

  const [status, setStatus] = useState<MemberStatus>('active')
  const [role, setRole] = useState<MemberRole>('member')
  const [badges, setBadges] = useState<string[]>([])
  const [newBadge, setNewBadge] = useState('')
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)

  // member が変わった時に状態を同期
  useEffect(() => {
    if (member) {
      setStatus(member.status)
      setRole(member.role)
      setBadges([...member.badges])
      setShowWithdrawConfirm(false)
      setNewBadge('')
    }
  }, [member])

  if (!member) return null

  /** ステータス変更のハンドラ */
  const handleStatusChange = (newStatus: MemberStatus) => {
    if (newStatus === 'withdrawn' && status !== 'withdrawn') {
      // 退団への変更は確認ダイアログを表示
      setShowWithdrawConfirm(true)
      return
    }
    setStatus(newStatus)
  }

  /** 退団確定 */
  const confirmWithdraw = () => {
    setStatus('withdrawn')
    setShowWithdrawConfirm(false)
  }

  /** バッジ追加 */
  const handleAddBadge = () => {
    const trimmed = newBadge.trim()
    if (trimmed && !badges.includes(trimmed)) {
      setBadges([...badges, trimmed])
      setNewBadge('')
    }
  }

  /** バッジ削除 */
  const handleRemoveBadge = (badge: string) => {
    setBadges(badges.filter((b) => b !== badge))
  }

  /** 保存 */
  const handleSave = () => {
    updateMemberStatus(member.userId, status)
    updateMemberRole(member.userId, role)
    updateMemberBadges(member.userId, badges)
    onClose()
  }

  /** 変更があるかチェック */
  const hasChanges =
    status !== member.status ||
    role !== member.role ||
    JSON.stringify(badges) !== JSON.stringify(member.badges)

  return (
    <HalfModalSheet isOpen={isOpen} onClose={onClose} title={member.displayName}>
      <div className="space-y-6">
        {/* ====== 基本情報 ====== */}
        <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
          <div className="relative flex items-center justify-between py-3 px-4">
            <span className="text-body text-label-secondary">パート</span>
            <span className="text-body text-label">{member.section} / {member.part}</span>
            <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
          </div>
          <div className="flex items-center justify-between py-3 px-4">
            <span className="text-body text-label-secondary">ユーザーID</span>
            <span className="text-caption-1 text-label-tertiary font-mono">{member.userId}</span>
          </div>
        </div>

        {/* ====== ステータス変更 ====== */}
        <div>
          <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-1 pb-2">
            ステータス
          </h3>
          <div className="flex rounded-xl bg-fill p-1 gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`flex-1 py-2 rounded-lg text-subhead font-medium transition-all duration-200 ${
                  status === opt.value
                    ? 'bg-background-grouped-secondary text-label shadow-sm'
                    : 'text-label-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 退団確認ダイアログ */}
          {showWithdrawConfirm && (
            <div className="mt-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-subhead font-semibold text-red-600 dark:text-red-400 mb-1">
                    退団処理の確認
                  </p>
                  <p className="text-caption-1 text-red-500 dark:text-red-300 mb-3">
                    {member.displayName} さんを退団させます。退団者はこの団体にアクセスできなくなります。
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmWithdraw}
                      className="px-4 py-2 bg-red-500 text-white text-subhead font-semibold rounded-lg active:scale-95 transition-transform"
                    >
                      退団させる
                    </button>
                    <button
                      onClick={() => setShowWithdrawConfirm(false)}
                      className="px-4 py-2 bg-fill text-label-secondary text-subhead rounded-lg active:scale-95 transition-transform"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ====== ロール変更 ====== */}
        <div>
          <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-1 pb-2">
            権限
          </h3>
          <div className="flex rounded-xl bg-fill p-1 gap-1">
            <button
              onClick={() => setRole('member')}
              className={`flex-1 py-2 rounded-lg text-subhead font-medium transition-all duration-200 ${
                role === 'member'
                  ? 'bg-background-grouped-secondary text-label shadow-sm'
                  : 'text-label-secondary'
              }`}
            >
              一般メンバー
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-lg text-subhead font-medium transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-background-grouped-secondary text-label shadow-sm'
                  : 'text-label-secondary'
              }`}
            >
              幹部
            </button>
          </div>
        </div>

        {/* ====== バッジ管理 ====== */}
        <div>
          <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-1 pb-2">
            役職バッジ
          </h3>

          {/* 既存バッジ */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-subhead text-blue-700 dark:text-blue-300"
                >
                  {badge}
                  <button
                    onClick={() => handleRemoveBadge(badge)}
                    className="ml-0.5 active:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* バッジ追加フォーム */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBadge()}
              placeholder="例：パートリーダー"
              className="flex-1 rounded-xl bg-fill px-4 py-2.5 text-body text-label placeholder:text-label-quaternary outline-none focus:ring-2 focus:ring-tint transition-shadow"
            />
            <button
              onClick={handleAddBadge}
              disabled={!newBadge.trim()}
              className="px-3 py-2.5 bg-tint text-white rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ====== 保存ボタン ====== */}
        <ActionButton
          label="変更を保存"
          onClick={handleSave}
          disabled={!hasChanges}
          fullWidth
        />
      </div>
    </HalfModalSheet>
  )
}

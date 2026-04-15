/**
 * 団体作成モーダル
 * HalfModalSheet を利用した新規団体作成フォーム
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HalfModalSheet } from '../../components/ui/HalfModalSheet'
import { ActionButton } from '../../components/ui/ActionButton'
import { useOrganizations } from '../../hooks/useOrganizations'

type CreateOrgSheetProps = {
  isOpen: boolean
  onClose: () => void
}

export const CreateOrgSheet: React.FC<CreateOrgSheetProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const { createOrganization } = useOrganizations()
  const navigate = useNavigate()

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    const orgId = createOrganization(trimmed)
    if (orgId) {
      setName('')
      onClose()
      navigate(`/org/${orgId}`)
    }
  }

  const handleClose = () => {
    setName('')
    onClose()
  }

  return (
    <HalfModalSheet isOpen={isOpen} onClose={handleClose} title="団体を作成">
      <div className="space-y-6">
        {/* 団体名入力 */}
        <div>
          <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">
            団体名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：アンサンブル・ソノーレ"
            className="w-full rounded-xl bg-fill px-4 py-3 text-body text-label placeholder:text-label-quaternary outline-none focus:ring-2 focus:ring-tint transition-shadow"
            autoFocus
          />
        </div>

        {/* 説明 */}
        <p className="text-caption-1 text-label-secondary">
          団体を作成すると、あなたは自動的に「幹部（管理者）」として登録されます。
          メンバーの招待は招待リンクを共有して行います。
        </p>

        {/* 作成ボタン */}
        <ActionButton
          label="作成する"
          onClick={handleCreate}
          disabled={!name.trim()}
          fullWidth
        />
      </div>
    </HalfModalSheet>
  )
}

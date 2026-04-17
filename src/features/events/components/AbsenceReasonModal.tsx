import React, { useState } from 'react'
import { HalfModalSheet } from '../../../components/ui/HalfModalSheet'
import { ActionButton } from '../../../components/ui/ActionButton'

type AbsenceReasonModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export const AbsenceReasonModal: React.FC<AbsenceReasonModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    onSubmit(reason.trim())
    setReason('')
  }

  return (
    <HalfModalSheet isOpen={isOpen} onClose={onClose} title="欠席の理由">
      <div className="space-y-4 pt-2 pb-[100px]">
        <p className="text-body text-label-secondary">
          責任者やパートのメンバーに伝わるよう、欠席の理由を入力してください。（任意）
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="例: 仕事の都合のため"
          rows={4}
          className="w-full rounded-xl bg-background-grouped-secondary px-4 py-3 text-body resize-none focus:outline-none focus:ring-2 focus:ring-tint"
        />
        <ActionButton
          label="欠席で回答する"
          onClick={handleSubmit}
          fullWidth
        />
      </div>
    </HalfModalSheet>
  )
}

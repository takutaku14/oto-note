import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useEvents } from '../../hooks/useEvents'
import { EventForm } from './components/EventForm'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { AppEvent } from '../../types'

export const EventEditPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { org } = useCurrentOrg()
  const { getEventById, updateEvent, deleteEvent } = useEvents()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!eventId) return null
  const event = getEventById(eventId)

  if (!event) {
    return null
  }

  const handleSubmit = async (submitData: Partial<AppEvent>) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800)) // 擬似API遅延
    updateEvent(eventId, submitData)
    setIsSubmitting(false)
    navigate(`/org/${org.id}/events/${eventId}`, { replace: true })
  }

  const handleDelete = () => {
    deleteEvent(eventId)
    navigate(`/org/${org.id}`, { replace: true })
  }

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-2 py-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-tint active:opacity-50 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>キャンセル</span>
          </button>
          <span className="text-headline text-label font-semibold">イベント編集</span>
          <div className="w-24" /> {/* バランス調整 */}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        <EventForm
          mode="edit"
          initialData={event}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <div className="pt-8 border-t border-separator flex justify-center pb-[100px]">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 text-red-500 font-bold p-4 w-full active:opacity-50 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            このイベントを削除
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="イベントを削除"
        message="このイベントを削除してもよろしいですか？（出欠等の回答データもすべて削除されます）"
        confirmLabel="削除する"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

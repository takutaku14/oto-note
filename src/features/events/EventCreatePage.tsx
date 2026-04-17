/**
 * EventCreatePage — イベント作成ページ
 * 共通化された EventForm を使用
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useMockData } from '../../hooks/useMockData'
import { EventForm } from './components/EventForm'
import type { AppEvent } from '../../types'

export const EventCreatePage: React.FC = () => {
  const { currentUser } = useAuth()
  const { org, season } = useCurrentOrg()
  const { addEvent } = useMockData()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (submitData: any) => {
    if (!currentUser) return

    setIsSubmitting(true)

    const eventId = `event-${Date.now()}`
    const newEvent: AppEvent = {
      id: eventId,
      orgId: org.id,
      seasonId: season?.id || 'no-season',
      authorId: currentUser.uid,
      createdAt: new Date().toISOString(),
      ...submitData
    }

    // 擬似API遅延
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    addEvent(newEvent)
    setIsSubmitting(false)
    setIsSuccess(true)

    // 少し待ってからダッシュボードに戻る
    setTimeout(() => {
      navigate(`/org/${org.id}`)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-8">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-title-2 font-bold text-label mb-2">イベントを作成しました</h1>
        <p className="text-body text-label-secondary text-center">
          ダッシュボードに戻ります...
        </p>
      </div>
    )
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
          <span className="text-headline text-label font-semibold">イベント作成</span>
          <div className="w-20" /> {/* バランス調整 */}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        <EventForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

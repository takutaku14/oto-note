import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { EVENT_CATEGORY_META } from '../../constants/eventCategories'
import { ResponseSummaryCard } from './components/ResponseSummaryCard'
import { ResponseMemberList } from './components/ResponseMemberList'
import type { EventResponse } from '../../types'

export const EventResponsesPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { getEventById, getResponsesForEvent, upsertResponse } = useEvents()
  const { isAdmin, membership } = useCurrentOrg()

  if (!eventId) return null
  const event = getEventById(eventId)

  if (!event) {
    return null
  }

  // アクセス制御: 幹部または責任者のみ
  const isManager = event.managerId === membership.userId
  if (!isAdmin && !isManager) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <p className="text-body text-red-500 text-center">このページを表示する権限がありません。</p>
      </div>
    )
  }

  const responses = getResponsesForEvent(eventId)
  const meta = EVENT_CATEGORY_META[event.category]

  // 集金イベント固有アクション: 受領確認
  const handleVerifyReceipt = (userId: string) => {
    const existing = responses.find(r => r.userId === userId)
    const res: EventResponse = existing || {
      id: `res-${Date.now()}`,
      eventId,
      userId,
      status: 'unpaid',
      updatedAt: new Date().toISOString()
    }
    
    upsertResponse({
      ...res,
      status: 'receipt_verified'
    })
  }

  return (
    <div className="min-h-full bg-background-grouped pb-[calc(env(safe-area-inset-bottom)+100px)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-2 py-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-tint p-2 active:opacity-50">
            <ArrowLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>
          <span className="text-headline text-label font-semibold">回答一覧</span>
          <div className="w-20" /> {/* バランス用 */}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* イベント見出し */}
        <div className="flex items-center gap-3 bg-fill p-4 rounded-xl border border-separator/50 shadow-sm">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.color + '20' }}>
            <meta.Icon className="w-5 h-5" style={{ color: meta.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-subhead font-semibold text-label truncate">{event.title}</div>
            <div className="text-caption-1 text-label-secondary">{event.category === 'practice' ? event.date : 'dueDate' in event ? `期限: ${event.dueDate}` : ''}</div>
          </div>
        </div>

        {/* サマリーカード */}
        <div>
          <h2 className="text-title-3 font-bold text-label mb-3 ml-2">回答状況サマリー</h2>
          <ResponseSummaryCard event={event} responses={responses} />
        </div>

        {/* メンバー別リスト */}
        <div>
          <ResponseMemberList 
            event={event} 
            responses={responses} 
            onVerifyReceipt={event.category === 'billing' ? handleVerifyReceipt : undefined}
          />
        </div>

      </div>
    </div>
  )
}

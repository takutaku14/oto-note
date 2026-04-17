import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import { useMembers } from '../../hooks/useMembers'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { EVENT_CATEGORY_META } from '../../constants/eventCategories'
import { EventDetailBody } from './components/EventDetailBody'
import { ResponseActionBar } from './components/ResponseActionBar'
import { EmptyState } from '../../components/ui/EmptyState'

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { getEventById, getMyResponse } = useEvents()
  const { allMembers } = useMembers()
  const { isAdmin, membership } = useCurrentOrg()

  if (!eventId) return null
  const event = getEventById(eventId)

  if (!event) {
    return (
      <div className="min-h-full flex flex-col bg-background-grouped pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center px-2 py-2">
          <button onClick={() => navigate(-1)} className="p-2 text-tint active:opacity-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState title="イベントが見つかりません" description="削除された可能性があります。" />
        </div>
      </div>
    )
  }

  const myResponse = getMyResponse(eventId)
  const meta = EVENT_CATEGORY_META[event.category]
  
  // 責任者の名前を解決
  const manager = allMembers.find(m => m.userId === event.managerId)
  const managerName = manager?.displayName || '不明'

  // 日付または期限の表示文字列
  const getDateDisplay = () => {
    switch (event.category) {
      case 'practice':
      case 'section':
      case 'duty':
        return event.date
      case 'billing':
      case 'survey':
      case 'return':
        return `期限: ${event.dueDate}`
      case 'notice':
        return event.dueDate ? `期限: ${event.dueDate}` : ''
    }
  }

  // 編集権限の判定
  const canEdit = isAdmin || event.managerId === membership.userId

  return (
    <div className="min-h-full bg-background-grouped pb-[calc(env(safe-area-inset-bottom)+100px)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator">
        <div className="flex items-center justify-between px-2 py-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-tint p-2 active:opacity-50">
            <ArrowLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>
          
          <div className="flex items-center gap-2">
            {canEdit && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => navigate(`/org/${event.orgId}/admin/events/${eventId}/responses`)} 
                  className="flex items-center gap-1 text-tint p-2 active:opacity-50"
                >
                  <span className="text-body font-semibold">回答</span>
                </button>
                <button 
                  onClick={() => navigate(`/org/${event.orgId}/admin/events/${eventId}/edit`)} 
                  className="flex items-center gap-1 text-tint p-2 active:opacity-50"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* ヘッダーエリア */}
        <div className="flex flex-col items-center justify-center text-center pb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: meta.color + '20' }}
          >
            <meta.Icon className="w-8 h-8" style={{ color: meta.color }} />
          </div>
          <div 
            className="text-caption-1 font-semibold uppercase tracking-wider mb-1"
            style={{ color: meta.color }}
          >
            {meta.label}
          </div>
          <h1 className="text-large-title font-bold text-label mb-2">{event.title}</h1>
          <p className="text-body text-label-secondary">{getDateDisplay()}</p>
        </div>

        {/* 詳細情報カード */}
        <div className="bg-background-grouped-secondary rounded-xl p-4 space-y-4 shadow-sm">
          {event.memo && (
            <div>
              <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-1">メモ</span>
              <p className="text-body text-label whitespace-pre-wrap">{event.memo}</p>
            </div>
          )}
          {event.memo && <div className="h-[0.5px] w-full bg-separator" />}
          <div className="flex justify-between items-center text-body">
            <span className="text-label-secondary">責任者</span>
            <span className="text-label font-medium">{managerName}</span>
          </div>
          <div className="flex justify-between items-center text-body">
            <span className="text-label-secondary">対象者</span>
            <span className="text-label">{event.targetUserIds.length}名</span>
          </div>
        </div>

        {/* カテゴリ固有UI */}
        <EventDetailBody event={event} />

        {/* アクションボタン */}
        <div className="pt-4">
          <ResponseActionBar event={event} myResponse={myResponse} />
        </div>
      </div>
    </div>
  )
}

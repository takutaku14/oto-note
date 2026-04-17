import React, { useMemo } from 'react'
import type { AppEvent, EventResponse } from '../../../types'

type ResponseSummaryCardProps = {
  event: AppEvent
  responses: EventResponse[]
}

export const ResponseSummaryCard: React.FC<ResponseSummaryCardProps> = ({ event, responses }) => {
  const total = event.targetUserIds.length

  const stats = useMemo(() => {
    let s = { count1: 0, count2: 0, count3: 0, label1: '', label2: '', label3: '', answered: 0 }
    
    switch (event.category) {
      case 'practice':
      case 'section':
        s.label1 = '出席'
        s.label2 = '欠席'
        s.label3 = '保留'
        responses.forEach(r => {
          if (r.status === 'present') s.count1++
          else if (r.status === 'absent') s.count2++
          else if (r.status === 'pending') s.count3++
        })
        s.answered = s.count1 + s.count2 + s.count3
        break
      case 'billing':
        s.label1 = '受領済'
        s.label2 = '支払報告済'
        s.label3 = '未払/未回答'
        responses.forEach(r => {
          if (r.status === 'receipt_verified') s.count1++
          else if (r.status === 'paid_reported') s.count2++
        })
        s.answered = s.count1 + s.count2
        s.count3 = total - s.answered
        break
      case 'survey':
        s.label1 = '回答済'
        s.label2 = '未回答'
        responses.forEach(r => {
          if (r.status === 'answered') s.count1++
        })
        s.answered = s.count1
        s.count2 = total - s.answered
        break
      case 'notice':
      case 'duty':
      case 'return':
        s.label1 = '確認済'
        s.label2 = '未確認'
        responses.forEach(r => {
          if (r.status === 'confirmed') s.count1++
        })
        s.answered = s.count1
        s.count2 = total - s.answered
        break
    }
    return s
  }, [event.category, responses, total])

  const unanswered = total - stats.answered
  const progressPercent = total === 0 ? 0 : Math.round((stats.answered / total) * 100)

  return (
    <div className="bg-background-grouped-secondary rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-label">{stats.answered}<span className="text-body font-normal text-label-secondary mx-1">/</span>{total}</div>
          <div className="text-caption-1 font-semibold uppercase text-label-secondary tracking-wide">回答済み</div>
        </div>
        <div className="text-right">
          <div className="text-title-1 font-bold text-tint">{progressPercent}%</div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-3 bg-fill rounded-full overflow-hidden mb-5">
        <div 
          className="h-full bg-tint rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* 内訳 */}
      <div className="flex justify-between items-center bg-background border border-separator rounded-lg p-3">
        <div className="text-center flex-1">
          <div className="text-title-3 font-bold text-label">{stats.count1}</div>
          <div className="text-caption-2 text-label-secondary">{stats.label1}</div>
        </div>
        <div className="w-[1px] h-8 bg-separator mx-2" />
        <div className="text-center flex-1">
          <div className="text-title-3 font-bold text-label">{stats.count2}</div>
          <div className="text-caption-2 text-label-secondary">{stats.label2}</div>
        </div>
        {stats.label3 && (
          <>
            <div className="w-[1px] h-8 bg-separator mx-2" />
            <div className="text-center flex-1">
              <div className="text-title-3 font-bold text-label">{stats.count3}</div>
              <div className="text-caption-2 text-label-secondary">{stats.label3}</div>
            </div>
          </>
        )}
        {event.category === 'practice' && (
          <>
            <div className="w-[1px] h-8 bg-separator mx-2" />
            <div className="text-center flex-1">
              <div className={`text-title-3 font-bold ${unanswered > 0 ? 'text-red-500' : 'text-label'}`}>{unanswered}</div>
              <div className="text-caption-2 text-label-secondary">未回答</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

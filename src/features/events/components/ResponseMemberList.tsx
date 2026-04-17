import React from 'react'
import type { AppEvent, EventResponse } from '../../../types'
import { InsetGroupedList } from '../../../components/ui/InsetGroupedList'
import { useMembers } from '../../../hooks/useMembers'
import { Check, Clock, Minus, X } from 'lucide-react'

type ResponseMemberListProps = {
  event: AppEvent
  responses: EventResponse[]
  onVerifyReceipt?: (userId: string) => void // 集金用の受領確認アクション
}

export const ResponseMemberList: React.FC<ResponseMemberListProps> = ({ event, responses, onVerifyReceipt }) => {
  const { allMembers, groupBySection } = useMembers()

  // 対象者を所属セクションごとにグループ化
  const targetMembers = allMembers.filter(m => event.targetUserIds.includes(m.userId))
  const groupedMembers = groupBySection(targetMembers)

  // ステータスに応じたアイコンとラベルを取得
  const getStatusDisplay = (userId: string) => {
    const res = responses.find(r => r.userId === userId)
    const status = res?.status || 'unanswered'
    
    // 集金独自の表示
    if (event.category === 'billing') {
      if (status === 'receipt_verified') {
        return { icon: <Check className="w-5 h-5 text-green-500" />, label: '受領済', highlight: false }
      }
      if (status === 'paid_reported') {
        return { 
          icon: <Clock className="w-5 h-5 text-orange-500" />, 
          label: '報告済（確認待）', 
          highlight: false,
          action: onVerifyReceipt ? () => onVerifyReceipt(userId) : undefined
        }
      }
      return { icon: <Minus className="w-5 h-5 text-label-tertiary" />, label: '未回答/未払', highlight: true }
    }

    // 出欠等の表示
    switch (status) {
      case 'present':
      case 'answered':
      case 'confirmed':
        return { icon: <Check className="w-5 h-5 text-green-500" />, label: '出席/済', highlight: false }
      case 'absent':
        return { 
          icon: <X className="w-5 h-5 text-red-500" />, 
          label: '欠席', 
          subLabel: res?.detail, 
          highlight: false 
        }
      case 'pending':
        return { icon: <Clock className="w-5 h-5 text-orange-500" />, label: '保留', highlight: false }
      default:
        return { icon: <Minus className="w-5 h-5 text-label-tertiary" />, label: '未回答', highlight: true } // 簡易エラー表示（赤背景等）
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedMembers).map(([sectionName, members]) => {
        if (members.length === 0) return null

        const items = members.map(m => {
          const display = getStatusDisplay(m.userId)
          
          return {
            id: m.userId,
            title: m.displayName,
            subtitle: display.subLabel ? `理由: ${display.subLabel}` : m.part,
            leftNode: (
              <div className="w-10 flex items-center justify-center">
                {display.icon}
              </div>
            ),
            rightNode: display.action ? (
              <button 
                onClick={display.action}
                className="px-3 py-1 bg-tint text-white text-caption-1 font-bold rounded-full active:scale-95 transition-transform"
              >
                受領確認
              </button>
            ) : (
              <span className={`text-caption-1 font-medium ${display.highlight ? 'text-red-500' : 'text-label-secondary'}`}>
                {display.label}
              </span>
            ),
            // 未回答者を薄い赤背景でハイライトする（簡易版）
            className: display.highlight ? 'bg-red-500/5 dark:bg-red-500/10' : ''
          }
        })

        return (
          <div key={sectionName}>
            <h3 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide mb-2 ml-4">
              {sectionName}
            </h3>
            <InsetGroupedList items={items} />
          </div>
        )
      })}
    </div>
  )
}

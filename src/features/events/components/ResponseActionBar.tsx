import React, { useState } from 'react'
import type { AppEvent, EventResponse, ResponseStatus } from '../../../types'
import { ActionButton } from '../../../components/ui/ActionButton'
import { useAuth } from '../../../hooks/useAuth'
import { useEvents } from '../../../hooks/useEvents'
import { AbsenceReasonModal } from './AbsenceReasonModal'
import { CheckCircle2 } from 'lucide-react'

type ResponseActionBarProps = {
  event: AppEvent
  myResponse?: EventResponse
}

export const ResponseActionBar: React.FC<ResponseActionBarProps> = ({ event, myResponse }) => {
  const { currentUser } = useAuth()
  const { upsertResponse } = useEvents()
  
  // オプティミスティックUIのためのローカルステート
  const [localStatus, setLocalStatus] = useState<ResponseStatus>(myResponse?.status || 'unanswered')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false)

  if (!currentUser) return null

  // ステータス更新処理
  const handleUpdate = async (newStatus: ResponseStatus, detail?: string) => {
    // UIを即時反映（ローカルステート更新）
    const prevStatus = localStatus
    setLocalStatus(newStatus)
    setIsUpdating(true)

    // 新規レスポンスのひな形
    const newResponse: EventResponse = myResponse ? {
      ...myResponse,
      status: newStatus as any,
      detail: detail || myResponse.detail,
    } : {
      id: `res-${Date.now()}`,
      eventId: event.id,
      userId: currentUser.uid,
      status: newStatus as any,
      detail: detail,
      updatedAt: new Date().toISOString(),
    }

    try {
      // 擬似API遅延
      await new Promise(resolve => setTimeout(resolve, 500))
      // MockDataContext を更新
      upsertResponse(newResponse)
    } catch (e) {
      // エラー時はロールバック
      setLocalStatus(prevStatus)
      alert("回答の更新に失敗しました")
    } finally {
      setIsUpdating(false)
    }
  }

  // カテゴリごとのUI出し分け
  switch (event.category) {
    case 'practice':
    case 'section':
      return (
        <>
          <div className="space-y-3">
            <div className="text-caption-1 font-semibold uppercase text-label-secondary tracking-wide text-center">出欠を回答</div>
            <div className="flex gap-2">
              <ActionButton
                label="出席"
                variant={localStatus === 'present' ? 'primary' : 'secondary'}
                onClick={() => handleUpdate('present')}
                disabled={isUpdating}
                fullWidth
              />
              <ActionButton
                label="欠席"
                variant={localStatus === 'absent' ? 'primary' : 'secondary'}
                onClick={() => setIsAbsenceModalOpen(true)}
                disabled={isUpdating}
                fullWidth
              />
              <ActionButton
                label="保留"
                variant={localStatus === 'pending' ? 'primary' : 'secondary'}
                onClick={() => handleUpdate('pending')}
                disabled={isUpdating}
                fullWidth
              />
            </div>
          </div>
          
          <AbsenceReasonModal 
            isOpen={isAbsenceModalOpen} 
            onClose={() => setIsAbsenceModalOpen(false)}
            onSubmit={(reason) => {
              setIsAbsenceModalOpen(false)
              handleUpdate('absent', reason)
            }}
          />
        </>
      )
    case 'billing':
      if (localStatus === 'receipt_verified') {
         return (
            <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                 <CheckCircle2 className="w-8 h-8 text-white" />
               </div>
               <span className="text-headline font-bold text-green-700 dark:text-green-400">受領確認済み</span>
               <p className="text-caption-1 text-green-600/80 mt-1 dark:text-green-400/80">
                 責任者がお支払いを確認しました
               </p>
            </div>
         )
      }
      return (
        <div className="space-y-3">
          <ActionButton
             label={localStatus === 'paid_reported' ? '支払報告を取消' : '支払報告済にする'}
             variant={localStatus === 'paid_reported' ? 'secondary' : 'primary'}
             onClick={() => handleUpdate(localStatus === 'paid_reported' ? 'unpaid' : 'paid_reported')}
             disabled={isUpdating}
             fullWidth
          />
          {localStatus === 'paid_reported' && (
             <p className="text-caption-1 text-label-secondary text-center mt-2 animate-in fade-in">
               責任者の受領確認待ちです
             </p>
          )}
        </div>
      )
    case 'survey':
      return (
        <div className="space-y-3">
          <ActionButton
             label={localStatus === 'answered' ? '回答済を取り消す' : '回答済にする'}
             variant={localStatus === 'answered' ? 'secondary' : 'primary'}
             onClick={() => handleUpdate(localStatus === 'answered' ? 'unanswered' : 'answered')}
             disabled={isUpdating}
             fullWidth
          />
        </div>
      )
    case 'notice':
    case 'duty':
    case 'return':
      return (
        <div className="space-y-3">
          <ActionButton
             label={localStatus === 'confirmed' ? '確認を取り消す' : '確認済にする'}
             variant={localStatus === 'confirmed' ? 'secondary' : 'primary'}
             onClick={() => handleUpdate(localStatus === 'confirmed' ? 'unanswered' : 'confirmed')}
             disabled={isUpdating}
             fullWidth
          />
        </div>
      )
    default:
      return null
  }
}

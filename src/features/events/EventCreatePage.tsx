/**
 * EventCreatePage — イベント作成ページ
 * カテゴリ選択 → 共通情報 → 固有情報のウィザード形式
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useMockData } from '../../hooks/useMockData'
import { CategorySelector } from './components/CategorySelector'
import { CategoryFields } from './components/CategoryFields'
import { MemberSelector } from '../../components/shared/MemberSelector'
import { ManagerPicker } from '../../components/shared/ManagerPicker'
import { ActionButton } from '../../components/ui/ActionButton'
import type { EventCategory, AppEvent } from '../../types'

export const EventCreatePage: React.FC = () => {
  const { currentUser } = useAuth()
  const { org, season } = useCurrentOrg()
  const { addEvent } = useMockData()
  const navigate = useNavigate()

  // --- State ---
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Step 1: Category
  const [category, setCategory] = useState<EventCategory | null>(null)

  // Step 2: Common Fields
  const [title, setTitle] = useState('')
  const [memo, setMemo] = useState('')
  const [targetUserIds, setTargetUserIds] = useState<string[]>([])
  const [managerId, setManagerId] = useState<string>(currentUser?.uid || '')

  // Step 2: Category Specific Data
  const [catData, setCatData] = useState<Record<string, any>>({})

  // --- Handlers ---
  const handleNext = () => {
    if (category) setStep(2)
  }

  const handleSubmit = async () => {
    if (!currentUser || !category || !title.trim() || targetUserIds.length === 0) return

    setIsSubmitting(true)

    const eventId = `event-${Date.now()}`
    const baseEvent = {
      id: eventId,
      orgId: org.id,
      seasonId: season?.id || 'no-season',
      title: title.trim(),
      memo: memo.trim() || undefined,
      category,
      targetUserIds,
      authorId: currentUser.uid,
      managerId,
      createdAt: new Date().toISOString(),
    }

    // カテゴリごとのデータを結合
    const newEvent = { ...baseEvent, ...catData } as AppEvent

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

  const isValidStep2 = title.trim().length > 0 && targetUserIds.length > 0

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
            onClick={() => step === 1 ? navigate(-1) : setStep(1)}
            className="flex items-center gap-1 text-tint active:opacity-50 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{step === 1 ? 'キャンセル' : '戻る'}</span>
          </button>
          <span className="text-headline text-label font-semibold">イベント作成</span>
          <div className="w-20" /> {/* バランス調整 */}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {step === 1 ? (
          /* ==========================================
           * STEP 1: カテゴリ選択
           * ========================================== */
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 font-bold text-label mb-1">イベントの種類</h2>
              <p className="text-subhead text-label-secondary">
                作成するイベントのカテゴリを選択してください。
              </p>
            </div>
            
            <CategorySelector
              selectedCategory={category}
              onSelect={setCategory}
            />

            <ActionButton
              label="次へ"
              onClick={handleNext}
              disabled={!category}
              fullWidth
            />
          </div>
        ) : (
          /* ==========================================
           * STEP 2: 詳細入力
           * ========================================== */
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* --- 共通フィールド --- */}
            <div className="space-y-5">
              <div>
                <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：第5回 全体練習"
                  className="w-full rounded-xl bg-fill px-4 py-3 text-body"
                />
              </div>
              <div>
                <label className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">メモ (任意)</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="持ち物や注意事項など"
                  rows={3}
                  className="w-full rounded-xl bg-fill px-4 py-3 text-body resize-none"
                />
              </div>
            </div>

            <hr className="border-separator" />

            {/* --- カテゴリ固有フィールド --- */}
            {category && (
              <CategoryFields
                category={category}
                data={catData}
                onChange={(updates) => setCatData({ ...catData, ...updates })}
              />
            )}

            <hr className="border-separator" />

            {/* --- 権限・対象者設定 --- */}
            <div className="space-y-6">
              <div>
                <h3 className="text-title-3 font-bold text-label mb-2">対象者</h3>
                <p className="text-caption-1 text-label-secondary mb-4">
                  このイベントに参加・回答するメンバーを選択してください。休団者はデフォルトで除外されます。
                </p>
                <MemberSelector
                  selectedUserIds={targetUserIds}
                  onChange={setTargetUserIds}
                />
              </div>

              <div>
                <h3 className="text-title-3 font-bold text-label mb-2">権限の委譲 (任意)</h3>
                <p className="text-caption-1 text-label-secondary mb-4">
                  回答状況の確認などを行う「責任者」を別のメンバーに委譲できます。
                </p>
                <ManagerPicker
                  selectedUserId={managerId}
                  onChange={setManagerId}
                />
              </div>
            </div>

            {/* --- 作成ボタン --- */}
            <ActionButton
              label="イベントを作成"
              onClick={handleSubmit}
              disabled={!isValidStep2 || isSubmitting}
              isLoading={isSubmitting}
              fullWidth
            />
            <div className="h-8" />
          </div>
        )}
      </div>
    </div>
  )
}

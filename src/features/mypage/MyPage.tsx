/**
 * マイページ (Profile & Settings)
 * ユーザー情報の表示、ログアウト、データリセットなどの操作を提供。
 */

import { useAuth } from '../../hooks/useAuth'
import { useMockData } from '../../hooks/useMockData'
import { InsetGroupedList } from '../../components/ui/InsetGroupedList'
import { LogOut, RotateCcw, User as UserIcon } from 'lucide-react'

export const MyPage: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { resetAllData } = useMockData()

  if (!currentUser) return null

  /** プロフィールセクションのアイテム */
  const profileItems = [
    {
      title: currentUser.displayName,
      subtitle: currentUser.email,
      icon: <UserIcon className="h-5 w-5" />,
    },
  ]

  /** 設定・操作セクションのアイテム */
  const actionItems = [
    {
      title: 'ログアウト',
      icon: <LogOut className="h-5 w-5" />,
      onClick: () => {
        if (confirm('ログアウトしますか？')) {
          logout()
        }
      },
    },
    {
      title: 'モックデータをリセット',
      icon: <RotateCcw className="h-5 w-5" />,
      onClick: () => {
        if (confirm('作成したデータ（団体、イベント等）をすべて消去し、初期状態に戻しますか？')) {
          resetAllData()
          window.location.reload()
        }
      },
    },
  ]

  return (
    <div className="min-h-full bg-background-grouped pb-[env(safe-area-inset-bottom)]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-background-grouped/80 backdrop-blur-xl border-b border-separator px-6 py-4">
        <h1 className="text-title-2 font-bold text-label">マイページ</h1>
      </header>

      <div className="py-6 space-y-6">
        {/* プロフィール */}
        <section>
          <InsetGroupedList items={profileItems} header="プロフィール" />
        </section>

        {/* 設定・操作 */}
        <section>
          <InsetGroupedList items={actionItems} header="設定・管理" />
        </section>

        {/* フッター情報 */}
        <div className="px-8 py-4">
          <p className="text-caption-1 text-label-quaternary text-center">
            oto-note v0.1.0-alpha (Phase 3 + Logout)
            <br />
            Mock Database Mode
          </p>
        </div>
      </div>
    </div>
  )
}

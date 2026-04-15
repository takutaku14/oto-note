/**
 * ログイン画面
 * モックユーザーを選択してログインする。
 * Apple HIG 準拠の洗練されたフルスクリーンデザイン。
 */

import { useNavigate } from 'react-router-dom'
import { Music, ChevronRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { mockUsers } from '../../mocks'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (userId: string) => {
    login(userId)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* ヒーローセクション */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">
        {/* アプリロゴ */}
        <div
          className="w-20 h-20 rounded-[22px] flex items-center justify-center shadow-lg mb-6"
          style={{ background: 'linear-gradient(135deg, rgb(var(--color-tint)), #5856D6)' }}
        >
          <Music className="w-10 h-10 text-white" />
        </div>

        {/* アプリタイトル */}
        <h1 className="text-large-title font-bold text-label mb-2">
          oto-note
        </h1>
        <p className="text-body text-label-secondary text-center max-w-xs">
          アマチュア音楽団体のための
          <br />
          スケジュール・タスク管理アプリ
        </p>
      </div>

      {/* ユーザー選択セクション */}
      <div className="px-4 pb-[env(safe-area-inset-bottom)] pb-8">
        <h2 className="text-footnote font-semibold uppercase text-label-secondary tracking-wide px-4 pb-2">
          ログインするユーザーを選択
        </h2>

        <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
          {mockUsers.map((user, index) => (
            <button
              key={user.uid}
              onClick={() => handleLogin(user.uid)}
              className="relative flex w-full items-center py-3 px-4 text-left active:bg-fill transition-colors duration-150"
            >
              {/* アバター */}
              <div className="w-10 h-10 rounded-full bg-fill flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-headline text-label-secondary">
                  {user.displayName.charAt(0)}
                </span>
              </div>

              {/* ユーザー情報 */}
              <div className="flex-1 min-w-0">
                <p className="text-body text-label">{user.displayName}</p>
                <p className="text-caption-1 text-label-tertiary">{user.email}</p>
              </div>

              {/* シェブロン */}
              <ChevronRight className="w-5 h-5 text-label-tertiary flex-shrink-0" />

              {/* セパレーター */}
              {index < mockUsers.length - 1 && (
                <div className="absolute bottom-0 left-[4.25rem] right-0 h-[0.5px] bg-separator" />
              )}
            </button>
          ))}
        </div>

        {/* フッター */}
        <p className="text-caption-2 text-label-quaternary text-center mt-4 px-4">
          モック版: 開発中はユーザーを選択してログインします。
          <br />
          製品版では Google / Apple ログインに置き換わります。
        </p>
      </div>
    </div>
  )
}

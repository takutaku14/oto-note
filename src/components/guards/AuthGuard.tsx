/**
 * AuthGuard — 認証ガード
 * 未ログインの場合は /login にリダイレクトする
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const AuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // localStorage からの復元中はローディング表示
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-tint border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

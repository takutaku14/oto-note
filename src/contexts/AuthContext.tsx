/**
 * AuthContext — 認証状態管理
 *
 * モック版: mockUsers からユーザーを選択してログイン。
 * localStorage で簡易永続化し、リロード時にもログイン状態を維持する。
 * Phase 6 で Firebase Auth に置き換え予定。
 */

import { createContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { mockUsers } from '../mocks'

/** AuthContext が提供する型 */
export type AuthContextValue = {
  /** 現在のログインユーザー（未ログインなら null） */
  currentUser: User | null
  /** ログイン処理 */
  login: (userId: string) => void
  /** ログアウト処理 */
  logout: () => void
  /** ログイン済みかどうか */
  isAuthenticated: boolean
  /** 初期化中かどうか（localStorage からの復元中） */
  isLoading: boolean
}

const STORAGE_KEY = 'oto-note-current-user-id'

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // localStorage からログイン状態を復元
  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY)
    if (savedUserId) {
      const user = mockUsers.find((u) => u.uid === savedUserId)
      if (user) {
        setCurrentUser(user)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((userId: string) => {
    const user = mockUsers.find((u) => u.uid === userId)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem(STORAGE_KEY, userId)
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: AuthContextValue = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

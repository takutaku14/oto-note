/**
 * useAuth — 認証状態へのアクセスを提供する Custom Hook
 * Phase 6 で Firebase Auth に移行する際、この Hook の内部実装のみ差し替え
 */

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import type { AuthContextValue } from '../contexts/AuthContext'

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}

/**
 * useCurrentOrg — OrgContext の値を返す Custom Hook
 */

import { useContext } from 'react'
import { OrgContext } from '../contexts/OrgContext'
import type { OrgContextValue } from '../contexts/OrgContext'

export const useCurrentOrg = (): OrgContextValue => {
  const context = useContext(OrgContext)
  if (!context) {
    throw new Error('useCurrentOrg は OrgGuard（OrgContext.Provider）の内側で使用してください')
  }
  return context
}

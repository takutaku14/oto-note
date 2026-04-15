/**
 * useMockData — MockDataContext へのアクセスを提供する内部 Hook
 */

import { useContext } from 'react'
import { MockDataContext } from '../contexts/MockDataContext'
import type { MockDataContextValue } from '../contexts/MockDataContext'

export const useMockData = (): MockDataContextValue => {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData は MockDataProvider の内側で使用してください')
  }
  return context
}

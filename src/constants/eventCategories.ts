/**
 * イベントカテゴリのメタデータ定義
 * 各カテゴリの表示名・アイコン・テーマカラーを集約
 */

import {
  Music,
  Users,
  Wallet,
  ClipboardList,
  Bell,
  CalendarCheck,
  Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { EventCategory } from '../types'

/** カテゴリメタデータの型 */
export type EventCategoryMeta = {
  /** 日本語ラベル */
  label: string
  /** lucide-react アイコンコンポーネント */
  Icon: LucideIcon
  /** テーマカラー (HEX) */
  color: string
}

export const EVENT_CATEGORY_META: Record<EventCategory, EventCategoryMeta> = {
  practice: { label: '練習',           Icon: Music,         color: '#007AFF' },
  section:  { label: 'セクション練習', Icon: Users,         color: '#5856D6' },
  billing:  { label: '集金',           Icon: Wallet,        color: '#FF9500' },
  survey:   { label: 'アンケート',     Icon: ClipboardList, color: '#34C759' },
  notice:   { label: 'お知らせ',       Icon: Bell,          color: '#FF3B30' },
  duty:     { label: '当番',           Icon: CalendarCheck, color: '#AF52DE' },
  return:   { label: '備品返却',       Icon: Package,       color: '#FF2D55' },
}

/** 
 * タイムライン用の左右振分判定 
 * 予定系（練習、当番など）は left 、 事務タスク系（集金、アンケートなど）は right に配置
 */
export const getEventDirection = (category: EventCategory): 'left' | 'right' => {
  const leftCategories: EventCategory[] = ['practice', 'section', 'duty']
  return leftCategories.includes(category) ? 'left' : 'right'
}

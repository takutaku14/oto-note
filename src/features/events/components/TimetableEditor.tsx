/**
 * TimetableEditor — タイムテーブル（時間・内容・場所）のリスト入力
 */

import { useState } from 'react'
import { Plus, X, Clock, MapPin, AlignLeft } from 'lucide-react'
import type { TimetableEntry } from '../../../types'

type TimetableEditorProps = {
  timetable: TimetableEntry[]
  onChange: (timetable: TimetableEntry[]) => void
}

export const TimetableEditor: React.FC<TimetableEditorProps> = ({
  timetable,
  onChange,
}) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')

  const handleAdd = () => {
    if (!startTime || !content) return
    const newEntry: TimetableEntry = {
      startTime,
      endTime: endTime || startTime,
      content,
      location: location || undefined,
    }
    onChange([...timetable, newEntry])
    // リセット
    setStartTime(endTime || startTime)
    setEndTime('')
    setContent('')
    setLocation('')
  }

  const handleRemove = (index: number) => {
    onChange(timetable.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* 登録済みリスト */}
      {timetable.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-background-grouped-secondary">
          {timetable.map((entry, index) => (
            <div
              key={index}
              className="relative flex items-start gap-3 py-3 px-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-caption-1 font-mono text-tint bg-tint/10 px-1.5 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    {entry.startTime} {entry.endTime && `– ${entry.endTime}`}
                  </span>
                </div>
                <p className="text-body text-label">{entry.content}</p>
                {entry.location && (
                  <p className="text-caption-1 text-label-secondary mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {entry.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="w-8 h-8 rounded-full bg-fill flex items-center justify-center active:opacity-50 text-label-tertiary hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              {index < timetable.length - 1 && (
                <div className="absolute bottom-0 left-4 right-0 h-[0.5px] bg-separator" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 追加フォーム */}
      <div className="rounded-xl bg-fill p-4 space-y-3 border border-separator/50">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-caption-1 text-label-tertiary block mb-1">開始</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg bg-background-grouped px-3 py-2 text-body"
            />
          </div>
          <div className="flex-1">
            <label className="text-caption-1 text-label-tertiary block mb-1">終了</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg bg-background-grouped px-3 py-2 text-body"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-background-grouped rounded-lg pl-3 pr-2 py-1">
          <AlignLeft className="w-4 h-4 text-label-tertiary flex-shrink-0" />
          <input
            type="text"
            placeholder="内容 (例: 合奏)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent py-1 text-body outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-background-grouped rounded-lg pl-3 pr-2 py-1">
          <MapPin className="w-4 h-4 text-label-tertiary flex-shrink-0" />
          <input
            type="text"
            placeholder="場所 (任意)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent py-1 text-body outline-none"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!startTime || !content}
          className="w-full py-2.5 bg-tint text-white font-semibold rounded-lg disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" />
          タイムテーブルに追加
        </button>
      </div>
    </div>
  )
}

import React from 'react'
import { Clock, MapPin } from 'lucide-react'
import type { TimetableEntry } from '../../../types'

type TimetableViewProps = {
  timetable: TimetableEntry[]
  date?: string
}

export const TimetableView: React.FC<TimetableViewProps> = ({ timetable, date }) => {
  if (!timetable || timetable.length === 0) return null

  return (
    <div className="relative pl-6">
      {/* 縦のタイムライン線 */}
      <div className="absolute top-3 bottom-6 left-2.5 w-[2px] bg-separator" />
      
      <div className="space-y-6">
        {timetable.map((entry, idx) => (
          <div key={idx} className="relative">
            {/* タイムラインのポイント */}
            <div className="absolute -left-[22px] top-1.5 w-2 h-2 rounded-full bg-tint ring-4 ring-background-grouped" />
            
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-subhead font-mono text-tint bg-tint/10 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                {entry.startTime} {entry.endTime && `– ${entry.endTime}`}
              </span>
            </div>
            <p className="text-body text-label">{entry.content}</p>
            {entry.location && (
              <p className="text-caption-1 text-label-secondary mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {entry.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

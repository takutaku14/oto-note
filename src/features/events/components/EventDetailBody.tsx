import React from 'react'
import type { AppEvent } from '../../../types'
import { TimetableView } from './TimetableView'
import { ExternalLink, CheckCircle } from 'lucide-react'
import { CalendarExportButton } from './CalendarExportButton'

type EventDetailBodyProps = {
  event: AppEvent
}

export const EventDetailBody: React.FC<EventDetailBodyProps> = ({ event }) => {
  switch (event.category) {
    case 'practice':
      return (
        <div className="space-y-4">
          <CalendarExportButton event={event} />
          <div>
            <h3 className="text-title-3 font-bold text-label mb-4">タイムテーブル</h3>
            <TimetableView timetable={event.timetable} />
          </div>
        </div>
      )
    case 'section':
      return (
        <div className="space-y-4">
          {event.targetSection && (
            <div className="bg-background-grouped-secondary rounded-xl p-4 mb-4 shadow-sm">
              <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-1">対象パート</span>
              <p className="text-body text-label">{event.targetSection}</p>
            </div>
          )}
          <CalendarExportButton event={event} />
          <div>
            <h3 className="text-title-3 font-bold text-label mb-4">タイムテーブル</h3>
            <TimetableView timetable={event.timetable} />
          </div>
        </div>
      )
    case 'billing':
      return (
        <div className="bg-background-grouped-secondary rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
          <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide mb-1">金額</span>
          <p className="text-[34px] font-bold text-label tracking-tight">¥{event.amount.toLocaleString()}</p>
        </div>
      )
    case 'survey':
      return (
        <div className="bg-background-grouped-secondary rounded-xl p-4 shadow-sm">
          <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-2">フォームURL</span>
          <a
            href={event.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-body text-tint bg-background-grouped p-3 rounded-lg active:opacity-50 transition-opacity"
          >
            <span className="truncate mr-2">{event.formUrl}</span>
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
          </a>
        </div>
      )
    case 'return':
      return (
        <div className="bg-background-grouped-secondary rounded-xl p-4 shadow-sm">
          <span className="text-footnote font-semibold uppercase text-label-secondary tracking-wide block mb-3">対象備品</span>
          <div className="space-y-2">
            {event.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-label-tertiary" />
                <span className="text-body text-label">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'notice':
    case 'duty':
    default:
      return null
  }
}

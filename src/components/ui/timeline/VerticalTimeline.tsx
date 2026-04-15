import type { ReactNode } from 'react'

export const VerticalTimeline: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="vertical-timeline max-w-5xl mx-auto md:px-6">
      {children}
    </div>
  )
}

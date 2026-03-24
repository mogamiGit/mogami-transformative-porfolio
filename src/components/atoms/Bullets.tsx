import React from 'react'

interface BulletsProps {
  title: string
  children: React.ReactNode
}

export const Bullets: React.FC<BulletsProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-blue-violet font-semibold capitalize">{title}</h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

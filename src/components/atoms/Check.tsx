import React from 'react'

interface CheckProps {
  text: string
}

export const Check: React.FC<CheckProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-2">
      <img src="/images/check-vector.svg" alt="" className="w-4 h-4" />
      <span className="text-sm italic text-muted-foreground">{text}</span>
    </div>
  )
}

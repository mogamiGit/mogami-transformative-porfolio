import React from 'react'

interface TitleSectionProps {
  text: string
}

export const TitleSection: React.FC<TitleSectionProps> = ({ text }) => {
  return (
    <p className="text-5xl font-thin text-blue-violet flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-full bg-blue-violet" />
      {text}
    </p>
  )
}

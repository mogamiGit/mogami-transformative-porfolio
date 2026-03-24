import React from 'react'

interface TitleSymbolProps {
  children: React.ReactNode
}

export const TitleSymbol: React.FC<TitleSymbolProps> = ({ children }) => {
  return (
    <h3 className="text-2xl font-semibold">
      <span className="text-blue-violet">&#10095;_</span>
      {children}
    </h3>
  )
}

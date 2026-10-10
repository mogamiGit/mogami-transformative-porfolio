import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { SmoothScroll } from './SmoothScroll'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <SmoothScroll />
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}

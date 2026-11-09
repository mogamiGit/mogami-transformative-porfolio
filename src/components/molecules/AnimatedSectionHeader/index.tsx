'use client'

import React from 'react'
import { ScrollReveal } from '@/components/atoms/ScrollReveal/ScrollReveal.client'
import { SectionHeader, type SectionHeaderProps } from '@/components/molecules/SectionHeader'

export const AnimatedSectionHeader: React.FC<SectionHeaderProps> = (props) => {
  return (
    <ScrollReveal from="up" distance={16}>
      <SectionHeader {...props} />
    </ScrollReveal>
  )
}

import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/organisms/RichText'
import { ScrollReveal } from '@/components/atoms/ScrollReveal/ScrollReveal.client'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('container my-8', className)}>
      <ScrollReveal from="up" distance={16}>
        <div
          className={cn('border py-3 px-6 flex items-center rounded', {
            'border-border bg-card': style === 'info',
            'border-error bg-error/30': style === 'error',
            'border-success bg-success/30': style === 'success',
            'border-warning bg-warning/30': style === 'warning',
          })}
        >
          <RichText data={content} enableGutter={false} enableProse={false} />
        </div>
      </ScrollReveal>
    </div>
  )
}

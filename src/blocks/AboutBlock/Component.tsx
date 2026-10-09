import React from 'react'

import type { AboutBlockType } from '@/payload-types'

import { Card } from '@/components/atoms/Card'
import { TypedText } from '@/components/atoms/TypedText/TypedText.client'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import RichText from '@/components/organisms/RichText'
import { cn } from '@/utilities/ui'
import { MantraLoop } from './Component.client'

export const AboutBlockComponent: React.FC<AboutBlockType> = ({ sectionTitle, bio, mantra }) => {
  const steps = (mantra ?? []).map((item) => item.step).filter(Boolean)
  const hasMantra = steps.length > 0

  return (
    <section id="about" className="container py-16">
      <SectionHeader title={sectionTitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {bio && (
          <Card className={cn('gap-5 p-6 md:p-8', hasMantra ? 'lg:col-span-2' : 'lg:col-span-3')}>
            <div className="pb-3 border-b border-dashed border-card-border type-command text-card-foreground">
              <span className="text-primary">$</span> <TypedText text="cat about.md" />
            </div>
            <RichText
              data={bio}
              enableGutter={false}
              enableProse={false}
              className="type-body text-card-foreground/80 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:first-child]:type-title [&_p:first-child]:text-card-foreground [&_p:last-child]:text-accent-foreground"
            />
          </Card>
        )}

        {hasMantra && <MantraLoop steps={steps} />}
      </div>
    </section>
  )
}

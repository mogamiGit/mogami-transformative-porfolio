import React from 'react'

import type { PortfolioHeroBlock } from '@/payload-types'

import RichText from '@/components/organisms/RichText'
import { Reveal } from '@/components/atoms/Reveal/Reveal.client'
import { TypedText } from '@/components/atoms/TypedText/TypedText.client'
import { PortfolioHeroClient } from './Component.client'

export const PortfolioHeroBlockComponent: React.FC<PortfolioHeroBlock> = ({
  tagText,
  tagEmoji,
  role,
  heading,
  description,
}) => {
  return (
    <section className="container py-24">
      {(tagText || tagEmoji) && (
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 border border-accent-foreground/60 px-3 py-1 type-label text-accent-foreground">
            {tagEmoji && <span>{tagEmoji}</span>}
            {tagText}
          </p>
        </Reveal>
      )}
      {role && (
        <p className="mb-3 type-mono text-muted-foreground">
          <TypedText text={role} speed={35} />
        </p>
      )}
      <Reveal delay={0.15}>
        <h1 className="type-display text-foreground mb-6">
          {heading}
          <span
            aria-hidden="true"
            className="ml-1 text-accent-foreground animate-blink motion-reduce:animate-none"
          >
            _
          </span>
        </h1>
      </Reveal>
      {description && (
        <Reveal delay={0.3}>
          <RichText
            data={description}
            enableGutter={false}
            enableProse={false}
            className="max-w-3xl mb-8 type-lead text-foreground opacity-80"
          />
        </Reveal>
      )}
      <Reveal delay={0.45}>
        <PortfolioHeroClient />
      </Reveal>
    </section>
  )
}

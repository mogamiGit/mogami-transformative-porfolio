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
          <p className="mb-4 text-base">
            {tagEmoji && <span className="mr-2">{tagEmoji}</span>}
            {tagText}
          </p>
        </Reveal>
      )}
      {role && (
        <p className="mb-2 text-muted-foreground font-mono">
          <TypedText text={role} speed={35} />
        </p>
      )}
      <Reveal delay={0.15}>
        <h1 className="text-4xl font-bold mb-6">
          {heading}
          <span
            aria-hidden="true"
            className="ml-1 text-primary animate-blink motion-reduce:animate-none"
          >
            _
          </span>
        </h1>
      </Reveal>
      {description && (
        <Reveal delay={0.3}>
          <RichText data={description} />
        </Reveal>
      )}
      <Reveal delay={0.45}>
        <PortfolioHeroClient />
      </Reveal>
    </section>
  )
}

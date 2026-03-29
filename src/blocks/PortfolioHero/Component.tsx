import React from 'react'

import type { PortfolioHeroBlock } from '@/payload-types'

import RichText from '@/components/RichText'

export const PortfolioHeroBlock: React.FC<PortfolioHeroBlock> = ({
  tagText,
  tagEmoji,
  role,
  heading,
  description,
}) => {
  return (
    <section className="container py-24">
      {(tagText || tagEmoji) && (
        <p className="mb-4 text-sm">
          {tagEmoji && <span className="mr-2">{tagEmoji}</span>}
          {tagText}
        </p>
      )}
      {role && <p className="mb-2 text-muted-foreground">{role}</p>}
      <h1 className="text-4xl font-bold mb-6">{heading}</h1>
      {description && <RichText data={description} />}
    </section>
  )
}

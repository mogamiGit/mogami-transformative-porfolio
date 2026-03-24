import React from 'react'
import type { PortfolioHeroBlock as PortfolioHeroBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Tag } from '@/components/atoms/Tag'
import { Media } from '@/components/Media'

export const PortfolioHeroBlock: React.FC<PortfolioHeroBlockProps> = (props) => {
  const { tagText, tagEmoji, role, heading, description, heroImage } = props

  return (
    <section className="container py-16 lg:py-24">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
        <div className="flex-1 flex flex-col gap-4">
          {tagText && (
            <Tag variant="yellow" text={`${tagText} ${tagEmoji || ''}`} />
          )}
          {role && (
            <h4 className="text-lg text-blue-violet">{role}</h4>
          )}
          {heading && (
            <h1 className="font-kalnia text-4xl sm:text-5xl lg:text-6xl leading-[1.2]">
              {heading}
            </h1>
          )}
          {description && (
            <RichText data={description} enableGutter={false} className="text-muted-foreground" />
          )}
        </div>
        {heroImage && typeof heroImage !== 'string' && (
          <div className="flex-shrink-0 w-full max-w-[300px] lg:max-w-[400px]">
            <Media resource={heroImage} imgClassName="rounded-2xl" />
          </div>
        )}
      </div>
    </section>
  )
}

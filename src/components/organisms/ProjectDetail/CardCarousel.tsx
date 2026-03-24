import React from 'react'
import type { Project, Media as MediaType } from '@/payload-types'

type CarouselItem = NonNullable<Project['carousel']>[number]

interface CardCarouselProps {
  card: CarouselItem
}

function isMediaObject(media: CarouselItem['media']): media is MediaType {
  return typeof media === 'object' && media !== null && 'url' in media
}

export const CardCarousel: React.FC<CardCarouselProps> = ({ card }) => {
  const { media, title, mediaType, videoUrl } = card
  const isVideo = mediaType === 'video'
  const mediaObj = isMediaObject(media) ? media : null

  const mediaUrl = videoUrl || mediaObj?.url || null

  return (
    <div className="flex-shrink-0 w-[300px] md:w-[400px] snap-center">
      <div className="rounded-xl overflow-hidden bg-card border border-border">
        {isVideo && mediaUrl ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[250px] md:h-[300px] object-cover"
          />
        ) : mediaObj?.url ? (
          <img
            src={mediaObj.url}
            alt={title || mediaObj.alt || ''}
            className="w-full h-[250px] md:h-[300px] object-cover"
          />
        ) : null}
      </div>
      {title && (
        <p className="mt-2 text-sm text-muted-foreground text-center">{title}</p>
      )}
    </div>
  )
}

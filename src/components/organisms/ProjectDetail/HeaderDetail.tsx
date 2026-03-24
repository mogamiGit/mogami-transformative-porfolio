import React from 'react'
import type { Project } from '@/payload-types'
import { Media } from '@/components/Media'

interface HeaderDetailProps {
  title: string
  headerImage?: Project['headerImage']
}

export const HeaderDetail: React.FC<HeaderDetailProps> = ({ title, headerImage }) => {
  return (
    <section className="container pt-16 lg:pt-24">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <h1 className="font-kalnia text-4xl sm:text-5xl lg:text-6xl leading-[1.2] flex-1">
          {title}
        </h1>
        {headerImage && typeof headerImage !== 'string' && (
          <div className="flex-shrink-0 w-full max-w-[500px]">
            <Media resource={headerImage} imgClassName="rounded-2xl" />
          </div>
        )}
      </div>
    </section>
  )
}

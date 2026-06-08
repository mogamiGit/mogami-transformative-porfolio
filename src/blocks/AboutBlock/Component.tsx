import React from 'react'

import type { AboutBlockType } from '@/payload-types'

import RichText from '@/components/organisms/RichText'

export const AboutBlockComponent: React.FC<AboutBlockType> = ({ sectionTitle, bio }) => {
  return (
    <section className="container py-16">
      {sectionTitle && <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>}
      {bio && <RichText data={bio} />}
    </section>
  )
}

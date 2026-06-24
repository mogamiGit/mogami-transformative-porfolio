'use client'

import React from 'react'
import type { Experience } from '@/payload-types'
import { CardList } from '@/components/molecules/CardList'

type Props = {
  label?: string
  title?: string
  items: Experience[]
}

export const ExperienceCardList: React.FC<Props> = ({ label, title, items }) => {
  return (
    <section className="container">
      <CardList
        label={label}
        title={title ?? 'experience.log'}
        items={items.map((item) => ({
          id: item.id,
          prefix: item.period,
          text: item.organization,
        }))}
      />
    </section>
  )
}

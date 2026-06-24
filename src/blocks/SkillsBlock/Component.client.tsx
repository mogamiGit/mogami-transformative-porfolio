'use client'

import React from 'react'
import type { Skill } from '@/payload-types'
import { CardList } from '@/components/molecules/CardList'

type Props = {
  label?: string | null
  title?: string | null
  items: Skill[]
}

export const SkillsList: React.FC<Props> = ({ label, title, items }) => {
  return (
    <section className="container">
      <CardList
        label={label ?? undefined}
        title={title ?? 'skills.log'}
        items={items.map((item) => ({
          id: item.id,
          text: item.name,
        }))}
      />
    </section>
  )
}

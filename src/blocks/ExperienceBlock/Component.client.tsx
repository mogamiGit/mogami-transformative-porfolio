'use client'

import React from 'react'
import type { Experience } from '@/payload-types'

type Props = {
  items: Experience[]
}

export const ExperienceList: React.FC<Props> = ({ items }) => {
  return (
      <div>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 text-sm">
          <p className=''>[ {item.period} ]</p>
          <p>{item.organization}</p>
        </div>
      ))}
    </div>
  )
}

import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { ExperienceBlockType } from '@/payload-types'
import { TitleSection } from '@/components/atoms/TitleSection'
import { TitleSymbol } from '@/components/atoms/TitleSymbol'
import { ListItem } from '@/components/molecules/ListItem'

export const ExperienceBlockComponent: React.FC<ExperienceBlockType> = async (props) => {
  const { sectionTitle } = props
  const payload = await getPayload({ config: configPromise })

  const experience = await payload.find({
    collection: 'experience',
    sort: 'order',
    limit: 100,
  })

  const education = experience.docs.filter((e) => e.type === 'education')
  const work = experience.docs.filter((e) => e.type === 'work')

  return (
    <section id="experience" className="container py-16">
      <TitleSection text={sectionTitle || 'experience'} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <TitleSymbol>Education</TitleSymbol>
          <div className="mt-4 flex flex-col">
            {education.map((item) => (
              <ListItem
                key={item.id}
                year={item.period}
                title={item.organization}
                subtitle={item.role}
              />
            ))}
          </div>
        </div>
        <div>
          <TitleSymbol>Work</TitleSymbol>
          <div className="mt-4 flex flex-col">
            {work.map((item) => (
              <ListItem
                key={item.id}
                year={item.period}
                title={item.organization}
                subtitle={item.role}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { AboutBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { TitleSection } from '@/components/atoms/TitleSection'
import { Bullets } from '@/components/atoms/Bullets'
import { Tag } from '@/components/atoms/Tag'
import { Media } from '@/components/Media'

export const AboutBlockComponent: React.FC<AboutBlockType> = async (props) => {
  const { sectionTitle, bio, profileImage } = props
  const payload = await getPayload({ config: configPromise })

  const skills = await payload.find({
    collection: 'skills',
    sort: 'order',
    limit: 100,
  })

  const hardSkills = skills.docs.filter((s) => s.skillType === 'hard')
  const softSkills = skills.docs.filter((s) => s.skillType === 'soft')

  const categories = ['languages', 'frameworks', 'patterns', 'tools', 'methodologies'] as const
  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat] = hardSkills.filter((s) => s.category === cat)
      return acc
    },
    {} as Record<string, typeof hardSkills>,
  )

  return (
    <section id="about" className="container py-16">
      <TitleSection text={sectionTitle || 'about_me'} />
      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16">
        {profileImage && typeof profileImage !== 'string' && (
          <div className="flex-shrink-0 w-full max-w-[250px] lg:max-w-[300px]">
            <Media resource={profileImage} imgClassName="rounded-2xl" />
          </div>
        )}
        <div className="flex-1">
          {bio && <RichText data={bio} enableGutter={false} />}
        </div>
      </div>

      {hardSkills.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Hard Skills</h3>
          <div className="flex flex-col gap-4">
            {categories.map((cat) =>
              groupedSkills[cat]?.length > 0 ? (
                <Bullets key={cat} title={cat}>
                  {groupedSkills[cat].map((skill) => (
                    <Tag key={skill.id} text={skill.name} variant="gray" />
                  ))}
                </Bullets>
              ) : null,
            )}
          </div>
        </div>
      )}

      {softSkills.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-6">Soft Skills</h3>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill) => (
              <Tag key={skill.id} text={skill.name} variant="blue" />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

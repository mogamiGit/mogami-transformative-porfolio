import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/organisms/RichText'

import type { Post } from '@/payload-types'

import { PostCard } from '@/components/molecules/PostCard'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { ScrollReveal } from '@/components/atoms/ScrollReveal/ScrollReveal.client'
import {
  StaggerReveal,
  StaggerRevealItem,
} from '@/components/atoms/ScrollReveal/StaggerReveal.client'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && (
        <ScrollReveal from="up" distance={16}>
          <RichText data={introContent} enableGutter={false} />
        </ScrollReveal>
      )}

      <StaggerReveal
        as="div"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch"
        stagger={0.1}
      >
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <StaggerRevealItem key={index}>
              <PostCard doc={doc} relationTo="posts" showCategories />
            </StaggerRevealItem>
          )
        })}
      </StaggerReveal>
    </div>
  )
}

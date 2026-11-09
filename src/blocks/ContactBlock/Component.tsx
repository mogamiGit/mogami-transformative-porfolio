import React from 'react'

import type { ContactBlockType } from '@/payload-types'

import { AnimatedSectionHeader } from '@/components/molecules/AnimatedSectionHeader'
import {
  StaggerReveal,
  StaggerRevealItem,
} from '@/components/atoms/ScrollReveal/StaggerReveal.client'

const linkClassName =
  'type-title text-interactive no-underline break-all underline-offset-8 decoration-1 hover:underline'

export const ContactBlockComponent: React.FC<ContactBlockType> = ({
  sectionTitle,
  email,
  linkedinLabel,
  linkedinUrl,
}) => {
  return (
    <section id="contact" className="container py-16">
      <AnimatedSectionHeader title={sectionTitle} />
      <StaggerReveal className="flex flex-col gap-6" stagger={0.12} from="left" distance={20}>
        {email && (
          <StaggerRevealItem>
            <a href={`mailto:${email}`} className={linkClassName}>
              {email}
            </a>
          </StaggerRevealItem>
        )}
        {linkedinUrl && (
          <StaggerRevealItem>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono text-interactive no-underline underline-offset-4 hover:underline"
            >
              {linkedinLabel || linkedinUrl} ↗
            </a>
          </StaggerRevealItem>
        )}
      </StaggerReveal>
    </section>
  )
}

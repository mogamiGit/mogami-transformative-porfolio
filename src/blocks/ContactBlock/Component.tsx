import React from 'react'

import type { ContactBlockType } from '@/payload-types'

import { SectionHeader } from '@/components/molecules/SectionHeader'

const linkClassName =
  'type-title text-foreground no-underline break-all transition-colors duration-200 hover:text-accent-foreground'

export const ContactBlockComponent: React.FC<ContactBlockType> = ({
  sectionTitle,
  email,
  linkedinLabel,
  linkedinUrl,
}) => {
  return (
    <section id="contact" className="container py-16">
      <SectionHeader title={sectionTitle} />
      <div className="flex flex-col gap-6">
        {email && (
          <a href={`mailto:${email}`} className={linkClassName}>
            {email}
          </a>
        )}
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-mono text-primary no-underline transition-colors duration-200 hover:text-accent-foreground"
          >
            {linkedinLabel || linkedinUrl} ↗
          </a>
        )}
      </div>
    </section>
  )
}

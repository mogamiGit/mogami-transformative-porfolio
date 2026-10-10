import React from 'react'

import type { ContactBlockType } from '@/payload-types'

import { SectionHeader } from '@/components/molecules/SectionHeader'

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
            className="type-mono text-interactive no-underline underline-offset-4 hover:underline"
          >
            {linkedinLabel || linkedinUrl} ↗
          </a>
        )}
      </div>
    </section>
  )
}

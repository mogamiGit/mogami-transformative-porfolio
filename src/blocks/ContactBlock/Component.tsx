import React from 'react'

import type { ContactBlockType } from '@/payload-types'

export const ContactBlockComponent: React.FC<ContactBlockType> = ({
  sectionTitle,
  email,
  linkedinLabel,
  linkedinUrl,
}) => {
  return (
    <section className="container py-16">
      {sectionTitle && <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>}
      <div className="flex flex-col gap-4">
        {email && (
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        )}
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {linkedinLabel || linkedinUrl}
          </a>
        )}
      </div>
    </section>
  )
}

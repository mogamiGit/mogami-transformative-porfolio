import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import { SectionDescription } from '@/components/molecules/SectionDescription'

interface InfoDetailProps {
  year: string
  client: string
  description?: DefaultTypedEditorState | null
  tags: string[]
  externalUrl: string
}

export const InfoDetail: React.FC<InfoDetailProps> = ({
  year,
  client,
  description,
  tags,
  externalUrl,
}) => {
  return (
    <section className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SectionDescription title="Year" description={year} />
          <SectionDescription title="Client" description={client} />
          {description && (
            <div>
              <p className="font-kalnia text-sm text-muted-foreground capitalize mb-1">
                Description
              </p>
              <RichText data={description} enableGutter={false} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <SectionDescription title="Technologies" tags={tags} />
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-medium-blue text-white rounded-lg hover:opacity-90 transition-opacity self-start"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

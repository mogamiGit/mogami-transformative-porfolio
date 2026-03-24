'use client'

import React, { useState } from 'react'
import type { Project } from '@/payload-types'
import { Tag } from '@/components/atoms/Tag'
import { Check } from '@/components/atoms/Check'
import { Media } from '@/components/Media'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    title,
    subtitle,
    techStack,
    buttons,
    mobileImage,
    desktopImage,
    hasDetailPage,
    slug,
  } = project

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div>
          <h3 className="text-xl font-semibold group-hover:text-blue-violet transition-colors">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <span
          className={`text-2xl text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          &#8964;
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 flex flex-col lg:flex-row gap-6">
            {(desktopImage || mobileImage) && (
              <div className="flex-shrink-0 w-full lg:w-1/3">
                <picture>
                  {desktopImage && typeof desktopImage === 'object' && 'url' in desktopImage && (
                    <source media="(min-width: 768px)" srcSet={desktopImage.url || ''} />
                  )}
                  {mobileImage && typeof mobileImage !== 'string' && (
                    <Media
                      resource={mobileImage}
                      imgClassName="rounded-lg w-full object-cover"
                    />
                  )}
                  {!mobileImage && desktopImage && typeof desktopImage !== 'string' && (
                    <Media
                      resource={desktopImage}
                      imgClassName="rounded-lg w-full object-cover"
                    />
                  )}
                </picture>
              </div>
            )}
            <div className="flex-1 flex flex-col gap-4">
              {techStack && techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <Check key={i} text={tech.name} />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {buttons?.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.link}
                    target={btn.link.startsWith('http') ? '_blank' : undefined}
                    rel={btn.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-medium-blue text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    {btn.text}
                  </Link>
                ))}
                {hasDetailPage && slug && (
                  <Link
                    href={`/projects/${slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-violet text-blue-violet rounded-lg text-sm hover:bg-blue-violet hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

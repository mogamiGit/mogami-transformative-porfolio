'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/molecules/Link'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

import { useActiveSection } from './useActiveSection'

type NavLink = NonNullable<HeaderType['navItems']>[number]['link']

/* Section id targeted by an in-page link such as `/#projects`, if any */
const getSectionId = (link: NavLink): string | null => {
  if (link.type !== 'custom' || !link.url) return null
  const [path, hash] = link.url.split('#')
  return hash && (path === '' || path === '/') ? hash : null
}

const letterClasses =
  'block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

/* Label whose letters roll upwards one after another when the parent `group` is hovered */
const RollingLabel: React.FC<{ text: string }> = ({ text }) => {
  const letters = Array.from(text).map((letter) => (letter === ' ' ? ' ' : letter))

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative block overflow-hidden">
        <span className="flex">
          {letters.map((letter, i) => (
            <span
              key={i}
              className={cn(letterClasses, 'group-hover:-translate-y-full')}
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 flex">
          {letters.map((letter, i) => (
            <span
              key={i}
              className={cn(letterClasses, 'translate-y-full group-hover:translate-y-0')}
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  const sectionIds = navItems.map(({ link }) => getSectionId(link))
  const activeSection = useActiveSection(
    pathname === '/' ? sectionIds.filter((id): id is string => id !== null) : [],
  )

  return (
    <nav className="flex min-w-0 items-center gap-1 overflow-x-auto scrollbar-hide">
      {navItems.map(({ link }, i) => {
        const isActive = sectionIds[i] !== null && sectionIds[i] === activeSection

        return (
          <span key={i} className="group relative shrink-0">
            {isActive ? (
              <motion.span
                layoutId="header-nav-active"
                className="absolute inset-0 rounded-full bg-interactive"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            ) : (
              <span className="absolute inset-0 rounded-full bg-interactive/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            )}
            <CMSLink
              {...link}
              label={null}
              appearance="link"
              className={cn(
                'relative h-auto px-3 py-2 text-xs transition-colors duration-300 hover:no-underline sm:px-4 sm:text-sm',
                isActive ? 'text-primary-foreground' : 'text-interactive hover:text-interactive',
              )}
            >
              <RollingLabel text={link.label ?? ''} />
            </CMSLink>
          </span>
        )
      })}
    </nav>
  )
}

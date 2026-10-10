'use client'

import { useEffect, useState } from 'react'

/* Distance in px from the end of the page that still counts as "scrolled to the bottom" */
const BOTTOM_TOLERANCE = 8

/**
 * Scroll-spy: returns the id of the last section whose top has scrolled past the middle of the
 * viewport, or null above the first one (or when none of the given ids is in the document).
 */
export const useActiveSection = (ids: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0

      // A short final section can never reach the middle of the viewport, so once the page is
      // scrolled to its end any section that has entered the viewport counts as passed
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_TOLERANCE
      const line = atBottom ? window.innerHeight : window.innerHeight / 2

      // The last section past the trigger line stays active through the gaps between sections,
      // so the marker travels straight from one link to the next
      const passed = sections
        .map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }))
        .filter(({ top }) => top <= line)
        .sort((a, b) => a.top - b.top)

      setActiveId(passed.at(-1)?.id ?? null)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [key])

  // A stale id from a previous page or nav configuration never counts as active
  return activeId !== null && ids.includes(activeId) ? activeId : null
}

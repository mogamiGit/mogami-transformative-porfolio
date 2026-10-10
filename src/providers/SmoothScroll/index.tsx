'use client'

import { useEffect } from 'react'

/** How quickly the page catches up with the wheel; higher is snappier. */
const STIFFNESS = 9
const LINE_HEIGHT = 16

/* An element under the pointer that scrolls by itself (modal body, code block…) keeps native scrolling */
const hasScrollableAncestor = (target: EventTarget | null): boolean => {
  let el = target instanceof Element ? target : null

  while (el && el !== document.body && el !== document.documentElement) {
    if (el.scrollHeight > el.clientHeight + 1) {
      const { overflowY } = getComputedStyle(el)
      if (overflowY === 'auto' || overflowY === 'scroll') return true
    }
    el = el.parentElement
  }

  return false
}

/**
 * Gives mouse-wheel scrolling inertia by easing the page towards the wheel's target position.
 * Touch, keyboard, scrollbar and anchor scrolling stay native.
 */
export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let target = 0
    let current = 0
    let last = 0
    let frame = 0

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const tick = (now: number) => {
      // Something else moved the page (anchor link, keyboard, scrollbar): hand control back
      if (Math.abs(window.scrollY - current) > 2) {
        frame = 0
        return
      }

      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      target = Math.min(target, maxScroll())
      current += (target - current) * (1 - Math.exp(-dt * STIFFNESS))
      if (Math.abs(target - current) < 0.5) current = target

      window.scrollTo({ top: current, behavior: 'instant' })
      frame = current === target ? 0 : requestAnimationFrame(tick)
    }

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) return
      if (!finePointer.matches || reducedMotion.matches) return
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      // Scroll is locked, e.g. while the project modal is open
      if (getComputedStyle(document.body).overflowY === 'hidden') return
      if (hasScrollableAncestor(event.target)) return

      event.preventDefault()

      if (!frame) {
        target = current = window.scrollY
        last = performance.now()
      }

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? LINE_HEIGHT
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1
      target = Math.max(0, Math.min(target + event.deltaY * unit, maxScroll()))

      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(frame)
    }
  }, [])

  return null
}

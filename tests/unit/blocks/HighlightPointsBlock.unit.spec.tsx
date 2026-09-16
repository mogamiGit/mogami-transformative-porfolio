import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { HighlightPointsBlockComponent } from '@/blocks/HighlightPointsBlock/Component'
import type { HighlightPointsBlockType } from '@/payload-types'

type Point = HighlightPointsBlockType['points'][number]

const pointsOf = (count: number): Point[] =>
  Array.from({ length: count }, (_, i) => ({
    title: `+${i + 1}`,
    subtitle: `Metric ${i + 1}`,
    id: `point-${i + 1}`,
  }))

const renderBlock = (props: Partial<HighlightPointsBlockType>) =>
  render(
    <HighlightPointsBlockComponent
      blockType="highlightPointsBlock"
      points={pointsOf(3)}
      {...props}
    />,
  )

describe('HighlightPointsBlockComponent heading', () => {
  it('renders both label and title when both are authored', () => {
    renderBlock({ label: 'type: metrics', title: 'highlights.log' })

    expect(screen.getByText('type: metrics')).toBeDefined()
    expect(screen.getByText('highlights.log')).toBeDefined()
  })

  // FR-014: no heading element and no empty wrapper when neither is authored.
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty string', ''],
  ])('renders no heading area when both are %s', (_name, value) => {
    const { container } = renderBlock({ label: value, title: value })

    const section = container.querySelector('section')!
    expect(section.children).toHaveLength(1)
    expect(section.querySelector('dl')).not.toBeNull()
  })

  it('renders label alone with no empty title slot', () => {
    const { container } = renderBlock({ label: 'type: metrics', title: null })

    const header = container.querySelector('section > div')!
    expect(header.children).toHaveLength(1)
    expect(header.textContent).toBe('type: metrics')
  })

  it('renders title alone with no empty label slot', () => {
    const { container } = renderBlock({ label: null, title: 'highlights.log' })

    const header = container.querySelector('section > div')!
    expect(header.children).toHaveLength(1)
    expect(header.textContent).toBe('highlights.log')
  })
})

describe('HighlightPointsBlockComponent layout', () => {
  // Research R6. Complete literal class strings — Tailwind v4 scans source text.
  it.each([
    [1, 'grid-cols-1 max-w-xs'],
    [2, 'grid-cols-2'],
    [3, 'grid-cols-2 md:grid-cols-3'],
    [4, 'grid-cols-2 md:grid-cols-4'],
    [5, 'grid-cols-2 md:grid-cols-3'],
    [6, 'grid-cols-2 md:grid-cols-3'],
  ])('applies the R6 column classes for %i points', (count, expected) => {
    const { container } = renderBlock({ points: pointsOf(count) })

    const classes = container.querySelector('dl')!.className.split(/\s+/)
    for (const cls of expected.split(' ')) {
      expect(classes).toContain(cls)
    }
  })

  it('renders one card per point', () => {
    const { container } = renderBlock({ points: pointsOf(5) })

    expect(container.querySelectorAll('dt')).toHaveLength(5)
    expect(container.querySelectorAll('dd')).toHaveLength(5)
  })

  // FR-006: not an empty <section>, not a bordered shell.
  it.each([
    ['empty array', [] as Point[]],
    ['undefined', undefined],
    ['null', null],
  ])('renders nothing when points is %s', (_name, value) => {
    const { container } = renderBlock({
      points: value as HighlightPointsBlockType['points'],
      label: 'type: metrics',
      title: 'highlights.log',
    })

    expect(container.innerHTML).toBe('')
  })
})

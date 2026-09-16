import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { HighlightCard } from '@/components/molecules/HighlightCard'

const renderCard = () => {
  const { container } = render(
    <dl>
      <HighlightCard figure="+5" label="Years of experience" />
    </dl>,
  )
  return container
}

describe('HighlightCard', () => {
  it('renders exactly one dt and one dd', () => {
    const container = renderCard()

    expect(container.querySelectorAll('dt')).toHaveLength(1)
    expect(container.querySelectorAll('dd')).toHaveLength(1)
    expect(screen.getByText('Years of experience').tagName).toBe('DT')
    expect(screen.getByText('+5').tagName).toBe('DD')
  })

  // FR-007, contract G4: the pair must be announced in reading order, so the label
  // comes first in the DOM even though the figure appears first visually.
  it('places dt before dd in the DOM', () => {
    const container = renderCard()

    const dt = container.querySelector('dt')!
    const dd = container.querySelector('dd')!

    expect(dt.compareDocumentPosition(dd) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  // FR-002, contract G6: the figure carries the accent, the label is held back.
  it('accents the figure and not the label', () => {
    renderCard()

    expect(screen.getByText('+5').className).toContain('text-primary')
    expect(screen.getByText('Years of experience').className).not.toContain('text-primary')
  })

  /**
   * Research R7: `Card` hardcodes `flex flex-col` and `flex-col-reverse` arrives via
   * `className`, winning only because `Card` composes through `cn()`. If that stops
   * being true the section still renders — just with the label above the figure —
   * so nothing else in the suite would catch it.
   */
  it('resolves the card to flex-col-reverse, not flex-col', () => {
    const container = renderCard()

    const card = container.querySelector('dt')!.parentElement!

    expect(card.className).toContain('flex-col-reverse')
    expect(card.className.split(/\s+/)).not.toContain('flex-col')
  })
})

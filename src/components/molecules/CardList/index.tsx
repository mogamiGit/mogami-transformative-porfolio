import React from 'react'
import { Card, CardLabel, CardTitle, type CardProps } from '@/components/atoms/Card'
import { cn } from '@/utilities/ui'

export type CardListItem = {
  id: string | number
  prefix?: string
  text: string
}

export type CardListProps = {
  label?: string
  title: string
  items: CardListItem[]
  variant?: CardProps['variant']
  className?: string
}

export const CardList: React.FC<CardListProps> = ({ label, title, items, variant, className }) => {
  return (
    <Card variant={variant} className={className}>
      {label && <CardLabel>{label}</CardLabel>}
      <CardTitle>{title}</CardTitle>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <span key={item.id} className={cn('text-card-foreground text-[10px]')}>
            {item.prefix && `[${item.prefix}] `}
            {item.text}
          </span>
        ))}
      </div>
    </Card>
  )
}

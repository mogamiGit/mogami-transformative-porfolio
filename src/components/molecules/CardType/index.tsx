import React from 'react'
import { Card, CardLabel, CardTitle, type CardProps } from '@/components/atoms/Card'
import { cn } from '@/utilities/ui'

export type CardTypeProps = {
  label?: string
  title: string
  status?: string
  statusColor?: string
  description?: string
  variant?: CardProps['variant']
  className?: string
}

export const CardType: React.FC<CardTypeProps> = ({
  label,
  title,
  status,
  statusColor = 'bg-primary',
  description,
  variant,
  className,
}) => {
  return (
    <Card variant={variant} className={className}>
      {label && <CardLabel>{label}</CardLabel>}
      <CardTitle>{title}</CardTitle>
      {status && (
        <div className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full', statusColor)} />
          <span className="text-primary text-[10px] italic">{status}</span>
        </div>
      )}
      {description && (
        <span className="text-card-foreground text-[10px] flex-1">{description}</span>
      )}
    </Card>
  )
}

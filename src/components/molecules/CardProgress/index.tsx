import React from 'react'
import { Card, CardLabel, type CardProps } from '@/components/atoms/Card'

export type CardProgressProps = {
  label?: string
  value: string
  progress: number
  variant?: CardProps['variant']
  className?: string
}

export const CardProgress: React.FC<CardProgressProps> = ({
  label,
  value,
  progress,
  variant,
  className,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <Card variant={variant} className={className}>
      {label && <CardLabel>{label}</CardLabel>}
      <span className="text-card-foreground font-sans text-[32px] font-bold leading-none">
        {value}
      </span>
      <div className="h-2 w-full rounded-full bg-card">
        <div
          className="h-full rounded-full bg-accent-foreground"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </Card>
  )
}

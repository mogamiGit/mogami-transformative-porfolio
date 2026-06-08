import React from 'react'
import { Card, CardLabel, type CardProps } from '@/components/atoms/Card'

export type CardNumberProps = {
  label?: string
  value: string
  meta?: string
  variant?: CardProps['variant']
  className?: string
}

export const CardNumber: React.FC<CardNumberProps> = ({
  label,
  value,
  meta,
  variant,
  className,
}) => {
  return (
    <Card variant={variant} className={className}>
      {label && <CardLabel>{label}</CardLabel>}
      <span className="text-card-foreground font-sans text-[40px] font-bold leading-none">
        {value}
      </span>
      {meta && <span className="text-accent-foreground text-[11px]">{meta}</span>}
    </Card>
  )
}

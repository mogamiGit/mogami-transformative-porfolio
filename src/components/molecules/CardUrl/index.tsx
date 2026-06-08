import React from 'react'
import { Card, CardTitle, type CardProps } from '@/components/atoms/Card'
import { type LucideIcon } from 'lucide-react'

export type CardUrlProps = {
  icon: LucideIcon
  title: string
  href?: string
  iconColor?: string
  variant?: CardProps['variant']
  className?: string
}

export const CardUrl: React.FC<CardUrlProps> = ({
  icon: Icon,
  title,
  href,
  iconColor = 'text-primary',
  variant = 'highlight',
  className,
}) => {
  const content = (
    <Card variant={variant} className={className}>
      <Icon className={`size-5 ${iconColor}`} />
      <CardTitle>{title}</CardTitle>
    </Card>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

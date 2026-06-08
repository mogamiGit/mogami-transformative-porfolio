import React from 'react'
import { cn } from '@/utilities/ui'
import { type VariantProps, cva } from 'class-variance-authority'

const cardVariants = cva('rounded-[var(--radius)] p-5 flex flex-col gap-3 font-mono border', {
  variants: {
    variant: {
      default: 'bg-card border-border',
      primary: 'bg-primary border-transparent',
      highlight: 'bg-card border-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>

export const Card: React.FC<CardProps> = ({ variant, className, children, ...props }) => {
  return (
    <div className={cn(cardVariants({ variant, className }))} {...props}>
      {children}
    </div>
  )
}

export const CardLabel: React.FC<React.ComponentProps<'span'>> = ({ className, ...props }) => (
  <span className={cn('text-accent-foreground text-[9px]', className)} {...props} />
)

export const CardTitle: React.FC<React.ComponentProps<'span'>> = ({ className, ...props }) => (
  <span className={cn('text-card-foreground text-xs font-bold', className)} {...props} />
)

export { cardVariants }

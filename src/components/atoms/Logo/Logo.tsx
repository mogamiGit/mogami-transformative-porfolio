import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Mogami logo"
      width={57}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      // The SVG is drawn in white, so it is inverted on the light theme
      className={clsx('w-auto h-[34px] invert dark:invert-0', className)}
      src="/logo.svg"
    />
  )
}

import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'pink' | 'green' | 'neutral'
  children: React.ReactNode
}

export function Badge({ className = '', variant = 'neutral', children, ...props }: BadgeProps) {
  // map variants to the styles.css classes
  const variantClass = variant !== 'neutral' ? `badge-${variant}` : ''
  const neutralStyles = variant === 'neutral' 
    ? 'bg-surface-3 text-text-secondary border-border-strong' 
    : ''

  return (
    <span
      className={`badge ${variantClass} ${neutralStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

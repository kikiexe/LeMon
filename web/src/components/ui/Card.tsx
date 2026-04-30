import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'glass'
  children: React.ReactNode
}

export function Card({ className = '', variant = 'surface', children, ...props }: CardProps) {
  const baseClass = variant === 'glass' ? 'glass-card' : 'card'
  
  return (
    <div
      className={`${baseClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

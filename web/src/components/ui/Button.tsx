import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const sizeStyles = {
      sm: 'py-2 px-4 text-xs',
      md: 'py-2.5 px-5 text-[13px]',
      lg: 'py-3.5 px-8 text-sm',
    }

    return (
      <button
        ref={ref}
        className={`btn btn-${variant} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

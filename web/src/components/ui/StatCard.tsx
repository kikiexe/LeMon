import React from 'react'

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  label: string
  value: string | number
  unit?: string
  trend?: string
  color?: string
}

export function StatCard({ icon, label, value, unit, trend, color = 'var(--cyan)', className = '', ...props }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`} {...props}>
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-8 h-8 flex items-center justify-center rounded bg-surface-3"
          style={{ color }}
        >
          {icon}
        </div>
        <div className="stat-card-label mb-0">{label}</div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <div className="stat-card-value">{value}</div>
        {unit && <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{unit}</span>}
      </div>
      
      {trend && (
        <div className="stat-card-sub mt-3 pt-3 border-t border-border" style={{ color: 'var(--text-muted)' }}>
          {trend}
        </div>
      )}
    </div>
  )
}

'use client'

import clsx from 'clsx'

interface GlowCardProps {
  children:   React.ReactNode
  className?: string
  glowColor?: 'teal' | 'orange' | 'blue' | 'accent' | 'secondary'
  variant?:   'default' | 'orange'
  hover?:     boolean
  padding?:   boolean
}

const glowMap = {
  teal:      'hover:shadow-[0_0_30px_rgba(0,128,128,0.2)] hover:border-[--theme-secondary]/30',
  orange:    'hover:shadow-[0_0_30px_rgba(255,70,0,0.25)]  hover:border-[--theme-accent]/30',
  blue:      'hover:shadow-[0_0_30px_rgba(0,85,255,0.2)]   hover:border-blue-500/30',
  accent:    'hover:shadow-[0_0_30px_var(--theme-accent)]   hover:border-[--theme-accent]/30',
  secondary: 'hover:shadow-[0_0_30px_var(--theme-secondary)] hover:border-[--theme-secondary]/30',
}

const variantMap = {
  default: 'bg-[#0A0A0A] border border-[#262626]',
  orange:  'bg-[#0A0A0A] border border-[--theme-accent]/30',
}

export function GlowCard({
  children,
  className,
  glowColor = 'teal',
  variant   = 'default',
  hover     = true,
  padding   = true,
}: GlowCardProps) {
  return (
    <div
      className={clsx(
        variantMap[variant],
        'transition-all duration-300',
        hover && glowMap[glowColor],
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  )
}

export default GlowCard

'use client'

import { useRef } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant
  size?:      Size
  href?:      string
  external?:  boolean
  isLoading?: boolean
  children:   React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[var(--theme-accent)] text-black hover:shadow-[0_0_30px_var(--theme-accent)] hover:brightness-110',
  secondary: 'border border-[var(--theme-secondary)] text-[var(--theme-secondary)] hover:shadow-[0_0_20px_var(--theme-secondary)]',
  ghost:     'border border-white/20 text-white/70 hover:border-white/60 hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2 text-sm tracking-[0.15em]',
  md: 'px-8 py-3 text-base tracking-[0.2em]',
  lg: 'px-12 py-4 text-lg tracking-[0.25em]',
}

export function CTAButton({
  variant   = 'primary',
  size      = 'md',
  href,
  external  = false,
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: CTAButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const classes = clsx(
    'font-authority inline-flex items-center justify-center gap-2',
    'transition-all duration-300 cursor-pointer select-none',
    variantClasses[variant],
    sizeClasses[size],
    (isLoading || disabled) && 'opacity-60 cursor-not-allowed',
    className
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
      >
        {isLoading ? <span className="animate-pulse">…</span> : children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <span className="animate-pulse">…</span> : children}
    </button>
  )
}

export default CTAButton

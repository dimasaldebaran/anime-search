import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type FavoriteButtonProps = {
  active: boolean
  label?: string
  children?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'>

export function FavoriteButton({ active, label, className = '', children, ...props }: FavoriteButtonProps) {
  const ariaLabel = label || (active ? 'Remove from favorites' : 'Add to favorites')
  const classes = ['favorite-toggle', active ? 'is-active' : '', className].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={classes}
      aria-label={ariaLabel}
      aria-pressed={active}
      {...props}
    >
      {children ?? <span aria-hidden="true">★</span>}
    </button>
  )
}

export default FavoriteButton
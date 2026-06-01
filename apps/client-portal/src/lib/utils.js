import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const fmt = (n) =>
  n == null ? '-' : '\$' + Math.round(n).toLocaleString('en-AU')

export const fmtDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const initials = (first, last) =>
  ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()

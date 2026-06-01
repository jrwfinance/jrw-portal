import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...i) => twMerge(clsx(i))
export const fmt = (n) => n == null ? '-' : '\$' + Math.round(n).toLocaleString('en-AU')
export const fmtDate = (d) => { if (!d) return '-'; return new Date(d).toLocaleDateString('en-AU',{day:'2-digit',month:'short',year:'numeric'}) }
export const initials = (first, last) => ((first?.[0]||'')+(last?.[0]||'')).toUpperCase()
export const parseCurrency = (s) => parseFloat(String(s).replace(/[^\d.]/g,'')) || 0

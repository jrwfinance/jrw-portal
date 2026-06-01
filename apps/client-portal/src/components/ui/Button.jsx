import { cn } from '@/lib/utils'

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-lime/40 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary'   && 'bg-brand-lime text-brand-dark hover:bg-brand-lime-dim active:scale-[0.98]',
        variant === 'secondary' && 'bg-transparent border border-white/20 text-brand-muted hover:bg-white/10 hover:text-brand-lime',
        variant === 'ghost'     && 'bg-transparent text-brand-muted hover:bg-white/10 hover:text-brand-lime',
        variant === 'danger'    && 'bg-red-600 text-white hover:bg-red-700',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2.5',
        size === 'lg' && 'text-base px-6 py-3',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

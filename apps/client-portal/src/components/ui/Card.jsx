import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('bg-white border border-gray-200/80 rounded-xl p-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-3', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-[10px] font-semibold uppercase tracking-widest text-gray-400', className)}>{children}</h3>
}

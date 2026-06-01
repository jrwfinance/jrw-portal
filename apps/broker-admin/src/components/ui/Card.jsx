import { cn } from '@/lib/utils'
export function Card({ className, children, ...props }) {
  return <div className={cn('bg-white border border-gray-200/80 rounded-xl p-4', className)} {...props}>{children}</div>
}

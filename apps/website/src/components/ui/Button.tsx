import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  arrow?: boolean
  href?: string
  external?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-lime text-brand-deepest font-bold hover:bg-brand-lime-dim active:scale-[0.97]',
  secondary:
    'border border-brand-lime text-brand-lime font-semibold hover:bg-brand-lime hover:text-brand-deepest',
  ghost:
    'border border-white/20 text-white/80 font-medium hover:bg-white/5 hover:border-white/40',
  dark:
    'bg-brand-deepest text-brand-lime font-bold border border-brand-deepest hover:bg-brand-darker',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-[13px] gap-1.5',
  md: 'px-7 py-3.5 text-[14px] gap-2',
  lg: 'px-9 py-4 text-[15px] gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  href,
  external,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={size === 'sm' ? 13 : 15} />}
    </>
  )

  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}

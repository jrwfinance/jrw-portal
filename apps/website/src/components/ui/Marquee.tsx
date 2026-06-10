import { cn } from '@/lib/utils'

const LENDERS = [
  'Commonwealth Bank',
  'ANZ',
  'Westpac',
  'NAB',
  'Macquarie',
  'ING',
  'Suncorp',
  'Bank of Queensland',
  'Bendigo Bank',
  'AMP Bank',
  'ME Bank',
  'Pepper Money',
  'La Trobe Financial',
  'RAMS',
  'Bankwest',
  'Newcastle Permanent',
  'Heritage Bank',
  'Teachers Mutual',
  'Greater Bank',
  'P&N Bank',
]

interface MarqueeProps {
  className?: string
}

export function Marquee({ className }: MarqueeProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 50s linear infinite' }}
      >
        {/* Two copies for seamless loop */}
        {[...LENDERS, ...LENDERS].map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/25"
          >
            {name}
            <span className="inline-block w-1 h-1 rounded-full bg-brand-lime/30 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

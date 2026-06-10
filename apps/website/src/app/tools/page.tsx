import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calculator, Home, RefreshCw, TrendingUp } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { PageCTA } from '@/components/sections/PageCTA'

export const metadata: Metadata = {
  title: 'Tools & Calculators',
  description: 'Free mortgage and property calculators — stamp duty, deposit, refinance savings, and rent vs buy. Built for Australian property buyers and investors.',
}

const tools = [
  {
    href: '/tools/stamp-duty',
    icon: Home,
    title: 'Stamp Duty Calculator',
    desc: 'Calculate stamp duty costs for any Australian state, including first home buyer concessions.',
    tag: 'Buyers',
  },
  {
    href: '/tools/deposit',
    icon: Calculator,
    title: 'Deposit & LMI Calculator',
    desc: 'See how much deposit you need and what Lenders Mortgage Insurance will cost at different LVRs.',
    tag: 'Buyers',
  },
  {
    href: '/tools/refinance',
    icon: RefreshCw,
    title: 'Refinance Savings Calculator',
    desc: 'Model your potential saving and break-even timeline when switching lenders.',
    tag: 'Refinancing',
  },
  {
    href: '/tools/rent-vs-buy',
    icon: TrendingUp,
    title: 'Rent vs Buy Calculator',
    desc: 'Compare the real cost of renting against buying over different time horizons.',
    tag: 'Strategy',
  },
]

export default function ToolsPage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 100% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-16">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              Calculators
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-5 balance max-w-3xl"
              style={{ fontSize: 'clamp(36px,5.5vw,76px)' }}
            >
              Run the numbers before you commit.
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] max-w-lg pretty"
              style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}
            >
              Free calculators for Australian property buyers, investors, and refinancers. Indicative results — book a call for the exact figures on your situation.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── TOOL GRID ─────────────────────────────────────────────────── */}
      <section className="py-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {tools.map(({ href, icon: Icon, title, desc, tag }, i) => (
              <AnimateIn key={href} delay={i * 0.06}>
                <Link
                  href={href}
                  className="group flex flex-col gap-6 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all h-full"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl border border-white/[0.08] flex items-center justify-center bg-white/[0.03] group-hover:border-brand-lime/20 group-hover:bg-brand-lime/5 transition-all">
                      <Icon size={18} className="text-white/40 group-hover:text-brand-lime/70 transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-white/20 group-hover:text-brand-lime/50 transition-colors">
                      {tag}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h2 className="font-display font-bold text-white text-[19px] leading-snug group-hover:text-brand-lime/90 transition-colors">
                      {title}
                    </h2>
                    <p className="text-[13px] font-light text-white/40 leading-relaxed">{desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-white/25 group-hover:text-brand-lime transition-colors">
                    Open calculator <ArrowRight size={12} />
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        heading="Numbers not enough?"
        sub="Our calculators give you a ballpark. A 20-minute call gives you the actual figures for your situation."
      />
    </div>
  )
}

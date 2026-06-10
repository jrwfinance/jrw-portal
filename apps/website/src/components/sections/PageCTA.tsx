import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { BOOK_URL } from '@/lib/constants'

interface PageCTAProps {
  heading?: string
  sub?: string
}

export function PageCTA({
  heading = 'Ready to talk property?',
  sub = 'Book a free strategy call. No obligation, no pressure — just a straight conversation about your situation.',
}: PageCTAProps) {
  return (
    <section className="relative py-28 overflow-hidden bg-[#080e01]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(223,231,119,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none select-none pb-6"
      >
        <span
          className="font-display font-black text-white/[0.025] leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(60px,14vw,200px)', letterSpacing: '-0.04em' }}
        >
          JRW Finance
        </span>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <AnimateIn>
          <h2
            className="font-display font-black text-white leading-[0.95] tracking-tight mb-6 balance"
            style={{ fontSize: 'clamp(34px,4.5vw,64px)' }}
          >
            {heading}
          </h2>
          <p className="text-[16px] font-light text-white/50 mb-10 max-w-md mx-auto leading-relaxed pretty">
            {sub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-9 py-4 bg-brand-lime text-brand-deepest text-[15px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Book a free call <ArrowRight size={15} />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 border border-white/15 text-white/60 text-[15px] font-medium rounded-full hover:bg-white/5 hover:border-white/30 transition-all"
            >
              Send a message
            </Link>
          </div>
          <p className="text-[11px] font-light text-white/20 tracking-widest uppercase mt-8">
            No fees · No obligation · Honest advice
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}

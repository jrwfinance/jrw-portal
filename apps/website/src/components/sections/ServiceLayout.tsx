import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { Accordion } from '@/components/ui/Accordion'
import { PageCTA } from '@/components/sections/PageCTA'
import { BOOK_URL } from '@/lib/constants'

export interface ServicePageData {
  meta: { title: string; description: string }
  hero: {
    category: string
    headline: string
    sub: string
  }
  intro: {
    heading: string
    body: string[]
  }
  benefits: {
    heading: string
    items: { title: string; body: string }[]
  }
  process: {
    heading: string
    steps: { title: string; body: string }[]
  }
  faqs: { question: string; answer: string }[]
  cta?: { heading?: string; sub?: string }
}

export function generateServiceMetadata(data: ServicePageData): Metadata {
  return {
    title: data.meta.title,
    description: data.meta.description,
  }
}

export function ServiceLayout({ data }: { data: ServicePageData }) {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 60% 70% at 100% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
              'radial-gradient(ellipse 80% 50% at 0% 100%, rgba(14,19,2,0.9) 0%, transparent 60%)',
            ].join(', '),
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(223,231,119,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 80% 20%, black 20%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-20 pt-24">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              {data.hero.category}
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-6 balance max-w-4xl"
              style={{ fontSize: 'clamp(38px,6vw,84px)' }}
            >
              {data.hero.headline}
            </h1>
            <p className="text-white/50 font-light leading-[1.75] max-w-xl mb-8 pretty"
              style={{ fontSize: 'clamp(15px,1.4vw,18px)' }}>
              {data.hero.sub}
            </p>
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Book a free call <ArrowRight size={14} />
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <AnimateIn direction="left">
              <h2
                className="font-display font-black text-white leading-[1.0] tracking-tight balance"
                style={{ fontSize: 'clamp(26px,3vw,40px)' }}
              >
                {data.intro.heading}
              </h2>
            </AnimateIn>
            <AnimateIn direction="right" delay={0.1}>
              <div className="space-y-4 text-[15px] font-light text-white/55 leading-[1.8]">
                {data.intro.body.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-lime">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-12">
            <h2
              className="font-display font-black text-brand-deepest leading-[0.95] tracking-tight balance"
              style={{ fontSize: 'clamp(30px,3.8vw,52px)' }}
            >
              {data.benefits.heading}
            </h2>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.benefits.items.map(({ title, body }, i) => (
              <AnimateIn key={title} delay={i * 0.07}>
                <div className="bg-brand-dark/10 rounded-2xl p-7 h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 size={16} className="text-brand-dark/50 flex-shrink-0 mt-0.5" />
                    <h3 className="font-display font-bold text-brand-deepest text-[16px] leading-snug">{title}</h3>
                  </div>
                  <p className="text-[13px] font-light text-brand-dark/65 leading-relaxed">{body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0e1302]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-12">
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight balance"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {data.process.heading}
            </h2>
          </AnimateIn>
          <div className="grid gap-px bg-white/[0.04] rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {data.process.steps.map(({ title, body }, i) => (
              <AnimateIn key={title} delay={i * 0.07}>
                <div className="bg-[#0e1302] p-8 h-full flex flex-col gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-lime/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-brand-lime/60 font-mono">{i + 1}</span>
                  </div>
                  <div className="font-display font-bold text-white text-[17px] leading-tight">{title}</div>
                  <div className="text-[13px] font-light text-white/40 leading-relaxed flex-1">{body}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
            <AnimateIn>
              <h2
                className="font-display font-black text-white leading-[0.95] tracking-tight balance"
                style={{ fontSize: 'clamp(26px,3vw,40px)' }}
              >
                Common questions.
              </h2>
              <p className="text-[13px] font-light text-white/35 mt-3 leading-relaxed">
                Anything else on your mind?{' '}
                <Link href="/contact" className="text-brand-lime hover:underline">
                  Ask us directly.
                </Link>
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <Accordion items={data.faqs} />
            </AnimateIn>
          </div>
        </div>
      </section>

      <PageCTA heading={data.cta?.heading} sub={data.cta?.sub} />
    </div>
  )
}

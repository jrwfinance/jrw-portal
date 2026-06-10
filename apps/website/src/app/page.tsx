'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { Marquee } from '@/components/ui/Marquee'
import { BOOK_URL } from '@/lib/constants'

// ─── Data ──────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    label: 'Home Loans',
    description: 'Buying your first home or upgrading. We find the right loan for where you are now — and where you want to be.',
    href: '/home-loans',
  },
  {
    label: 'Investment Loans',
    description: 'Structured lending for portfolio growth. We understand the numbers because we run them ourselves.',
    href: '/investment-loans',
  },
  {
    label: 'First Home Buyers',
    description: 'The process is complicated. We make it simple — grants, schemes, and a broker who will explain everything.',
    href: '/first-home-buyers',
  },
  {
    label: 'Refinancing',
    description: 'A better rate or a smarter structure. We access 40+ lenders and find the option that actually fits.',
    href: '/refinancing',
  },
  {
    label: 'SMSF Loans',
    description: 'Investing through your super requires specialist advice. We have done this before — many times.',
    href: '/smsf-loans',
  },
]

const STEPS = [
  {
    title: 'Book a free call',
    body: 'Tell us your situation — buying, investing, or refinancing. No pressure, no agenda. Just a conversation.',
  },
  {
    title: 'We search 40+ lenders',
    body: 'We compare across our full lender panel and recommend what genuinely fits your goals — not what pays us most.',
  },
  {
    title: 'We handle everything',
    body: 'Paperwork, applications, lender communication. We manage the process end-to-end.',
  },
  {
    title: 'You get the keys',
    body: 'Settlement done. And we stay available post-settlement to review and ensure your loan keeps working for you.',
  },
]

// Placeholder articles — replace with Supabase CMS content
const ARTICLES = [
  {
    category: 'Market Update',
    date: '03 Jun 2025',
    title: 'What the RBA\'s rate decision means for your mortgage repayments',
    excerpt: 'The cash rate held at 4.35% for the sixth consecutive meeting. Here is what that means practically for variable-rate borrowers.',
    href: '/insights/rba-rate-decision-june-2025',
  },
  {
    category: 'Investment',
    date: '18 May 2025',
    title: 'How to use equity in your home to fund an investment property',
    excerpt: 'Cross-collateralisation, standalone equity loans, and why the structure matters as much as the rate.',
    href: '/insights/using-home-equity-investment-property',
  },
  {
    category: 'First Home Buyers',
    date: '02 May 2025',
    title: 'First Home Guarantee explained: who qualifies and what it actually covers',
    excerpt: 'The scheme lets eligible buyers purchase with a 5% deposit and no LMI. The details matter more than the headline.',
    href: '/insights/first-home-guarantee-explained',
  },
]

// ─── Fade variants ──────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-16">

        {/* Background: subtle radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(223,231,119,0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(46,49,5,0.8) 0%, transparent 70%)',
            ].join(', '),
          }}
        />

        {/* Dot grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(223,231,119,0.07) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 70% 30%, black 30%, transparent 80%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-24 lg:py-32">
          <div className="max-w-4xl">

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="font-display font-black leading-[0.95] tracking-[-0.03em] text-white mb-8 balance"
              style={{ fontSize: 'clamp(44px,7.5vw,104px)' }}
            >
              Property lending
              <br />
              for people who{' '}
              <br className="hidden sm:block" />
              <span className="text-brand-lime">take it seriously.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              {...fadeUp(0.25)}
              className="text-white/55 font-light leading-[1.7] mb-10 max-w-2xl pretty"
              style={{ fontSize: 'clamp(16px,1.6vw,19px)' }}
            >
              We partner with 40+ lenders — and invest in property ourselves.
              That means straight talk, smart strategy, and a team that genuinely
              understands what is at stake.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.38)} className="flex flex-wrap gap-3">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-lime text-brand-deepest text-[15px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
              >
                Book a free call <ArrowRight size={15} />
              </a>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/70 text-[15px] font-medium rounded-full hover:bg-white/5 hover:border-white/30 transition-all"
              >
                Our approach
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              {...fadeUp(0.5)}
              className="flex flex-wrap gap-6 mt-14 pt-10 border-t border-white/[0.06]"
            >
              {['40+ lenders', 'No broker fees', 'Sydney-based', 'Free strategy call'].map((item) => (
                <span key={item} className="text-[12px] font-semibold text-white/30 tracking-wide">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          {...fadeUp(0.9)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── LENDER MARQUEE ──────────────────────────────────────────── */}
      <section className="py-5 border-y border-white/[0.05] overflow-hidden bg-[#0a0f01]">
        <Marquee />
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <AnimateIn className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight balance"
              style={{ fontSize: 'clamp(36px,5vw,72px)' }}
            >
              What we do.
            </h2>
            <Link
              href="/our-story"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/30 hover:text-white/70 transition-colors shrink-0"
            >
              About us <ArrowUpRight size={13} />
            </Link>
          </AnimateIn>

          <div>
            {SERVICES.map(({ label, description, href }, i) => (
              <AnimateIn key={href} delay={i * 0.06}>
                <Link
                  href={href}
                  className="group flex items-center justify-between py-7 gap-8 border-t border-white/[0.06] last:border-b hover:bg-white/[0.02] px-2 -mx-2 transition-colors rounded-lg"
                >
                  <div className="flex items-baseline gap-6 min-w-0 flex-1">
                    <span className="text-[11px] font-mono text-white/15 flex-shrink-0 tabular-nums">
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="font-display font-bold text-white group-hover:text-brand-lime transition-colors leading-tight"
                        style={{ fontSize: 'clamp(18px,2.2vw,26px)' }}
                      >
                        {label}
                      </div>
                      <div className="text-[13px] font-light text-white/35 leading-relaxed mt-1.5 max-w-xl hidden sm:block">
                        {description}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-white/15 group-hover:text-brand-lime transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                  />
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTOR CREDIBILITY — lime section ─────────────────────── */}
      <section className="bg-brand-lime py-24 sm:py-32 overflow-hidden relative">
        {/* Subtle noise */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimateIn direction="left">
              <h2
                className="font-display font-black text-brand-deepest leading-[0.95] tracking-tight mb-8 balance"
                style={{ fontSize: 'clamp(36px,5.5vw,78px)' }}
              >
                We invest in property too.
              </h2>
              <div className="space-y-4 text-[16px] font-light text-brand-dark/70 leading-[1.75] max-w-lg">
                <p>
                  We know what it feels like to sit across from a broker who does not
                  understand your strategy. We have navigated the same lender conversations,
                  the same settlement nerves, the same post-settlement decisions.
                </p>
                <p>
                  That firsthand experience is why our advice is different. We are not
                  reading from a script — we are drawing on what has worked, what has
                  not, and what we would do in your position.
                </p>
              </div>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-brand-deepest text-brand-lime text-[15px] font-bold rounded-full hover:bg-brand-darker active:scale-[0.97] transition-all"
              >
                Talk to the team <ArrowRight size={15} />
              </a>
            </AnimateIn>

            <AnimateIn direction="right" delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: '40+', label: 'Lenders on our panel' },
                  { stat: '$0', label: 'Broker fees to you' },
                  { stat: '5★', label: 'Client satisfaction' },
                  { stat: '100%', label: 'Independent advice' },
                ].map(({ stat, label }) => (
                  <div
                    key={label}
                    className="bg-brand-dark/10 rounded-2xl p-6"
                  >
                    <div
                      className="font-display font-black text-brand-deepest leading-none tracking-tight mb-1.5"
                      style={{ fontSize: 'clamp(32px,3.5vw,48px)' }}
                    >
                      {stat}
                    </div>
                    <div className="text-[13px] font-medium text-brand-dark/60 leading-snug">{label}</div>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────── */}
      <section className="section-y bg-[#0e1302]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-16">
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight balance"
              style={{ fontSize: 'clamp(34px,4.5vw,60px)' }}
            >
              From hello
              <br />
              to settlement.
            </h2>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {STEPS.map(({ title, body }, i) => (
              <AnimateIn key={title} delay={i * 0.08}>
                <div className="bg-[#0e1302] p-8 h-full flex flex-col gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-lime/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-brand-lime/60 font-mono">{i + 1}</span>
                  </div>
                  <div className="font-display font-bold text-white text-[18px] leading-tight">{title}</div>
                  <div className="text-[13px] font-light text-white/40 leading-relaxed flex-1">{body}</div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.35} className="mt-10">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim transition-colors"
            >
              Start with a free call <ArrowRight size={15} />
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ── INSIGHTS ────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2
                className="font-display font-black text-white leading-[0.95] tracking-tight balance"
                style={{ fontSize: 'clamp(34px,4.5vw,60px)' }}
              >
                Latest thinking.
              </h2>
              <p className="text-[14px] font-light text-white/35 mt-3 max-w-sm pretty">
                Market updates, strategy, and straight answers on Australian property finance.
              </p>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/30 hover:text-white/70 transition-colors shrink-0"
            >
              All articles <ArrowUpRight size={13} />
            </Link>
          </AnimateIn>

          <div className="grid gap-px bg-white/[0.04] rounded-2xl overflow-hidden lg:grid-cols-3">
            {ARTICLES.map(({ category, date, title, excerpt, href }, i) => (
              <AnimateIn key={href} delay={i * 0.07}>
                <Link
                  href={href}
                  className="group flex flex-col bg-brand-deepest p-8 h-full hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-semibold text-brand-lime/70 tracking-wide">{category}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-[11px] font-light text-white/30">{date}</span>
                  </div>
                  <h3
                    className="font-display font-bold text-white leading-snug mb-3 group-hover:text-brand-lime transition-colors flex-1"
                    style={{ fontSize: 'clamp(16px,1.4vw,19px)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-[13px] font-light text-white/35 leading-relaxed mb-6 line-clamp-2">{excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/30 group-hover:text-brand-lime transition-colors mt-auto">
                    Read article <ArrowRight size={11} />
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-[#080e01]">
        {/* Lime radial glow from center */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(223,231,119,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Ghost watermark */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none select-none pb-8"
        >
          <span
            className="font-display font-black text-white/[0.025] leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(80px,18vw,260px)', letterSpacing: '-0.04em' }}
          >
            JRW Finance
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <AnimateIn>
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-6 balance"
              style={{ fontSize: 'clamp(38px,5.5vw,76px)' }}
            >
              Ready to talk property?
            </h2>
            <p className="text-[17px] font-light text-white/50 mb-10 max-w-md mx-auto leading-relaxed pretty">
              Book a free strategy call. No obligation, no pressure — just a straight
              conversation about your situation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-brand-lime text-brand-deepest text-[15px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
              >
                Book a free call <ArrowRight size={16} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 border border-white/15 text-white/60 text-[15px] font-medium rounded-full hover:bg-white/5 hover:border-white/30 transition-all"
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

    </div>
  )
}

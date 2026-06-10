'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { PageCTA } from '@/components/sections/PageCTA'
import { BOOK_URL } from '@/lib/constants'

// TODO: Replace with real team photo once available
const TEAM_PHOTO_PLACEHOLDER = null

const values = [
  {
    title: 'We have been through it ourselves.',
    body: "We're property investors. We've navigated pre-approvals, equity releases, IO switches, and refinances — from both sides of the desk. That changes the quality of advice we give.",
  },
  {
    title: 'We only recommend what makes financial sense.',
    body: "Brokers are paid on settlement. That creates an obvious conflict. We manage it by being direct: if refinancing doesn't stack up, we tell you. If the timing isn't right, we say so.",
  },
  {
    title: 'We stay in contact after settlement.',
    body: "Most broker relationships end at settlement. Ours doesn't. We proactively review client loans as rates change and market conditions shift — you shouldn't have to chase us.",
  },
  {
    title: 'We work on your timeline.',
    body: 'Property moves fast. We are available when you need us — including outside business hours when an opportunity requires a quick answer.',
  },
]

const stats = [
  { value: '40+', label: 'lenders on our panel' },
  { value: '$0', label: 'broker fees to clients' },
  // TODO: Replace with real portfolio/client stats once confirmed
  { value: 'TODO', label: 'properties financed' },
  { value: 'TODO', label: 'average client saving on refinance' },
]

export default function OurStoryPage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 70% 60% at 30% 0%, rgba(223,231,119,0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse 60% 50% at 100% 100%, rgba(14,19,2,0.95) 0%, transparent 60%)',
            ].join(', '),
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(223,231,119,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 50% 70% at 20% 20%, black 20%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-20 pt-24">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              Our Story
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-6 balance max-w-4xl"
              style={{ fontSize: 'clamp(38px,6vw,88px)' }}
            >
              We're property investors who happen to be mortgage brokers.
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] max-w-xl mb-8 pretty"
              style={{ fontSize: 'clamp(15px,1.4vw,18px)' }}
            >
              JRW Finance was built on a simple premise: the best advice comes from people who have skin in the game. We invest in property ourselves. That shapes how we think and what we recommend.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── ORIGIN STORY ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Photo placeholder */}
            <AnimateIn direction="left">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brand-dark/30 border border-white/[0.05]">
                {TEAM_PHOTO_PLACEHOLDER ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={TEAM_PHOTO_PLACEHOLDER} alt="JRW Finance team" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center">
                      <span className="text-brand-lime/40 text-2xl font-display font-black">JW</span>
                    </div>
                    <p className="text-white/20 text-[12px] font-light tracking-widest uppercase">Photo coming soon</p>
                  </div>
                )}
                {/* Lime accent corner */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-lime/40" />
              </div>
            </AnimateIn>

            <AnimateIn direction="right" delay={0.1} className="flex flex-col gap-6">
              <h2
                className="font-display font-black text-white leading-[1.0] tracking-tight balance"
                style={{ fontSize: 'clamp(26px,3vw,42px)' }}
              >
                We went through the process as buyers first.
              </h2>
              <div className="space-y-4 text-[15px] font-light text-white/55 leading-[1.8]">
                {/* TODO: Replace with Josh's actual story once confirmed — approximate version below */}
                <p>
                  JRW Finance was founded after experiencing firsthand what a difference the right broker makes. Not just in getting a loan approved, but in structuring it well, choosing the right lender, and building a setup that supports future growth rather than constraining it.
                </p>
                <p>
                  We have been through the pre-approval process, the equity release, the refinance that paid for itself in under a year. We have felt the difference between a broker who does the bare minimum and one who is genuinely invested in the outcome.
                </p>
                <p>
                  We built JRW Finance to be the second kind. Brokers who know the product from the inside, who work with property investors because they are property investors, and who measure success by whether the client is better off — not just whether the loan settled.
                </p>
              </div>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all w-fit"
              >
                Book a free call <ArrowRight size={14} />
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-dark/30 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <AnimateIn key={label} delay={i * 0.06}>
                <div className="flex flex-col gap-1.5">
                  <div
                    className="font-display font-black text-brand-lime leading-none"
                    style={{ fontSize: 'clamp(28px,4vw,52px)' }}
                  >
                    {value}
                  </div>
                  <div className="text-[13px] font-light text-white/40 leading-snug">{label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-14">
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight balance max-w-2xl"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              How we work.
            </h2>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {values.map(({ title, body }, i) => (
              <AnimateIn key={title} delay={i * 0.07}>
                <div className="bg-brand-deepest p-8 h-full flex flex-col gap-4">
                  <div
                    className="w-1 h-8 rounded-full bg-brand-lime/60 flex-shrink-0"
                    aria-hidden
                  />
                  <h3 className="font-display font-bold text-white text-[18px] leading-snug">{title}</h3>
                  <p className="text-[14px] font-light text-white/45 leading-relaxed flex-1">{body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ────────────────────────────────────────────────── */}
      <section className="py-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[12px] font-light text-white/25">
              <span>ABN 57 691 406 318</span>
              <span>Credit Rep 574207</span>
              <span>ACL 486112</span>
              <span>Member of the Mortgage & Finance Association of Australia (MFAA)</span>
            </div>
          </AnimateIn>
        </div>
      </section>

      <PageCTA
        heading="Want to work with us?"
        sub="Book a call and let's talk about your property goals — where you are now and where you want to get to."
      />
    </div>
  )
}

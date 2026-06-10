import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { PageCTA } from '@/components/sections/PageCTA'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Refer a Friend',
  description: 'Refer someone to JRW Finance and we will look after them the same way we looked after you.',
}

const steps = [
  { title: 'Tell us who to contact', body: 'Send us their name and contact details — email or phone. We handle the rest.' },
  { title: 'We make contact', body: 'We reach out to introduce ourselves and understand their situation. No pressure, no hard sell.' },
  { title: "We look after them", body: 'They receive the same standard of advice and service as any other client. If we can help them, we will.' },
]

export default function ReferralPage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 80% 0%, rgba(223,231,119,0.06) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-16">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              Referrals
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-5 balance max-w-3xl"
              style={{ fontSize: 'clamp(36px,5.5vw,76px)' }}
            >
              Know someone who needs a better mortgage?
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] max-w-lg pretty"
              style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}
            >
              The best referral is from someone who has already been through the process. If you have had a good experience, we would love the introduction.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimateIn className="mb-12">
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-tight balance"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              How it works.
            </h2>
          </AnimateIn>
          <div className="grid gap-px bg-white/[0.04] rounded-2xl overflow-hidden sm:grid-cols-3">
            {steps.map(({ title, body }, i) => (
              <AnimateIn key={title} delay={i * 0.07}>
                <div className="bg-brand-deepest p-8 h-full flex flex-col gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-lime/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-brand-lime/60 font-mono">{i + 1}</span>
                  </div>
                  <div className="font-display font-bold text-white text-[17px] leading-tight">{title}</div>
                  <div className="text-[13px] font-light text-white/40 leading-relaxed">{body}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + NOTE ────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <AnimateIn>
              <div className="p-8 rounded-2xl bg-brand-lime flex flex-col gap-5">
                <div className="w-10 h-10 rounded-full bg-brand-deepest/10 flex items-center justify-center">
                  <Users size={18} className="text-brand-deepest" />
                </div>
                <h2 className="font-display font-black text-brand-deepest text-[22px] leading-snug">
                  Make the introduction
                </h2>
                <p className="text-[13px] font-light text-brand-dark/65 leading-relaxed">
                  Send us their details and we will take it from there. No awkward conversations required on your end.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Referral`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-deepest text-brand-lime text-[13px] font-bold rounded-full hover:bg-brand-darker active:scale-[0.97] transition-all w-fit"
                >
                  Email us a referral <ArrowRight size={13} />
                </a>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1} className="flex flex-col gap-6">
              <h3 className="font-display font-bold text-white text-[20px] leading-snug">
                Who is a good fit?
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  'Anyone thinking about buying their first home or investment property',
                  'Existing homeowners who have not reviewed their rate in 12+ months',
                  'Property investors looking to grow their portfolio',
                  'Anyone building or buying a new home',
                  "Self-employed borrowers who have been told \"it's complicated\"",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-brand-lime/50 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] font-light text-white/50 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[12px] font-light text-white/25 leading-relaxed">
                We are not the right fit for everyone. If we are not the best option for your referral, we will tell them honestly.
              </p>
            </AnimateIn>
          </div>
        </div>
      </section>

      <PageCTA
        heading="Questions about referring?"
        sub="Drop us an email or book a call. We're easy to get hold of."
      />
    </div>
  )
}

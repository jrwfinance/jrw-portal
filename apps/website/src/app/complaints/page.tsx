import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Complaints',
  description: 'JRW Finance complaints handling process.',
}

export default function ComplaintsPage() {
  return (
    <div className="bg-brand-deepest">
      <section className="relative overflow-hidden pt-16">
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-24 pb-20">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">Legal</p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-8 balance"
              style={{ fontSize: 'clamp(28px,4vw,52px)' }}
            >
              Complaints
            </h1>

            <div className="flex flex-col gap-10 text-[14px] font-light text-white/50 leading-[1.85]">
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold text-white text-[17px] leading-snug">Our commitment</h2>
                <p>
                  If you are unhappy with any aspect of our service, we want to hear about it. We take complaints seriously and aim to resolve them promptly and fairly.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold text-white text-[17px] leading-snug">Step 1 — Contact us directly</h2>
                <p>
                  In the first instance, please contact us with details of your complaint:
                </p>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-white/60">
                    JRW Finance<br />
                    Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-lime hover:underline">{CONTACT_EMAIL}</a>
                  </p>
                </div>
                <p>
                  We will acknowledge your complaint within 1 business day and aim to resolve it within 30 days. If we need more time, we will let you know and explain why.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold text-white text-[17px] leading-snug">Step 2 — External dispute resolution</h2>
                <p>
                  If you are not satisfied with our response, you have the right to lodge a complaint with the Australian Financial Complaints Authority (AFCA) — a free, independent external dispute resolution service.
                </p>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
                  <p className="text-white/60 font-medium">Australian Financial Complaints Authority (AFCA)</p>
                  <p className="text-white/40">
                    Website: <a href="https://www.afca.org.au" target="_blank" rel="noopener noreferrer" className="text-brand-lime hover:underline">afca.org.au</a><br />
                    Phone: 1800 931 678 (free call)<br />
                    Email: info@afca.org.au<br />
                    Post: GPO Box 3, Melbourne VIC 3001
                  </p>
                </div>
                <p>
                  Time limits apply to AFCA complaints. Generally, you must lodge within 2 years of receiving our final response.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold text-white text-[17px] leading-snug">Privacy complaints</h2>
                <p>
                  For complaints specifically about how we have handled your personal information, you may also contact the Office of the Australian Information Commissioner (OAIC) at{' '}
                  <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-brand-lime hover:underline">oaic.gov.au</a>.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-brand-lime/5 border border-brand-lime/15">
                <p className="text-[13px] font-light text-white/50 leading-relaxed">
                  JRW Finance (Credit Rep 574207) is authorised under ACL 486112. We are a member of the Mortgage and Finance Association of Australia (MFAA) and comply with their Code of Practice.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}

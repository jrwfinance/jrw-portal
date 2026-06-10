import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { Accordion } from '@/components/ui/Accordion'
import { PageCTA } from '@/components/sections/PageCTA'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about working with JRW Finance — how brokers work, the loan process, costs, and what to expect.',
}

const sections = [
  {
    heading: 'Working with a broker',
    faqs: [
      { question: 'Does using a mortgage broker cost me anything?', answer: 'No. Mortgage brokers are paid by the lender when your loan settles — a commission called trail and upfront. You pay nothing. By law, we are required to act in your best interest regardless of which lender pays more commission.' },
      { question: 'How is a broker different from going directly to a bank?', answer: 'A bank can only offer their own products. A broker accesses 40+ lenders and recommends the one that best suits your situation. We also handle the application and manage the lender relationship — saving you time and reducing the chance of an unnecessary credit decline.' },
      { question: 'Do you only work with clients in NSW?', answer: 'No — we work with clients across Australia. Most of our process is conducted remotely (phone, video, email) and does not require in-person meetings.' },
      { question: 'How do you get paid, and does it affect your recommendation?', answer: 'We receive an upfront commission (typically 0.65% of the loan amount) and an ongoing trail (typically 0.15% per year). Commissions vary slightly between lenders, but we are legally obligated under the Best Interests Duty to recommend based on your needs — not commission. We disclose all commissions in the Credit Proposal we provide before you proceed.' },
    ],
  },
  {
    heading: 'The loan process',
    faqs: [
      { question: 'How long does it take to get a home loan?', answer: 'Pre-approval typically takes 3-5 business days for straightforward applications. Full approval after exchange of contracts takes 5-10 business days with most lenders. Complex applications (self-employed, multiple properties) can take longer. We set expectations upfront and keep you updated throughout.' },
      { question: 'What documents do I need to apply?', answer: 'Typically: last 2 payslips, last 2 years tax returns (self-employed), 3 months bank statements, photo ID, and details of any existing liabilities. We send you a tailored checklist at the start of the process.' },
      { question: 'What happens at pre-approval?', answer: 'A pre-approval (also called conditional approval) confirms that a lender will lend you up to a certain amount, subject to a satisfactory property valuation. It gives you confidence to make offers and shows vendors you are a serious buyer. Most pre-approvals are valid for 90 days.' },
      { question: 'Will applying affect my credit score?', answer: 'A credit enquiry is made when you apply, which has a minor, temporary impact on your score. We assess your situation before lodging to avoid unnecessary applications. Multiple enquiries in a short period can have a more noticeable effect, which is why we do not shotgun applications across lenders.' },
    ],
  },
  {
    heading: 'Rates and products',
    faqs: [
      { question: 'Should I fix my rate or go variable?', answer: 'Variable rates offer flexibility and have historically been lower over the long run. Fixed rates provide certainty for a set period. The right answer depends on your cashflow, risk tolerance, and plans for the property. We model both scenarios for every client.' },
      { question: 'What is an offset account?', answer: 'An offset account is a transaction account linked to your mortgage. The balance reduces the amount of interest you are charged. If you hold $50,000 in offset against a $600,000 loan, you only pay interest on $550,000. Over a 30-year loan, this can save tens of thousands.' },
      { question: 'Can I make extra repayments on my loan?', answer: 'Variable rate loans generally allow unlimited extra repayments. Fixed rate loans typically cap extra repayments (commonly $10,000-$20,000 per year). Some fixed loans allow no extra repayments at all. We flag these restrictions before recommending any fixed rate product.' },
      { question: 'What is LMI and can I avoid it?', answer: "Lenders Mortgage Insurance (LMI) is a premium charged when your deposit is below 20% of the purchase price. It protects the lender, not you. You can avoid it by saving a 20% deposit, using a guarantor, or (if you're a first home buyer) accessing the First Home Guarantee scheme." },
    ],
  },
  {
    heading: 'After settlement',
    faqs: [
      { question: 'How often should I review my home loan?', answer: 'Every 12-24 months in a normal rate environment. If your circumstances change significantly (income increase, property value appreciation, life event), review sooner. We proactively contact clients when we identify meaningful savings.' },
      { question: 'Can you help me refinance if I am already a client?', answer: 'Absolutely. We actively manage our clients\' loans over time and will reach out when we see a compelling reason to switch. If you want to review your loan at any point, just contact us.' },
      { question: 'What if my lender increases my rate?', answer: "Contact us. We will compare your current rate against the market and advise whether you should negotiate with your existing lender, switch, or stay put. Sometimes the best move is a retention call to your lender — we can coach you through that too." },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 80% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-14">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">FAQ</p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-5 balance max-w-3xl"
              style={{ fontSize: 'clamp(36px,5.5vw,76px)' }}
            >
              Common questions, straight answers.
            </h1>
            <p className="text-white/50 font-light leading-[1.75] max-w-lg pretty" style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}>
              Still have a question after reading?{' '}
              <Link href="/contact" className="text-brand-lime hover:underline">
                Ask us directly.
              </Link>
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── FAQ SECTIONS ──────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 flex flex-col gap-14">
          {sections.map(({ heading, faqs }, i) => (
            <AnimateIn key={heading} delay={i * 0.05}>
              <div className="flex flex-col gap-6">
                <h2
                  className="font-display font-bold text-white leading-snug"
                  style={{ fontSize: 'clamp(18px,2vw,26px)' }}
                >
                  {heading}
                </h2>
                <Accordion items={faqs} />
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <PageCTA
        heading="Still have a question?"
        sub="Book a free call and ask us directly. No question is too small."
      />
    </div>
  )
}

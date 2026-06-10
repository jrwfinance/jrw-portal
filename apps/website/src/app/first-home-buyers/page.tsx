import type { Metadata } from 'next'
import { ServiceLayout } from '@/components/sections/ServiceLayout'
import type { ServicePageData } from '@/components/sections/ServiceLayout'

const data: ServicePageData = {
  meta: {
    title: 'First Home Buyers',
    description: 'First home buyer mortgage brokers in Sydney. We explain grants, guarantees, and stamp duty concessions — and guide you through every step from pre-approval to settlement.',
  },
  hero: {
    category: 'First Home Buyers',
    headline: "Buying your first home is a big deal. We make sure you get it right.",
    sub: 'Grants, guarantees, stamp duty concessions, borrowing capacity — we walk you through the full picture, in plain language.',
  },
  intro: {
    heading: 'The process is complicated. We make it simple.',
    body: [
      'First home buyers face more complexity than any other group — grants with eligibility rules, guarantees with place limits, stamp duty concessions that vary by state, lenders with different policies on genuine savings.',
      'Most of this complexity exists because there are genuine benefits available to you. Our job is to make sure you access every one of them.',
      'We do not assume you know what FHOG, FHBG, or FHSS means. We start from the beginning, explain what applies to your situation, and guide you through to settlement — and beyond.',
    ],
  },
  benefits: {
    heading: 'What we do for first home buyers.',
    items: [
      {
        title: 'First Home Guarantee (FHBG)',
        body: 'Buy with a 5% deposit and no LMI. The government guarantees the gap. We check your eligibility, identify participating lenders, and manage the application process.',
      },
      {
        title: 'First Home Owner Grant (FHOG)',
        body: 'State-based cash grants for eligible first home buyers — up to $10,000 in NSW. Conditions apply. We confirm what you are entitled to and ensure it is factored into your purchase.',
      },
      {
        title: 'Stamp duty concessions',
        body: 'NSW offers full or partial exemptions on stamp duty for first home buyers under certain price thresholds. This can save you up to $66,005 on a $1M property. We calculate your exact saving.',
      },
      {
        title: 'First Home Super Saver (FHSS)',
        body: 'You may be able to withdraw up to $50,000 of voluntary super contributions to use as part of your deposit. If you have been making extra contributions, we can factor this into your planning.',
      },
      {
        title: 'Borrowing capacity explained clearly',
        body: 'We tell you what you can borrow, which lenders will lend it, and what the repayments look like at different loan sizes — before you start searching, not after.',
      },
      {
        title: 'No broker fees, ever',
        body: 'Our advice costs you nothing. We are paid by the lender when your loan settles. You get the same quality of service as any other client, regardless of your purchase price.',
      },
    ],
  },
  process: {
    heading: 'Your path to the keys.',
    steps: [
      { title: 'Understand your situation', body: 'We review your income, savings, and any existing assets — and check which grants and schemes you are eligible for.' },
      { title: 'Get pre-approved', body: 'We prepare and lodge a pre-approval with the right lender, giving you confidence to make offers and negotiate.' },
      { title: 'Find and buy', body: 'We stay available during your search — answering questions, reviewing contracts, and moving fast when you find the right property.' },
      { title: 'Settle and celebrate', body: 'We manage the final loan documentation, liaise with your conveyancer, and see you through to settlement day.' },
    ],
  },
  faqs: [
    {
      question: 'How much deposit do I need as a first home buyer?',
      answer: 'Technically as little as 5% with the First Home Guarantee. Without the guarantee, 20% avoids LMI — but many buyers purchase with 10–15% and pay LMI as a one-off cost. We model the trade-offs so you can make an informed decision.',
    },
    {
      question: 'What is the First Home Guarantee and how do I access it?',
      answer: 'The First Home Guarantee lets eligible buyers purchase with a 5% deposit and no LMI, with the government guaranteeing the remaining gap to 20%. There are income caps ($125k individual, $200k couple) and property price caps by state. Places are limited. We confirm your eligibility and match you with a participating lender.',
    },
    {
      question: 'Do I qualify for the First Home Owner Grant in NSW?',
      answer: 'In NSW, the $10,000 FHOG applies to new builds and substantially renovated properties. It does not apply to established homes. Eligibility requires you to be an Australian citizen or permanent resident, have not previously owned a home, and intend to live in the property. We check your eligibility as part of our initial assessment.',
    },
    {
      question: 'What counts as genuine savings?',
      answer: 'Lenders want to see that you have accumulated your deposit yourself rather than receiving it as a gift. Generally, savings held in your account for 3+ months qualify. Some gifts from parents count, depending on the lender. We know which lenders take a more flexible view of non-traditional deposit sources.',
    },
    {
      question: 'How long does pre-approval last?',
      answer: 'Most pre-approvals are valid for 90 days, though some lenders extend to 6 months. If your circumstances do not change, renewal is usually straightforward. We recommend getting pre-approval when you are actively ready to buy, not months in advance.',
    },
    {
      question: 'Do I need a solicitor or conveyancer as well?',
      answer: 'Yes — a solicitor or licensed conveyancer handles the legal side of the property transfer. We handle the finance side. The two work in parallel and we coordinate with your conveyancer to keep the timeline on track.',
    },
  ],
  cta: {
    heading: 'Ready to start the journey?',
    sub: 'Book a free call and we will tell you exactly what you can borrow, which grants apply to you, and what the process looks like from here.',
  },
}

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
}

export default function FirstHomeBuyersPage() {
  return <ServiceLayout data={data} />
}

import type { Metadata } from 'next'
import { ServiceLayout } from '@/components/sections/ServiceLayout'
import type { ServicePageData } from '@/components/sections/ServiceLayout'

const data: ServicePageData = {
  meta: {
    title: 'Refinancing',
    description: 'Refinance your home loan with JRW Finance. We compare 40+ lenders, identify genuine savings, and manage the entire process — often with no out-of-pocket costs.',
  },
  hero: {
    category: 'Refinancing',
    headline: 'Your current lender is not automatically your best lender.',
    sub: 'Rates change. Lender policies shift. Your situation evolves. We review your loan against the current market and tell you whether refinancing makes financial sense.',
  },
  intro: {
    heading: 'When did you last review your rate?',
    body: [
      'The average Australian mortgage holder is paying more than they need to. Not because they made bad decisions — but because they took out a loan years ago, life got busy, and the loan stayed in the background.',
      'Lenders reserve their best rates for new customers. Existing customers tend to drift onto higher rates over time. That gap is often 0.5-1.0% — on a $700,000 loan, that is $3,500-$7,000 per year.',
      'We run a full comparison against the current market, calculate the break-even on any exit costs, and tell you clearly whether switching makes sense. If it does not, we tell you that too.',
    ],
  },
  benefits: {
    heading: 'What we look at when refinancing.',
    items: [
      {
        title: 'Rate comparison against the market',
        body: 'We compare your current rate against the full panel of lenders — not just the big four. The best rates for your profile are often with second-tier lenders you may not have considered.',
      },
      {
        title: 'Break-even analysis on exit costs',
        body: 'Discharge fees, break costs (for fixed rates), and application fees all eat into the saving. We model exactly when you recover those costs and what the net saving looks like over 1, 3, and 5 years.',
      },
      {
        title: 'Cash-out refinancing',
        body: 'Refinancing can also access equity for renovations, investment deposits, or debt consolidation. We structure the new loan to serve both purposes without over-leveraging.',
      },
      {
        title: 'Loan structure review',
        body: 'Sometimes the rate is fine but the structure is wrong — no offset account, limited redraw, or a split that no longer makes sense. A refinance is an opportunity to fix both.',
      },
      {
        title: 'Fixed rate break cost assessment',
        body: 'Breaking a fixed rate before expiry can be expensive or almost free, depending on where rates have moved. We calculate the exact break cost before you commit to anything.',
      },
      {
        title: 'No cost to you',
        body: 'In most cases refinancing costs nothing out of pocket — lender cashbacks and rebates often cover or exceed application and legal fees. We identify those offers and factor them in.',
      },
    ],
  },
  process: {
    heading: 'How a refinance works.',
    steps: [
      { title: 'Review your current loan', body: 'We pull your current rate, remaining balance, and loan features — and check for any fixed-rate break costs or discharge fees.' },
      { title: 'Model the saving', body: 'We compare against the market and show you the net saving after all costs — across different time horizons so you can see the full picture.' },
      { title: 'Apply with the right lender', body: 'If switching makes sense, we handle the application. Most refinances settle within 3-4 weeks from application.' },
      { title: 'Discharge and settle', body: 'The new lender pays out your old loan. We liaise with both lenders to ensure the discharge and settlement happen without delays.' },
    ],
  },
  faqs: [
    {
      question: 'How much could I save by refinancing?',
      answer: 'The saving depends on your current rate, your outstanding balance, and what rate you can access today. Even 0.5% on a $600,000 loan is $3,000 per year. After exit costs, many clients are in profit within 6-12 months of refinancing. We calculate the exact figure for your situation.',
    },
    {
      question: 'Are there costs involved in refinancing?',
      answer: 'Discharge fees are typically $150-$350. A new application may involve valuation fees, legal fees, and lender application fees. Many lenders offer cashback offers of $2,000-$4,000 that can cover or exceed these costs. We factor all of this into the comparison before making a recommendation.',
    },
    {
      question: 'What if I am on a fixed rate?',
      answer: 'Breaking a fixed rate incurs a break cost calculated by the lender, based on the difference between your rate and current wholesale rates. Depending on when rates have moved, this can be minimal or significant. We obtain the exact break cost figure before you make any decision.',
    },
    {
      question: 'How often should I review my home loan?',
      answer: 'Every 12-24 months is a reasonable cadence in a normal rate environment. If rates have moved significantly or your property has appreciated (improving your LVR), it is worth reviewing sooner. We proactively contact clients when we see meaningful savings available.',
    },
    {
      question: 'Will refinancing affect my credit score?',
      answer: 'A credit enquiry is made when you apply. One enquiry has minimal impact. Multiple enquiries in a short period can have a more noticeable effect, which is why we assess your situation fully before lodging — we are not shotgunning applications across lenders.',
    },
    {
      question: 'Can I refinance if my property value has dropped?',
      answer: 'Yes, but your LVR will be higher, which limits your lender options and may require LMI if you are above 80% LVR. We assess what is available in your situation and give you an honest view of the options.',
    },
  ],
  cta: {
    heading: 'Find out what your loan should be costing.',
    sub: 'Book a free review call. We compare your current loan against the market and give you a clear answer — with numbers, not generalities.',
  },
}

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
}

export default function RefinancingPage() {
  return <ServiceLayout data={data} />
}

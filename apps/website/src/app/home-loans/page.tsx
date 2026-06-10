import type { Metadata } from 'next'
import { ServiceLayout } from '@/components/sections/ServiceLayout'
import type { ServicePageData } from '@/components/sections/ServiceLayout'

const data: ServicePageData = {
  meta: {
    title: 'Home Loans',
    description: 'Sydney mortgage brokers helping you buy, build, or upgrade your home. Access 40+ lenders, compare rates, and get straight advice from a team that invests themselves.',
  },
  hero: {
    category: 'Home Loans',
    headline: 'Get the right home loan — not just any approval.',
    sub: 'We compare 40+ lenders to find the loan that fits your situation now, and supports your goals down the track.',
  },
  intro: {
    heading: 'More than getting a loan approved.',
    body: [
      'Most brokers focus on getting your loan across the line. We focus on structuring it well — the right loan type, the right features, the right lender for your circumstances.',
      'An offset account might save you more than a lower rate. A split loan might protect you better than going fully variable. These decisions compound over the life of a 30-year mortgage, and we take them seriously.',
      'We work across owner-occupied purchases, construction loans, and upgrader purchases — and we stay available post-settlement when questions come up.',
    ],
  },
  benefits: {
    heading: 'What we bring to your purchase.',
    items: [
      {
        title: 'Full lender panel comparison',
        body: 'We search across 40+ lenders — major banks, second-tier lenders, and specialist providers — to find genuinely competitive options, not just the one our system defaults to.',
      },
      {
        title: 'Loan structure that works long-term',
        body: 'Rate is only one variable. We look at offset accounts, redraw facilities, repayment flexibility, and portability so the loan suits your life, not just today\'s numbers.',
      },
      {
        title: 'Pre-approval you can rely on',
        body: 'We prepare your application properly before lodging it — reducing the risk of a decline that affects your credit file and putting you in a strong position to move fast.',
      },
      {
        title: 'Government grants and concessions',
        body: 'From First Home Owner Grants to stamp duty concessions, we make sure you are not leaving money on the table that you are entitled to.',
      },
      {
        title: 'End-to-end support',
        body: 'From initial assessment through to settlement day — and beyond. We manage the lender relationship, the paperwork, and the timeline so you can focus on the purchase.',
      },
      {
        title: 'No broker fees',
        body: 'Our advice is free to you. We are paid by the lender on settlement. That does not change the quality of our advice — we are required by law to act in your best interest.',
      },
    ],
  },
  process: {
    heading: 'How we work.',
    steps: [
      { title: 'Understand your goals', body: 'A conversation about what you are buying, your timeline, and what you want the loan to do for you long-term.' },
      { title: 'Assess your position', body: 'We review your income, expenses, assets, and credit history to understand your borrowing capacity across different lenders.' },
      { title: 'Compare and recommend', body: 'We present options with clear comparisons — rate, fees, features — and explain our recommendation in plain language.' },
      { title: 'Apply and settle', body: 'We handle the application, respond to lender queries, and manage the process through to settlement.' },
    ],
  },
  faqs: [
    {
      question: 'How much can I borrow for a home loan?',
      answer: 'Borrowing capacity is calculated based on your income, existing debts, living expenses, and the lender\'s own servicing criteria. It varies significantly across lenders — some are more generous with overtime, rental income, or self-employed income. We can give you a realistic range before you start searching.',
    },
    {
      question: 'Variable, fixed, or split — which is right for me?',
      answer: 'Variable rates offer flexibility and typically lower rates over the long run. Fixed rates provide certainty for a set period (usually 1–5 years). A split loan combines both. The right answer depends on your circumstances, risk tolerance, and what you plan to do with the property. We walk through the options with every client.',
    },
    {
      question: 'What is an offset account and do I need one?',
      answer: 'An offset account is a transaction account linked to your mortgage. Any balance in it reduces the interest charged on your loan. If you hold savings or your salary in offset, it can save tens of thousands over the life of the loan — often more than a slightly lower rate without offset.',
    },
    {
      question: 'How long does the pre-approval process take?',
      answer: 'For most borrowers with standard employment and clean credit, pre-approval can be achieved in 2–5 business days once we have all documents. Complex applications (self-employed, unusual income) take longer. We tell you upfront what to expect and prepare your file properly before lodging.',
    },
    {
      question: 'Do I need a 20% deposit?',
      answer: 'No. You can purchase with as little as 5% (or even less with guarantor support), though deposits below 20% usually require Lenders Mortgage Insurance (LMI). If you are a first home buyer, the First Home Guarantee can eliminate LMI at 5% deposit. We help you understand the cost trade-offs.',
    },
  ],
  cta: {
    heading: 'Find out what you can borrow.',
    sub: 'Book a free call and we will walk through your borrowing capacity, the best-fit lenders, and what the process looks like for your situation.',
  },
}

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
}

export default function HomeLoansPage() {
  return <ServiceLayout data={data} />
}

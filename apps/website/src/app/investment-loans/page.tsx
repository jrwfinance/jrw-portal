import type { Metadata } from 'next'
import { ServiceLayout } from '@/components/sections/ServiceLayout'
import type { ServicePageData } from '@/components/sections/ServiceLayout'

const data: ServicePageData = {
  meta: {
    title: 'Investment Loans',
    description: 'Investment property lending for Australian property investors. We invest ourselves — and we structure loans to support portfolio growth, not just single purchases.',
  },
  hero: {
    category: 'Investment Loans',
    headline: 'Lending structured for portfolio growth, not just the next purchase.',
    sub: 'We invest in property ourselves. That means the advice we give you is drawn from experience, not just a comparison table.',
  },
  intro: {
    heading: 'We understand investment lending because we do it.',
    body: [
      'Most brokers will find you a competitive rate on an investment loan. We go further — structuring the loan in a way that supports your portfolio strategy, not just the current purchase.',
      'Interest-only versus principal and interest, cross-collateralisation risks, how lenders assess rental income, when to use equity and when to preserve cash — these are the conversations that matter when you are building a portfolio across multiple properties.',
      'We work with first-time investors, experienced portfolio builders, and clients at every stage in between. The advice changes based on where you are and where you want to go.',
    ],
  },
  benefits: {
    heading: 'How we help investors.',
    items: [
      {
        title: 'Portfolio-aware structuring',
        body: 'We look at your whole picture — existing properties, equity positions, cashflow — not just the loan you are applying for now. Structure matters more the larger your portfolio gets.',
      },
      {
        title: 'Interest-only options',
        body: 'IO loans can significantly improve cashflow during the growth phase of portfolio building. We know which lenders offer competitive IO rates and how to present your application to maximise approval chances.',
      },
      {
        title: 'Equity access without crossing',
        body: 'We structure equity releases as standalone loans wherever possible, avoiding cross-collateralisation that ties your properties together and limits your flexibility.',
      },
      {
        title: 'Rental income assessment',
        body: 'Lenders apply different shading to rental income — typically 75–80%. Some are more generous for established investors. We match you with lenders who assess your income profile most favourably.',
      },
      {
        title: 'APRA-compliant lending',
        body: 'Investment lending has specific regulatory constraints around LVR, IO terms, and serviceability. We navigate these without drama — knowing what is achievable before lodging your application.',
      },
      {
        title: 'Tax structure awareness',
        body: 'We do not give tax advice, but we work alongside your accountant to ensure the loan structure supports your tax strategy — whether that is negative gearing, depreciation, or entity ownership.',
      },
    ],
  },
  process: {
    heading: 'How we work with investors.',
    steps: [
      { title: 'Review your position', body: 'We look at your existing portfolio, equity, income, and serviceability to understand what is achievable and what lenders suit you.' },
      { title: 'Model the structure', body: 'We model different loan structures against your cashflow and portfolio goals — not just the cheapest rate but the most strategically sound option.' },
      { title: 'Select the right lender', body: 'Investment lending criteria varies more than owner-occupied. We match you with the lender that assesses your specific income and equity profile most favourably.' },
      { title: 'Manage to settlement', body: 'We handle the application, respond to queries, and keep the process moving — so you can focus on the deal, not the paperwork.' },
    ],
  },
  faqs: [
    {
      question: 'Can I use equity in my home to fund an investment property?',
      answer: 'Yes — if you have sufficient equity (most lenders allow up to 80% LVR without LMI), you can draw against it as a deposit for an investment purchase. We structure this as a standalone equity loan where possible to avoid crossing your properties as security.',
    },
    {
      question: 'Interest-only or principal and interest for investment loans?',
      answer: 'IO loans reduce your repayments during the IO period, improving cashflow — particularly useful when building a portfolio. However, IO terms are limited (typically 5 years) and rates are often slightly higher. The right choice depends on your cashflow position, tax strategy, and how long you plan to hold the property.',
    },
    {
      question: 'How much deposit do I need for an investment property?',
      answer: 'Most lenders require at least 10–20% for investment purchases. Below 20%, LMI applies (the First Home Guarantee does not apply to investment properties). Some lenders allow 10% deposit for investment with LMI. Using equity from an existing property can reduce or eliminate the need for cash deposit.',
    },
    {
      question: 'Will having multiple investment loans affect my borrowing capacity?',
      answer: 'Yes — each loan adds to your debt obligations, which reduces serviceability. However, rental income partially offsets this. Some lenders use a "portfolio" assessment for experienced investors that is more favourable than standard servicing calculators. We know which lenders take this approach.',
    },
    {
      question: 'Should I buy in my own name, a trust, or a company?',
      answer: 'This is a tax and legal question we leave to your accountant and solicitor. What we can tell you is that the entity structure affects your lending options — some lenders are comfortable with trusts and companies, others are not. Let us know your preferred structure and we will work with it.',
    },
  ],
  cta: {
    heading: 'Growing your portfolio?',
    sub: 'Book a call and we will review your current position, model what is achievable, and outline the lending structures that support your strategy.',
  },
}

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
}

export default function InvestmentLoansPage() {
  return <ServiceLayout data={data} />
}

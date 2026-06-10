import type { Metadata } from 'next'
import { ServiceLayout } from '@/components/sections/ServiceLayout'
import type { ServicePageData } from '@/components/sections/ServiceLayout'

const data: ServicePageData = {
  meta: {
    title: 'SMSF Loans',
    description: 'SMSF property lending specialists. We structure limited recourse borrowing arrangements (LRBAs) for self-managed super funds — residential and commercial property.',
  },
  hero: {
    category: 'SMSF Loans',
    headline: 'Buy property inside your super — structured correctly.',
    sub: 'SMSF lending is complex. Trustee requirements, bare trust structures, lender credit policy — we have done this before and we know what the ATO and lenders require.',
  },
  intro: {
    heading: 'SMSF property lending is a specialist area. Treat it as one.',
    body: [
      'A limited recourse borrowing arrangement (LRBA) allows your SMSF to borrow to purchase property. The rules are strict, the structure is non-negotiable, and only a small number of lenders actively do this lending.',
      'Getting the structure wrong — wrong trust deed, incorrect bare trustee, non-compliant loan terms — can expose your SMSF to significant risk and trigger ATO scrutiny. We work with SMSF accountants and solicitors to ensure everything is set up correctly before a dollar is borrowed.',
      'We work with SMSFs buying residential investment properties, commercial properties, and rural land — and we know which lenders accommodate each category and what their current credit criteria look like.',
    ],
  },
  benefits: {
    heading: 'What we do for SMSF borrowers.',
    items: [
      {
        title: 'LRBA structure guidance',
        body: 'A bare trust (holding trust) must be established to hold the property during the loan. We explain the structure clearly and coordinate with your SMSF solicitor to ensure the bare trust deed meets lender requirements.',
      },
      {
        title: 'Lender selection for SMSF',
        body: 'Most mainstream lenders do not offer SMSF loans. We work with the specialist lenders that do — including non-bank lenders who often have more flexible credit policy for SMSFs with mixed asset bases.',
      },
      {
        title: 'Residential and commercial property',
        body: 'SMSFs can hold both residential and commercial (including business real property). We have structured LRBAs for both categories and know the different policy requirements that apply.',
      },
      {
        title: 'Serviceability assessment',
        body: 'SMSF loan serviceability is assessed differently from personal lending — fund contributions, rental income, and existing fund assets all factor in. We know how lenders assess this and which present your fund most favourably.',
      },
      {
        title: 'Coordination with your SMSF professionals',
        body: 'We work alongside your SMSF accountant and solicitor — not in isolation. Good SMSF lending requires all three disciplines aligned on structure, compliance, and credit.',
      },
      {
        title: 'Ongoing loan management',
        body: 'Once the loan is in place, we review it at renewal. SMSF loan terms are often shorter than standard mortgages, and rate reviews matter when your fund is the borrower.',
      },
    ],
  },
  process: {
    heading: 'How SMSF lending works.',
    steps: [
      { title: 'Assess the fund', body: 'We review your SMSF trust deed, fund balance, contribution history, and existing assets to assess serviceability and structure options.' },
      { title: 'Coordinate the structure', body: 'We work with your solicitor to set up the bare trust and ensure the SMSF trust deed permits borrowing. This step is non-negotiable.' },
      { title: 'Select the right lender', body: 'We identify which SMSF lenders suit your fund profile and property type, and prepare a complete application — SMSF lenders require more documentation than standard mortgages.' },
      { title: 'Settle and hold correctly', body: 'The property settles in the bare trustee name. We liaise with all parties — lender, solicitor, and SMSF accountant — through to settlement.' },
    ],
  },
  faqs: [
    {
      question: 'Can my SMSF borrow to buy any type of property?',
      answer: 'Residential investment properties and commercial properties (including business real property leased to a related party) are the most common. The property must meet the "sole purpose test" — it cannot be used by fund members or related parties for residential purposes. We explain the restrictions upfront and help you identify eligible properties.',
    },
    {
      question: 'What is a limited recourse borrowing arrangement (LRBA)?',
      answer: 'An LRBA is the legal structure that allows an SMSF to borrow. "Limited recourse" means if the fund defaults, the lender can only recover against the specific asset being purchased — not the rest of the fund. The property must be held in a separate bare trust during the loan period.',
    },
    {
      question: 'What deposit does an SMSF need?',
      answer: 'Most SMSF lenders require a 20-30% deposit (plus stamp duty and costs). Unlike personal lending, LMI is generally not available for SMSF loans. The fund needs sufficient liquid assets post-purchase to continue meeting contribution and pension obligations.',
    },
    {
      question: 'Who can be the bare trustee?',
      answer: 'The bare trustee must be a separate legal entity from the SMSF trustee — typically a company. It holds legal title during the loan period and transfers it to the SMSF upon final repayment. Your SMSF solicitor sets this up. The correct bare trust structure is a requirement, not optional, for most lenders.',
    },
    {
      question: 'Do I need an SMSF accountant and solicitor as well?',
      answer: 'Yes — SMSF lending requires coordinated advice from an SMSF accountant (compliance, fund structure, tax), an SMSF solicitor (bare trust deed, fund deed amendments if needed), and a specialist mortgage broker (lender selection and credit). We coordinate with your existing professionals or can refer you to trusted contacts.',
    },
    {
      question: 'What happens to the loan when the SMSF member retires?',
      answer: 'The loan must be repaid from within the fund — from rental income, member contributions, or fund assets. It cannot be refinanced into a personal name. We model the repayment timeline against your fund balance and projected contributions to ensure the strategy is viable over the holding period.',
    },
  ],
  cta: {
    heading: 'Buying property in your SMSF?',
    sub: 'Book a call to discuss your fund structure, what you are looking to buy, and whether the numbers support it.',
  },
}

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
}

export default function SmsfLoansPage() {
  return <ServiceLayout data={data} />
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  date: string
  readTime: string
}

export const ARTICLES: Article[] = [
  {
    slug: 'rba-rate-decision-june-2025',
    category: 'Market Update',
    date: '03 Jun 2025',
    readTime: '4 min read',
    title: "What the RBA's rate decision means for your mortgage repayments",
    excerpt:
      'The cash rate held at 4.35% for the sixth consecutive meeting. Here is what that means practically for variable-rate borrowers.',
    body: `The Reserve Bank of Australia held the cash rate at 4.35% at its June 2025 meeting — the sixth consecutive hold after a series of rapid hikes that began in May 2022.

For borrowers on variable rates, this means no immediate change to monthly repayments. But it also signals the RBA is not in a hurry to cut, despite inflation easing toward the 2–3% target band.

**What this means for buyers**

If you are actively searching, conditions are relatively stable. Lenders are competing for business, and there are genuine deals available — particularly on fixed rates, where some lenders are pricing below variable in anticipation of future cuts.

**If you are already a borrower**

This is a good moment to check whether your current rate is still competitive. In a flat rate environment, lenders rarely pass on savings proactively. If you have not had a rate review in 12+ months, you are likely paying more than you need to.

We regularly see clients move from rates in the high 6s to the low 6s — or even sub-6% — just by refinancing or calling their existing lender with a competing offer in hand.

**Our view**

Markets are pricing in 2–3 cuts over the next 12 months. Whether that plays out depends on inflation and the labour market. What we tell clients: do not make major financial decisions based on rate speculation. Structure your loan for the rate environment you are in, not the one you are hoping for.`,
  },
  {
    slug: 'using-home-equity-investment-property',
    category: 'Investment',
    date: '18 May 2025',
    readTime: '6 min read',
    title: 'How to use equity in your home to fund an investment property',
    excerpt:
      'Cross-collateralisation, standalone equity loans, and why the structure matters as much as the rate.',
    body: `Equity is one of the most powerful tools in property investing — and one of the most misused.

If your home has grown in value since you purchased it, you may be sitting on usable equity without realising it. Most lenders will allow you to access up to 80% of the property's value (minus your remaining loan balance) without paying Lenders Mortgage Insurance.

**How it works**

Say your property is worth $900,000 and you owe $400,000. 80% of $900k is $720,000. Subtract your existing debt: $720k - $400k = $320,000 in accessible equity.

That $320,000 can be drawn as a separate loan or line of credit and used as a deposit on an investment property.

**Cross-collateralisation: what to avoid**

Some lenders — and some brokers — will structure this by "crossing" your home and investment properties as security for each other. On the surface this looks simpler. In practice it gives the lender significantly more control over your portfolio and can complicate future sales or refinancing.

We structure equity releases as standalone loans wherever possible. It takes slightly more paperwork but protects your flexibility long-term.

**What lenders look at**

Beyond the equity calculation, lenders will assess your borrowing capacity based on your income, existing debts, and how much of the rental income they will accept (most use 75–80%). Some lenders are more generous on investment lending than others.

We work across 40+ lenders and know which ones suit investors building portfolios — not just buyers making a one-time purchase.`,
  },
  {
    slug: 'first-home-guarantee-explained',
    category: 'First Home Buyers',
    date: '02 May 2025',
    readTime: '5 min read',
    title: 'First Home Guarantee explained: who qualifies and what it actually covers',
    excerpt:
      "The scheme lets eligible buyers purchase with a 5% deposit and no LMI. The details matter more than the headline.",
    body: `The First Home Guarantee (formerly the First Home Loan Deposit Scheme) is one of the most significant supports available to first home buyers in Australia. But the way it gets talked about online — "buy with 5%!" — glosses over some important details.

**What it actually does**

The government guarantees the gap between your 5% deposit and the 20% threshold that would normally require Lenders Mortgage Insurance. You do not pay LMI, and you do not need to save a full 20% deposit.

On a $700,000 property, LMI could cost $15,000–$25,000. The scheme eliminates that cost entirely.

**Who qualifies**

- Australian citizens and permanent residents
- Individual or couple (not companies/trusts)
- Income cap: $125,000 for individuals, $200,000 for couples (based on prior financial year)
- Must be purchasing as owner-occupier (not investor)
- Property price caps apply by state/territory (Sydney cap: $900,000 in 2024-25)

**The fine print**

Only specific lenders participate in the scheme — about 33 as of 2025. That limits your options, and not every participating lender is competitive on rate or features.

There are also only 35,000 places available per financial year across the First Home Guarantee and related schemes (Regional First Home Buyer Guarantee, Family Home Guarantee). Places do run out.

**How to apply**

You apply through a participating lender or broker. We are accredited to help clients access the scheme and can tell you upfront whether you qualify, which participating lenders suit your situation, and how to position your application for the best outcome.`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((a) => a.slug)
}

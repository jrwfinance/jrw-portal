import type { Metadata } from 'next'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'JRW Finance website terms of use.',
}

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="text-[12px] font-light text-white/25 mb-12">Last updated: June 2025</p>

            <div className="flex flex-col gap-10 text-[14px] font-light text-white/50 leading-[1.85]">
              {[
                {
                  heading: '1. Acceptance of terms',
                  body: 'By accessing this website, you agree to these terms. If you do not agree, please do not use the site.',
                },
                {
                  heading: '2. About JRW Finance',
                  body: 'JRW Finance (ABN 57 691 406 318) operates as a credit representative (Credit Rep 574207) authorised under Australian Credit Licence 486112. We are a licensed mortgage broker regulated by ASIC.',
                },
                {
                  heading: '3. General information only',
                  body: `The content on this website is provided for general information purposes only. It does not constitute:

- Financial product advice
- Credit advice
- Legal or tax advice

Any calculators, estimates, or indicative figures are illustrative only and do not account for your individual circumstances. Always seek independent professional advice before making financial decisions.`,
                },
                {
                  heading: '4. No guarantee of results',
                  body: 'Past results, case studies, or example scenarios do not guarantee future outcomes. Loan approval, interest rates, and lending conditions depend on individual circumstances and lender criteria at the time of application.',
                },
                {
                  heading: '5. Third-party links',
                  body: 'This website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of external sites. Links do not constitute endorsement.',
                },
                {
                  heading: '6. Intellectual property',
                  body: 'All content on this website — text, graphics, logos, and code — is owned by or licensed to JRW Finance. You may not reproduce or distribute any content without written permission.',
                },
                {
                  heading: '7. Limitation of liability',
                  body: 'To the maximum extent permitted by law, JRW Finance is not liable for any loss or damage arising from your use of this website or reliance on its content.',
                },
                {
                  heading: '8. Governing law',
                  body: 'These terms are governed by the laws of New South Wales, Australia.',
                },
                {
                  heading: '9. Contact',
                  body: `For any queries regarding these terms:\nJRW Finance\nEmail: ${CONTACT_EMAIL}`,
                },
              ].map(({ heading, body }) => (
                <div key={heading} className="flex flex-col gap-3">
                  <h2 className="font-display font-bold text-white text-[17px] leading-snug">{heading}</h2>
                  <div className="whitespace-pre-line">{body}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}

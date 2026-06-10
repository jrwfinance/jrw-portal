import type { Metadata } from 'next'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'JRW Finance privacy policy — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-[12px] font-light text-white/25 mb-12">Last updated: June 2025</p>

            <div className="flex flex-col gap-10 text-[14px] font-light text-white/50 leading-[1.85]">
              {[
                {
                  heading: '1. Who we are',
                  body: 'JRW Finance (ABN 57 691 406 318, Credit Rep 574207) is an Australian credit representative authorised under ACL 486112. We take your privacy seriously and comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles.',
                },
                {
                  heading: '2. What information we collect',
                  body: `We collect personal information necessary to provide mortgage broking services, including:

- Identity information (name, date of birth, photo ID)
- Contact details (email, phone, address)
- Financial information (income, expenses, assets, liabilities, credit history)
- Property information relating to purchases or existing holdings
- Any information you provide through our website forms or direct communications

We collect information directly from you wherever possible. In some cases we collect information from third parties such as lenders, credit reporting bodies, and government agencies.`,
                },
                {
                  heading: '3. How we use your information',
                  body: `We use your personal information to:

- Assess your borrowing capacity and provide credit advice
- Prepare and lodge loan applications on your behalf
- Comply with responsible lending obligations under the National Consumer Credit Protection Act
- Communicate with you about your loan and ongoing service
- Meet legal and regulatory obligations
- Improve our services

We do not sell your personal information to third parties.`,
                },
                {
                  heading: '4. Who we share your information with',
                  body: `We may share your information with:

- Lenders and credit providers when assessing or processing your application
- Credit reporting bodies (Equifax, Experian, Illion)
- Aggregators and broker networks we operate through
- Third-party service providers who assist us in operating our business, under strict confidentiality obligations
- Regulatory bodies if required by law

We require all third parties to handle your personal information in accordance with applicable privacy laws.`,
                },
                {
                  heading: '5. Data security',
                  body: 'We store your personal information securely using industry-standard encryption and access controls. We use Supabase (hosted in AWS ap-southeast-2, Sydney) to store client data. We take reasonable steps to protect your information from misuse, loss, and unauthorised access.',
                },
                {
                  heading: '6. Your rights',
                  body: `You have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate information
- Make a complaint about how we have handled your information
- Opt out of direct marketing communications

To exercise any of these rights, contact us at the address below.`,
                },
                {
                  heading: '7. Cookies and website data',
                  body: 'Our website may use cookies and analytics tools to improve user experience. You can disable cookies in your browser settings. We do not use cookies to identify you personally without your consent.',
                },
                {
                  heading: '8. Complaints',
                  body: `If you have a complaint about how we have handled your personal information, contact us first. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.`,
                },
                {
                  heading: '9. Contact us',
                  body: `Privacy Officer\nJRW Finance\nEmail: ${CONTACT_EMAIL}`,
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

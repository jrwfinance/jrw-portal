import Link from 'next/link'
import Image from 'next/image'
import { BOOK_URL, CONTACT_EMAIL, SOCIAL } from '@/lib/constants'
import { Instagram, Youtube, Facebook } from 'lucide-react'

const SERVICES = [
  { label: 'Home Loans',        href: '/home-loans' },
  { label: 'Investment Loans',  href: '/investment-loans' },
  { label: 'First Home Buyers', href: '/first-home-buyers' },
  { label: 'Refinancing',       href: '/refinancing' },
  { label: 'SMSF Loans',        href: '/smsf-loans' },
  { label: 'Property Tools',    href: '/tools' },
]

const COMPANY = [
  { label: 'Our Story',    href: '/our-story' },
  { label: 'Insights',     href: '/insights' },
  { label: 'Referral',     href: '/referral' },
  { label: 'FAQ',          href: '/faq' },
  { label: 'Contact',      href: '/contact' },
]

const LEGAL = [
  { label: 'Privacy Policy',        href: '/privacy' },
  { label: 'Terms & Conditions',    href: '/terms' },
  { label: 'Feedback & Complaints', href: '/complaints' },
]

export function Footer() {
  return (
    <footer className="bg-brand-deepest border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src="/logo-landscape-light.webp"
                alt="JRW Finance"
                width={130}
                height={32}
                className="h-7 w-auto mb-5"
              />
            </Link>
            <p className="text-[13px] font-light text-white/40 leading-relaxed max-w-xs mb-6">
              Mortgage brokers helping Australians buy, invest, and refinance smarter. We partner with 40+ lenders.
            </p>
            <div className="flex items-center gap-3">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-brand-lime hover:bg-white/5 transition-all">
                <Instagram size={16} />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-brand-lime hover:bg-white/5 transition-all">
                <Facebook size={16} />
              </a>
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-brand-lime hover:bg-white/5 transition-all">
                <Youtube size={16} />
              </a>
              {/* TikTok */}
              <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-brand-lime hover:bg-white/5 transition-all">
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-[11px] font-semibold text-white/25 tracking-widest uppercase mb-5">Services</p>
            <ul className="space-y-3">
              {SERVICES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] font-light text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] font-semibold text-white/25 tracking-widest uppercase mb-5">Company</p>
            <ul className="space-y-3">
              {COMPANY.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] font-light text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-semibold text-white/25 tracking-widest uppercase mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[13px] font-light text-white/50 hover:text-white transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <p className="text-[13px] font-light text-white/40 leading-relaxed">
                  Suite 302, 13/15 Wentworth Ave<br />Sydney NSW 2000
                </p>
              </li>
              <li className="pt-2">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-lime hover:text-brand-lime-dim transition-colors"
                >
                  Book a free call →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {LEGAL.map(({ label, href }) => (
              <Link key={href} href={href}
                className="text-[11px] font-light text-white/25 hover:text-white/50 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-light text-white/20 leading-relaxed">
              JRW Finance Group Pty Ltd ABN 57 691 406 318<br />
              Credit Representative 574207 | Australian Credit Licence 486112
            </p>
            <p className="text-[11px] font-light text-white/15 mt-1">
              © {new Date().getFullYear()} JRW Finance Group. General advice only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { Barlow, Bricolage_Grotesque } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@/components/Analytics'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'JRW Finance',
  url: 'https://jrwfinance.com.au',
  logo: 'https://jrwfinance.com.au/logo.png',
  email: 'hello@jrwfinance.com.au',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sydney',
    addressRegion: 'NSW',
    addressCountry: 'AU',
  },
  areaServed: 'AU',
  description: 'Mortgage brokers helping Australians buy, invest, and refinance smarter. Access 40+ lenders, honest advice, no broker fees.',
  sameAs: [
    'https://www.instagram.com/jrwfinance/',
    'https://www.facebook.com/jrwfinance',
    'https://www.youtube.com/@jrwfinance',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://jrwfinance.com.au'),
  title: {
    default: 'JRW Finance | Mortgage Brokers Sydney',
    template: '%s | JRW Finance',
  },
  description:
    'JRW Finance — Sydney mortgage brokers helping Australians buy, invest, and refinance smarter. Access 40+ lenders, honest advice, no broker fees.',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://jrwfinance.com.au',
    siteName: 'JRW Finance',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'JRW Finance' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${barlow.variable} ${bricolage.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

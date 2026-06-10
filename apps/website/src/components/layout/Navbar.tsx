'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Menu, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BOOK_URL } from '@/lib/constants'

const NAV_LINKS = [
  { label: 'Home Loans',        href: '/home-loans' },
  { label: 'Investment Loans',  href: '/investment-loans' },
  { label: 'First Home Buyers', href: '/first-home-buyers' },
  { label: 'Refinancing',       href: '/refinancing' },
  { label: 'SMSF Loans',        href: '/smsf-loans' },
  { label: 'Our Story',         href: '/our-story' },
  { label: 'Insights',          href: '/insights' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-brand-deepest/95 backdrop-blur-md border-b border-white/[0.06] shadow-[0_1px_0_rgba(223,231,119,0.04)]'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <Image
              src="/logo-landscape-light.webp"
              alt="JRW Finance"
              width={130}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-lime text-brand-deepest text-[13px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Book a call <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-brand-darker flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
                <span className="text-[13px] font-semibold text-white/40 tracking-wide uppercase">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 text-[17px] font-semibold text-white/80 hover:text-white border-b border-white/[0.06] transition-colors group"
                    >
                      {label}
                      <ArrowRight size={15} className="text-white/20 group-hover:text-brand-lime transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 pb-10 pt-4 border-t border-white/[0.06]">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-brand-lime text-brand-deepest text-[15px] font-bold rounded-full hover:bg-brand-lime-dim transition-colors"
                >
                  Book a free call <ArrowRight size={15} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

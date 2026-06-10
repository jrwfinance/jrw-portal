'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Instagram, Youtube, Facebook } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { BOOK_URL, CONTACT_EMAIL, SOCIAL } from '@/lib/constants'

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>
)

const channels = [
  { label: 'Instagram', href: SOCIAL.instagram, icon: Instagram },
  { label: 'YouTube', href: SOCIAL.youtube, icon: Youtube },
  { label: 'Facebook', href: SOCIAL.facebook, icon: Facebook },
  { label: 'TikTok', href: SOCIAL.tiktok, icon: TikTokIcon },
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    enquiry: 'general',
  })

  const enquiryTypes = [
    { value: 'general', label: 'General enquiry' },
    { value: 'home-loan', label: 'Home loan' },
    { value: 'investment', label: 'Investment loan' },
    { value: 'refinance', label: 'Refinancing' },
    { value: 'first-home', label: 'First home buyer' },
    { value: 'smsf', label: 'SMSF loan' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    try {
      const res = await fetch(
        'https://amhevyrewmlmwxncujmp.supabase.co/functions/v1/contact-form',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )
      if (!res.ok) throw new Error('send failed')
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  // Reset error so user can retry
  const handleRetry = () => setFormState('idle')

  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-[14px] font-light placeholder:text-white/25 focus:outline-none focus:border-brand-lime/50 focus:bg-white/[0.06] transition-all"

  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 80% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-16 pt-24">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              Contact
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-5 balance max-w-3xl"
              style={{ fontSize: 'clamp(36px,5.5vw,76px)' }}
            >
              Let's talk property.
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] max-w-lg pretty"
              style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}
            >
              Book a strategy call, send a message, or ask a quick question. We respond to all enquiries within one business day.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

            {/* Left: info */}
            <AnimateIn direction="left" className="flex flex-col gap-10">

              {/* Book a call CTA */}
              <div className="p-7 rounded-2xl bg-brand-lime flex flex-col gap-4">
                <h2 className="font-display font-black text-brand-deepest text-[22px] leading-snug">
                  Book a strategy call
                </h2>
                <p className="text-[13px] font-light text-brand-dark/65 leading-relaxed">
                  The fastest way to get a clear picture of your borrowing position and the options available to you. Free, no obligation.
                </p>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-deepest text-brand-lime text-[13px] font-bold rounded-full hover:bg-brand-darker active:scale-[0.97] transition-all w-fit"
                >
                  Choose a time <ArrowRight size={13} />
                </a>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Email</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-brand-lime transition-colors text-[14px] font-light"
                >
                  <Mail size={14} className="flex-shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Social */}
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Follow us</p>
                <div className="flex gap-3">
                  {channels.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-lime hover:border-brand-lime/30 transition-all"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time note */}
              <p className="text-[12px] font-light text-white/20 leading-relaxed">
                We respond to all enquiries within one business day. For urgent pre-approval requests, mention it in your message and we will prioritise.
              </p>
            </AnimateIn>

            {/* Right: form */}
            <AnimateIn direction="right" delay={0.1}>
              {formState === 'error' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-2xl border border-red-400/20 bg-red-400/5 flex flex-col items-center text-center gap-5 min-h-[300px] justify-center"
                >
                  <p className="font-display font-bold text-white text-[18px]">Something went wrong.</p>
                  <p className="text-[14px] font-light text-white/40 max-w-sm leading-relaxed">
                    Your message didn't send. Please try again or email us directly at{' '}
                    <a href="mailto:hello@jrwfinance.com.au" className="text-brand-lime hover:underline">hello@jrwfinance.com.au</a>.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 border border-white/15 text-white/60 text-[13px] font-medium rounded-full hover:bg-white/5 transition-all"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : formState === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 rounded-2xl border border-brand-lime/20 bg-brand-lime/5 flex flex-col items-center text-center gap-5 min-h-[400px] justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-lime/15 border border-brand-lime/30 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-lime">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-[22px]">Message received.</h3>
                  <p className="text-[14px] font-light text-white/50 max-w-sm leading-relaxed">
                    We'll be in touch within one business day. If you'd like to speak sooner, book a time directly.
                  </p>
                  <a
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-brand-lime text-brand-deepest text-[13px] font-bold rounded-full hover:bg-brand-lime-dim transition-all"
                  >
                    Book a call <ArrowRight size={13} />
                  </a>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Enquiry type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-white/40 tracking-wide">Enquiry type</label>
                    <div className="flex flex-wrap gap-2">
                      {enquiryTypes.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData(d => ({ ...d, enquiry: value }))}
                          className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all ${
                            formData.enquiry === value
                              ? 'bg-brand-lime text-brand-deepest border-brand-lime'
                              : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-white/40 tracking-wide">Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-white/40 tracking-wide">Phone</label>
                      <input
                        type="tel"
                        placeholder="0400 000 000"
                        value={formData.phone}
                        onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-white/40 tracking-wide">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-white/40 tracking-wide">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you're working towards..."
                      value={formData.message}
                      onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all disabled:opacity-60 disabled:cursor-not-allowed w-fit"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-brand-deepest/30 border-t-brand-deepest rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Send message <ArrowRight size={14} /></>
                    )}
                  </button>

                  <p className="text-[11px] font-light text-white/20">
                    By submitting this form you agree to our{' '}
                    <a href="/privacy" className="hover:text-white/40 transition-colors underline underline-offset-2">
                      privacy policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </AnimateIn>
          </div>
        </div>
      </section>
    </div>
  )
}

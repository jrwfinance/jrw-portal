import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-brand-deepest min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-lg">
        {/* Ghost 404 watermark */}
        <div
          aria-hidden
          className="font-display font-black text-white/[0.04] leading-none select-none mb-6"
          style={{ fontSize: 'clamp(80px,18vw,200px)', letterSpacing: '-0.05em' }}
        >
          404
        </div>
        <h1
          className="font-display font-black text-white leading-[0.95] tracking-tight mb-4 balance"
          style={{ fontSize: 'clamp(24px,3.5vw,44px)' }}
        >
          Page not found.
        </h1>
        <p className="text-[14px] font-light text-white/40 leading-relaxed mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist. Head back to the homepage or browse our services.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-lime text-brand-deepest text-[13px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
          >
            Back to home <ArrowRight size={13} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/50 text-[13px] font-medium rounded-full hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}

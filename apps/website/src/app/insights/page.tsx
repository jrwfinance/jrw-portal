import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { PageCTA } from '@/components/sections/PageCTA'
import { ARTICLES } from '@/data/articles'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Property finance insights from JRW Finance — market updates, lending strategy, and guides for investors and home buyers.',
}

const categories = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))]

export default function InsightsPage() {
  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 100% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-16">
          <AnimateIn>
            <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-5">
              Insights
            </p>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-5 balance max-w-3xl"
              style={{ fontSize: 'clamp(36px,5.5vw,76px)' }}
            >
              Property finance, clearly explained.
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] max-w-lg pretty"
              style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}
            >
              Market updates, lending strategy, and practical guides for investors and home buyers.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── ARTICLES GRID ─────────────────────────────────────────────── */}
      <section className="py-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <AnimateIn key={article.slug} delay={i * 0.05}>
                <Link
                  href={`/insights/${article.slug}`}
                  className="group flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all h-full"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-lime/70">
                      {article.category}
                    </span>
                    <span className="text-[11px] font-light text-white/25">{article.readTime}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <h2
                      className="font-display font-bold text-white leading-snug group-hover:text-brand-lime/90 transition-colors balance"
                      style={{ fontSize: 'clamp(16px,1.5vw,20px)' }}
                    >
                      {article.title}
                    </h2>
                    <p className="text-[13px] font-light text-white/40 leading-relaxed pretty line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
                    <span className="text-[12px] font-light text-white/25">{article.date}</span>
                    <span className="flex items-center gap-1 text-[12px] font-medium text-white/30 group-hover:text-brand-lime transition-colors">
                      Read <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>

          {/* Empty state hint for future articles */}
          {ARTICLES.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-white/20 text-[14px] font-light">Articles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <PageCTA
        heading="Question not answered here?"
        sub="Book a call and ask us directly. No article captures every situation."
      />
    </div>
  )
}

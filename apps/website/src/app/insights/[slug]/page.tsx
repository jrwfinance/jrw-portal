import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { PageCTA } from '@/components/sections/PageCTA'
import { ARTICLES, getArticle, getAllSlugs } from '@/data/articles'
import { BOOK_URL } from '@/lib/constants'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
  }
}

function renderBody(body: string) {
  return body.split('\n\n').map((block, i) => {
    if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
      return (
        <h3 key={i} className="font-display font-bold text-white text-[18px] leading-snug mt-8 mb-3">
          {block.slice(2, -2)}
        </h3>
      )
    }
    // Bold inline
    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-[15px] font-light text-white/55 leading-[1.85]">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-white/80 font-semibold">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const others = ARTICLES.filter(a => a.slug !== article.slug).slice(0, 2)

  return (
    <div className="bg-brand-deepest">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 80% 0%, rgba(223,231,119,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-20 pb-12">
          <AnimateIn>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8"
            >
              <ArrowLeft size={12} /> Back to Insights
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-lime/70">
                {article.category}
              </span>
              <span className="text-white/20 text-[11px]">&middot;</span>
              <span className="text-[11px] font-light text-white/25">{article.date}</span>
              <span className="text-white/20 text-[11px]">&middot;</span>
              <span className="text-[11px] font-light text-white/25">{article.readTime}</span>
            </div>
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-6 balance"
              style={{ fontSize: 'clamp(28px,4vw,56px)' }}
            >
              {article.title}
            </h1>
            <p
              className="text-white/50 font-light leading-[1.75] pretty"
              style={{ fontSize: 'clamp(15px,1.3vw,18px)' }}
            >
              {article.excerpt}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
          <AnimateIn>
            <div className="flex flex-col gap-5 max-w-2xl">
              {renderBody(article.body)}
            </div>
          </AnimateIn>

          {/* CTA strip */}
          <AnimateIn delay={0.1} className="mt-16 p-8 rounded-2xl bg-brand-lime/5 border border-brand-lime/15 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div>
              <p className="font-display font-bold text-white text-[17px] mb-1">Ready to act on this?</p>
              <p className="text-[13px] font-light text-white/45 leading-relaxed">Book a free call and we'll apply this to your specific situation.</p>
            </div>
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-lime text-brand-deepest text-[13px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all whitespace-nowrap flex-shrink-0"
            >
              Book a call <ArrowRight size={13} />
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ── MORE ARTICLES ─────────────────────────────────────────────── */}
      {others.length > 0 && (
        <section className="py-14 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <AnimateIn>
              <h2 className="font-display font-bold text-white text-[20px] mb-8">More from Insights</h2>
            </AnimateIn>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((a, i) => (
                <AnimateIn key={a.slug} delay={i * 0.06}>
                  <Link
                    href={`/insights/${a.slug}`}
                    className="group flex flex-col gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all h-full"
                  >
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-lime/60">
                      {a.category}
                    </span>
                    <h3 className="font-display font-bold text-white text-[15px] leading-snug group-hover:text-brand-lime/90 transition-colors balance">
                      {a.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.05]">
                      <span className="text-[11px] font-light text-white/25">{a.date}</span>
                      <ArrowRight size={12} className="text-white/25 group-hover:text-brand-lime transition-colors" />
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA />
    </div>
  )
}

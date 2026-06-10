'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { BOOK_URL } from '@/lib/constants'

const fmtAUD = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
const fmtPct = (n: number) => `${n.toFixed(1)}%`

// LMI estimator (indicative — actual LMI is insurer-table based)
function estimateLMI(loanAmount: number, lvr: number): number {
  if (lvr <= 80) return 0
  if (lvr <= 85) return loanAmount * 0.01
  if (lvr <= 90) return loanAmount * 0.018
  if (lvr <= 95) return loanAmount * 0.033
  return loanAmount * 0.045
}

export default function DepositPage() {
  const [price, setPrice] = useState(800000)
  const [depositPct, setDepositPct] = useState(20)

  const { deposit, loan, lvr, lmi, lmiCapitalisedLoan, totalRequired } = useMemo(() => {
    const deposit = Math.round(price * depositPct / 100)
    const loan = price - deposit
    const lvr = (loan / price) * 100
    const lmi = Math.round(estimateLMI(loan, lvr))
    const lmiCapitalisedLoan = loan + lmi
    const totalRequired = deposit + lmi
    return { deposit, loan, lvr, lmi, lmiCapitalisedLoan, totalRequired }
  }, [price, depositPct])

  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-[14px] font-light focus:outline-none focus:border-brand-lime/50 focus:bg-white/[0.06] transition-all"

  return (
    <div className="bg-brand-deepest min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <AnimateIn>
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8">
            <ArrowLeft size={12} /> All calculators
          </Link>
          <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-4">Calculator</p>
          <h1 className="font-display font-black text-white leading-[0.95] tracking-tight mb-3 balance" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            Deposit & LMI Calculator
          </h1>
          <p className="text-white/40 font-light text-[14px] leading-relaxed mb-12">
            See how your deposit size affects your LVR, LMI cost, and total funds required at settlement.
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Inputs */}
          <AnimateIn direction="left" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-white/40 tracking-wide">Purchase price</label>
              <input type="number" min={0} step={10000} value={price} onChange={e => setPrice(Number(e.target.value))} className={inputClass} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <label className="text-[12px] font-medium text-white/40 tracking-wide">Deposit percentage</label>
                <span className="text-[13px] font-bold text-brand-lime">{depositPct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={depositPct}
                onChange={e => setDepositPct(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-lime"
                style={{ background: `linear-gradient(to right, #dfe777 ${(depositPct - 5) / 35 * 100}%, rgba(255,255,255,0.1) ${(depositPct - 5) / 35 * 100}%)` }}
              />
              <div className="flex justify-between text-[11px] font-light text-white/20">
                <span>5% (min)</span>
                <span>20% (no LMI)</span>
                <span>40%</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[12px] font-light text-white/30 leading-relaxed">
                LMI (Lenders Mortgage Insurance) is a one-off premium paid when your deposit is below 20%. It protects the lender, not you, but can be capitalised into your loan. First home buyers using the First Home Guarantee can purchase at 5% with no LMI.
              </p>
            </div>
          </AnimateIn>

          {/* Results */}
          <AnimateIn direction="right" delay={0.1} className="flex flex-col gap-4">
            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-4">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Result</p>

              {[
                { label: 'Deposit', value: fmtAUD(deposit) },
                { label: 'Loan amount', value: fmtAUD(loan) },
                { label: 'LVR', value: fmtPct(lvr), highlight: lvr > 80 },
                { label: 'Estimated LMI', value: lmi > 0 ? fmtAUD(lmi) : 'None', dim: lmi === 0 },
              ].map(({ label, value, highlight, dim }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span className="text-[13px] font-light text-white/45">{label}</span>
                  <span className={`font-display font-bold text-[16px] ${highlight ? 'text-amber-400/80' : dim ? 'text-brand-lime' : 'text-white'}`}>
                    {value}
                  </span>
                </div>
              ))}

              <div className="h-px bg-white/[0.06]" />

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[14px] font-medium text-white/60">Total cash required</span>
                  <span className="font-display font-black text-brand-lime leading-none" style={{ fontSize: 'clamp(22px,3vw,34px)' }}>
                    {fmtAUD(totalRequired)}
                  </span>
                </div>
                <p className="text-[11px] font-light text-white/25 text-right">deposit + LMI (excl. stamp duty &amp; costs)</p>
              </div>

              {lmi > 0 && (
                <div className="pt-3 border-t border-white/[0.05]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[12px] font-light text-white/35">Loan if LMI capitalised</span>
                    <span className="font-display font-semibold text-white/60 text-[14px]">{fmtAUD(lmiCapitalisedLoan)}</span>
                  </div>
                </div>
              )}
            </div>

            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Discuss your deposit options <ArrowRight size={14} />
            </a>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

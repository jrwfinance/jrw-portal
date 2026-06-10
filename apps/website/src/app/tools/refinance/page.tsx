'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { BOOK_URL } from '@/lib/constants'

const fmtAUD = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

function monthlyRepayment(principal: number, annualRate: number, termYears: number) {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export default function RefinancePage() {
  const [balance, setBalance] = useState(550000)
  const [currentRate, setCurrentRate] = useState(6.5)
  const [newRate, setNewRate] = useState(5.9)
  const [remainingYears, setRemainingYears] = useState(25)
  const [exitCosts, setExitCosts] = useState(1500)
  const [newLenderCashback, setNewLenderCashback] = useState(2000)

  const result = useMemo(() => {
    const currentMonthly = monthlyRepayment(balance, currentRate, remainingYears)
    const newMonthly = monthlyRepayment(balance, newRate, remainingYears)
    const monthlySaving = currentMonthly - newMonthly
    const annualSaving = monthlySaving * 12
    const netCosts = Math.max(0, exitCosts - newLenderCashback)
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(netCosts / monthlySaving) : null
    const fiveYearSaving = monthlySaving * 60 - netCosts
    return { currentMonthly, newMonthly, monthlySaving, annualSaving, netCosts, breakEvenMonths, fiveYearSaving }
  }, [balance, currentRate, newRate, remainingYears, exitCosts, newLenderCashback])

  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-[14px] font-light focus:outline-none focus:border-brand-lime/50 focus:bg-white/[0.06] transition-all"
  const labelClass = "text-[12px] font-medium text-white/40 tracking-wide"

  return (
    <div className="bg-brand-deepest min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <AnimateIn>
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8">
            <ArrowLeft size={12} /> All calculators
          </Link>
          <p className="text-brand-lime text-[12px] font-semibold tracking-widest uppercase mb-4">Calculator</p>
          <h1 className="font-display font-black text-white leading-[0.95] tracking-tight mb-3 balance" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            Refinance Savings Calculator
          </h1>
          <p className="text-white/40 font-light text-[14px] leading-relaxed mb-12">
            Model the net saving and break-even timeline when switching to a lower rate.
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          <AnimateIn direction="left" className="flex flex-col gap-5">
            {[
              { label: 'Current loan balance', value: balance, set: setBalance, step: 10000, prefix: '$' },
              { label: 'Current interest rate (%)', value: currentRate, set: setCurrentRate, step: 0.1 },
              { label: 'New interest rate (%)', value: newRate, set: setNewRate, step: 0.1 },
              { label: 'Remaining loan term (years)', value: remainingYears, set: setRemainingYears, step: 1 },
              { label: 'Exit / discharge costs ($)', value: exitCosts, set: setExitCosts, step: 100 },
              { label: 'New lender cashback ($)', value: newLenderCashback, set: setNewLenderCashback, step: 500 },
            ].map(({ label, value, set, step }) => (
              <div key={label} className="flex flex-col gap-2">
                <label className={labelClass}>{label}</label>
                <input type="number" min={0} step={step} value={value} onChange={e => set(Number(e.target.value))} className={inputClass} />
              </div>
            ))}
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1} className="flex flex-col gap-4">
            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-4">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Result</p>
              {[
                { label: 'Current monthly repayment', value: fmtAUD(result.currentMonthly) },
                { label: 'New monthly repayment', value: fmtAUD(result.newMonthly) },
                { label: 'Net switch costs', value: result.netCosts > 0 ? fmtAUD(result.netCosts) : 'Covered by cashback' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span className="text-[13px] font-light text-white/45">{label}</span>
                  <span className="font-display font-bold text-white text-[16px]">{value}</span>
                </div>
              ))}

              <div className="h-px bg-white/[0.06]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[13px] font-light text-white/45">Monthly saving</span>
                <span className={`font-display font-bold text-[18px] ${result.monthlySaving > 0 ? 'text-brand-lime' : 'text-red-400/70'}`}>
                  {result.monthlySaving > 0 ? '+' : ''}{fmtAUD(result.monthlySaving)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] font-light text-white/45">Annual saving</span>
                <span className={`font-display font-bold text-[18px] ${result.annualSaving > 0 ? 'text-brand-lime' : 'text-red-400/70'}`}>
                  {result.annualSaving > 0 ? '+' : ''}{fmtAUD(result.annualSaving)}
                </span>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[14px] font-medium text-white/60">Break-even point</span>
                <span className="font-display font-black text-brand-lime leading-none" style={{ fontSize: 'clamp(20px,2.5vw,30px)' }}>
                  {result.breakEvenMonths ? `${result.breakEvenMonths} months` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] font-light text-white/45">5-year net saving</span>
                <span className={`font-display font-bold text-[17px] ${result.fiveYearSaving > 0 ? 'text-brand-lime' : 'text-red-400/70'}`}>
                  {fmtAUD(result.fiveYearSaving)}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[12px] font-light text-white/30 leading-relaxed">
                This does not account for fixed rate break costs, valuation fees, or legal fees beyond the exit cost input. For a full analysis including your actual break cost, book a review call.
              </p>
            </div>

            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Get a full refinance review <ArrowRight size={14} />
            </a>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

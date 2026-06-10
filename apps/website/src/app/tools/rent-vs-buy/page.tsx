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

export default function RentVsBuyPage() {
  const [purchasePrice, setPurchasePrice] = useState(900000)
  const [deposit, setDeposit] = useState(180000)
  const [interestRate, setInterestRate] = useState(6.2)
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [propertyGrowthPct, setPropertyGrowthPct] = useState(4)
  const [weeklyRent, setWeeklyRent] = useState(700)
  const [rentGrowthPct, setRentGrowthPct] = useState(3)
  const [horizonYears, setHorizonYears] = useState(10)

  const result = useMemo(() => {
    const loanAmount = purchasePrice - deposit
    const monthlyMortgage = monthlyRepayment(loanAmount, interestRate, loanTermYears)
    const annualMortgage = monthlyMortgage * 12

    // Property value at horizon
    const futurePropertyValue = purchasePrice * Math.pow(1 + propertyGrowthPct / 100, horizonYears)
    // Rough equity (ignoring principal paydown detail)
    const principalPaidDown = loanAmount - (loanAmount * Math.pow(1 + interestRate / 100 / 12, loanTermYears * 12) /
      ((Math.pow(1 + interestRate / 100 / 12, loanTermYears * 12) - 1) /
        (Math.pow(1 + interestRate / 100 / 12, horizonYears * 12) - 1)))
    const equity = futurePropertyValue - (loanAmount - principalPaidDown)

    // Total buy cost over horizon
    const stampDuty = purchasePrice * 0.04
    const buyingCosts = purchasePrice * 0.015
    const totalMortgagePayments = annualMortgage * horizonYears
    const ongoingCosts = purchasePrice * 0.01 * horizonYears // rates, insurance ~1%/yr
    const totalBuyCost = deposit + stampDuty + buyingCosts + totalMortgagePayments + ongoingCosts

    // Total rent cost over horizon
    let totalRentCost = 0
    let currentWeeklyRent = weeklyRent
    for (let y = 0; y < horizonYears; y++) {
      totalRentCost += currentWeeklyRent * 52
      currentWeeklyRent *= (1 + rentGrowthPct / 100)
    }

    // Net position for buyer: equity built - total costs + deposit (recovered)
    const buyNetPosition = equity - totalBuyCost + deposit
    const rentNetPosition = -totalRentCost

    return {
      monthlyMortgage,
      futurePropertyValue,
      equity,
      totalBuyCost,
      totalRentCost,
      buyNetPosition,
      rentNetPosition,
      buyAhead: buyNetPosition > rentNetPosition,
      difference: Math.abs(buyNetPosition - rentNetPosition),
    }
  }, [purchasePrice, deposit, interestRate, loanTermYears, propertyGrowthPct, weeklyRent, rentGrowthPct, horizonYears])

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
            Rent vs Buy Calculator
          </h1>
          <p className="text-white/40 font-light text-[14px] leading-relaxed mb-12">
            Compare the financial outcome of renting versus buying over a set time horizon. Simplified model — does not capture all variables (tax, opportunity cost of deposit capital, etc.).
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          <AnimateIn direction="left" className="flex flex-col gap-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Buying assumptions</p>
            {[
              { label: 'Purchase price', value: purchasePrice, set: setPurchasePrice, step: 10000 },
              { label: 'Deposit', value: deposit, set: setDeposit, step: 10000 },
              { label: 'Interest rate (%)', value: interestRate, set: setInterestRate, step: 0.1 },
              { label: 'Loan term (years)', value: loanTermYears, set: setLoanTermYears, step: 1 },
              { label: 'Annual property growth (%)', value: propertyGrowthPct, set: setPropertyGrowthPct, step: 0.5 },
            ].map(({ label, value, set, step }) => (
              <div key={label} className="flex flex-col gap-2">
                <label className={labelClass}>{label}</label>
                <input type="number" min={0} step={step} value={value} onChange={e => set(Number(e.target.value))} className={inputClass} />
              </div>
            ))}
            <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25 mt-2">Renting assumptions</p>
            {[
              { label: 'Weekly rent ($)', value: weeklyRent, set: setWeeklyRent, step: 50 },
              { label: 'Annual rent growth (%)', value: rentGrowthPct, set: setRentGrowthPct, step: 0.5 },
            ].map(({ label, value, set, step }) => (
              <div key={label} className="flex flex-col gap-2">
                <label className={labelClass}>{label}</label>
                <input type="number" min={0} step={step} value={value} onChange={e => set(Number(e.target.value))} className={inputClass} />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Time horizon (years)</label>
              <input type="number" min={1} max={30} step={1} value={horizonYears} onChange={e => setHorizonYears(Number(e.target.value))} className={inputClass} />
            </div>
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1} className="flex flex-col gap-4">
            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-4">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Over {horizonYears} years</p>

              {[
                { label: 'Monthly mortgage repayment', value: fmtAUD(result.monthlyMortgage) },
                { label: `Property value in ${horizonYears} yrs`, value: fmtAUD(result.futurePropertyValue) },
                { label: 'Estimated equity built', value: fmtAUD(result.equity) },
                { label: 'Total buy costs (all-in)', value: fmtAUD(result.totalBuyCost) },
                { label: 'Total rent paid', value: fmtAUD(result.totalRentCost) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span className="text-[13px] font-light text-white/45">{label}</span>
                  <span className="font-display font-bold text-white text-[15px]">{value}</span>
                </div>
              ))}

              <div className="h-px bg-white/[0.06]" />

              <div className="flex flex-col gap-2">
                <div className={`p-4 rounded-xl ${result.buyAhead ? 'bg-brand-lime/10 border border-brand-lime/20' : 'bg-amber-400/10 border border-amber-400/20'}`}>
                  <p className={`font-display font-bold text-[15px] mb-1 ${result.buyAhead ? 'text-brand-lime' : 'text-amber-400/80'}`}>
                    {result.buyAhead ? 'Buying is ahead' : 'Renting is ahead'} by {fmtAUD(result.difference)}
                  </p>
                  <p className="text-[11px] font-light text-white/30 leading-relaxed">
                    Based on your inputs after {horizonYears} years. Assumes {propertyGrowthPct}% annual property growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[12px] font-light text-white/30 leading-relaxed">
                This model is simplified. It excludes: investment returns on deposit capital, tax benefits of negative gearing, depreciation, CGT on sale, and transaction costs on exit. For a complete picture, book a strategy call.
              </p>
            </div>

            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Talk through the decision <ArrowRight size={14} />
            </a>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

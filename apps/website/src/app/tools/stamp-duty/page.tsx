'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { BOOK_URL } from '@/lib/constants'

type State = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
type BuyerType = 'owner' | 'investor' | 'first-home'

// Simplified duty calculations — indicative only
function calcStampDuty(price: number, state: State, buyerType: BuyerType): { duty: number; concession: number; note: string } {
  let duty = 0
  let concession = 0
  let note = ''

  if (state === 'NSW') {
    // NSW general scale
    if (price <= 14000) duty = price * 0.0125
    else if (price <= 31000) duty = 175 + (price - 14000) * 0.015
    else if (price <= 83000) duty = 430 + (price - 31000) * 0.0175
    else if (price <= 310000) duty = 1340 + (price - 83000) * 0.035
    else if (price <= 1033000) duty = 9285 + (price - 310000) * 0.045
    else duty = 41820 + (price - 1033000) * 0.055

    if (buyerType === 'first-home') {
      if (price <= 800000) { concession = duty; note = 'Full exemption (new/existing homes ≤$800k)' }
      else if (price <= 1000000) { concession = duty * ((1000000 - price) / 200000); note = 'Partial concession ($800k–$1m)' }
    }
  } else if (state === 'VIC') {
    if (price <= 25000) duty = price * 0.014
    else if (price <= 130000) duty = 350 + (price - 25000) * 0.024
    else if (price <= 440000) duty = 2870 + (price - 130000) * 0.06
    else if (price <= 960000) duty = 21470 + (price - 440000) * 0.06
    else duty = 52670 + (price - 960000) * 0.065

    if (buyerType === 'first-home') {
      if (price <= 600000) { concession = duty; note = 'Full exemption (≤$600k)' }
      else if (price <= 750000) { concession = duty * ((750000 - price) / 150000); note = 'Partial concession ($600k–$750k)' }
    }
  } else if (state === 'QLD') {
    if (price <= 5000) duty = 0
    else if (price <= 75000) duty = (price - 5000) * 0.015
    else if (price <= 540000) duty = 1050 + (price - 75000) * 0.035
    else if (price <= 1000000) duty = 17325 + (price - 540000) * 0.045
    else duty = 38025 + (price - 1000000) * 0.0575

    if (buyerType === 'first-home') {
      if (price <= 500000) { concession = duty; note = 'Full concession (≤$500k)' }
      else if (price <= 550000) { concession = duty * ((550000 - price) / 50000); note = 'Partial concession ($500k–$550k)' }
    }
  } else {
    // Simplified flat scale for other states
    duty = price * 0.04
    note = 'Indicative only — varies by property type'
  }

  return { duty: Math.round(Math.max(0, duty)), concession: Math.round(concession), note }
}

const fmtAUD = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

const STATES: State[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function StampDutyPage() {
  const [price, setPrice] = useState(750000)
  const [state, setState] = useState<State>('NSW')
  const [buyerType, setBuyerType] = useState<BuyerType>('owner')

  const result = useMemo(() => calcStampDuty(price, state, buyerType), [price, state, buyerType])
  const netDuty = result.duty - result.concession

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
            Stamp Duty Calculator
          </h1>
          <p className="text-white/40 font-light text-[14px] leading-relaxed mb-12">
            Indicative stamp duty for Australian residential property. Includes first home buyer concessions for NSW, VIC, and QLD.
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Inputs */}
          <AnimateIn direction="left" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-white/40 tracking-wide">Purchase price</label>
              <input
                type="number"
                min={0}
                step={10000}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-white/40 tracking-wide">State / Territory</label>
              <select
                value={state}
                onChange={e => setState(e.target.value as State)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-white/40 tracking-wide">Buyer type</label>
              <div className="flex flex-col gap-2">
                {([['owner', 'Owner-occupier'], ['investor', 'Investor'], ['first-home', 'First home buyer']] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setBuyerType(v)}
                    className={`px-4 py-3 rounded-xl text-[13px] font-medium border text-left transition-all ${
                      buyerType === v
                        ? 'bg-brand-lime/10 text-brand-lime border-brand-lime/30'
                        : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* Results */}
          <AnimateIn direction="right" delay={0.1} className="flex flex-col gap-4">
            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-5">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25">Result</p>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-light text-white/45">Stamp duty</span>
                  <span className="font-display font-bold text-white text-[17px]">{fmtAUD(result.duty)}</span>
                </div>
                {result.concession > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[13px] font-light text-brand-lime/60">Concession / exemption</span>
                    <span className="font-display font-bold text-brand-lime text-[17px]">-{fmtAUD(result.concession)}</span>
                  </div>
                )}
                <div className="h-px bg-white/[0.06]" />
                <div className="flex justify-between items-baseline">
                  <span className="text-[14px] font-medium text-white/60">Net duty payable</span>
                  <span className="font-display font-black text-brand-lime leading-none" style={{ fontSize: 'clamp(22px,3vw,34px)' }}>
                    {fmtAUD(netDuty)}
                  </span>
                </div>
              </div>

              {result.note && (
                <p className="text-[11px] font-light text-brand-lime/50 leading-relaxed border-t border-white/[0.05] pt-4">
                  {result.note}
                </p>
              )}
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[12px] font-light text-white/30 leading-relaxed">
                These figures are indicative only and do not account for surcharges (foreign buyers, additional dwellings), off-the-plan concessions, or other variations. Confirm with your conveyancer before exchanging contracts.
              </p>
            </div>

            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-lime text-brand-deepest text-[14px] font-bold rounded-full hover:bg-brand-lime-dim active:scale-[0.97] transition-all"
            >
              Get exact figures for your purchase <ArrowRight size={14} />
            </a>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

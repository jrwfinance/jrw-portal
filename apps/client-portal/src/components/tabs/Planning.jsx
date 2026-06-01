import { useState, useRef, useEffect } from 'react'
import { fmt } from '@/lib/utils'
import { Card, CardTitle } from '@/components/ui/Card'

function useChart(ref, config, deps) {
  useEffect(() => {
    if (!ref.current) return
    let chart
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chart) chart.destroy()
      chart = new Chart(ref.current, config())
    })
    return () => { if (chart) chart.destroy() }
  }, deps)
}

export function Planning({ data }) {
  const { properties, loans } = data
  const HORIZON = 10
  const years = Array.from({ length: HORIZON + 1 }, (_, i) => i === 0 ? 'Now' : `Yr ${i}`)

  // Scenario state — per property editable value + repayment
  const initScenario = () => Object.fromEntries(
    properties.map(p => {
      const loan = loans.find(l => l.property_id === p.id)
      return [p.id, { value: p.estimated_value || 0, repayment: loan?.monthly_repayment || 0 }]
    })
  )
  const [scenario, setScenario] = useState(initScenario)
  const [growthRate, setGrowthRate]   = useState(7)
  const [proposedRepay, setProposedRepay] = useState(0)
  const [lumpSum, setLumpSum]         = useState(0)

  useEffect(() => { setScenario(initScenario()) }, [properties.length, loans.length])

  const setSc = (id, field, val) => setScenario(s => ({ ...s, [id]: { ...s[id], [field]: val } }))

  // Derived totals
  const totalValue   = properties.reduce((s, p) => s + (scenario[p.id]?.value || 0), 0)
  const totalOwing   = loans.reduce((s, l) => s + (l.loan_balance || 0), 0)
  const totalEquity  = totalValue - totalOwing
  const totalRepay   = properties.reduce((s, p) => s + (scenario[p.id]?.repayment || 0), 0)
  const avgRate      = loans.length ? loans.reduce((s, l) => s + (l.interest_rate || 0), 0) / loans.length : 6

  // Projection data
  const projData = () => {
    const rateVal = avgRate / 100 / 12
    function projectLoan(bal, monthly, extra, months) {
      for (let m = 0; m < months; m++) {
        const interest = bal * rateVal
        const principal = Math.max(0, monthly - interest)
        bal = Math.max(0, bal - principal)
        if (m % 12 === 11) bal = Math.max(0, bal - extra)
      }
      return bal
    }
    const vals = [], baseEqs = [], propEqs = [], baseLoans = []
    let v = totalValue
    const gr = 1 + growthRate / 100
    for (let i = 0; i <= HORIZON; i++) {
      vals.push(Math.round(v))
      const bl = projectLoan(totalOwing, totalRepay || totalOwing * 0.005, 0, i * 12)
      const pl = projectLoan(totalOwing, proposedRepay || totalRepay || totalOwing * 0.005, lumpSum, i * 12)
      baseLoans.push(Math.round(bl))
      baseEqs.push(Math.round(v - bl))
      propEqs.push(Math.round(v - pl))
      v *= gr
    }
    return { vals, baseEqs, propEqs, baseLoans }
  }

  const chartRef = useRef()
  const donutRef = useRef()
  const proj = projData()

  useChart(chartRef, () => ({
    type: 'line',
    data: {
      labels: years,
      datasets: [
        { label: 'Portfolio value',   data: proj.vals,     borderColor:'#2e3105', backgroundColor:'rgba(46,49,5,0.05)', borderWidth:2.5, fill:true, tension:0.35, pointRadius:2 },
        { label: 'Equity (current)',  data: proj.baseEqs,  borderColor:'#a8b87a', borderWidth:1.8, borderDash:[4,3], fill:false, tension:0.35, pointRadius:2 },
        { label: 'Equity (proposed)', data: proj.propEqs,  borderColor:'#3B6D11', backgroundColor:'rgba(59,109,17,0.06)', borderWidth:2.2, fill:false, tension:0.35, pointRadius:2 },
        { label: 'Debt',              data: proj.baseLoans, borderColor:'#c8d060', borderWidth:1.5, borderDash:[2,2], fill:false, tension:0.35, pointRadius:2 },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ display:false }, tooltip:{ callbacks:{ label: c => '$' + (c.raw/1000000).toFixed(2) + 'M' } } },
      scales: {
        y: { ticks:{ callback: v => '$'+(v/1000000).toFixed(1)+'M', font:{size:9}, color:'#888' }, grid:{color:'rgba(0,0,0,0.05)'}, border:{display:false}, min:0 },
        x: { ticks:{ font:{size:9}, color:'#888' }, grid:{display:false}, border:{display:false} }
      }
    }
  }), [JSON.stringify(proj), growthRate])

  useChart(donutRef, () => ({
    type: 'doughnut',
    data: {
      labels: ['Equity', 'Debt'],
      datasets: [{ data:[Math.max(0,totalEquity), totalOwing], backgroundColor:['#2e3105','#dfe777'], borderWidth:0, hoverOffset:3 }]
    },
    options: { responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => fmt(c.raw) } } } }
  }), [totalEquity, totalOwing])

  if (properties.length === 0) return (
    <div className="animate-fade-up">
      <div className="mb-5"><h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Planning</h1></div>
      <Card className="text-center py-12 text-gray-400 text-sm">Add properties to run scenarios.</Card>
    </div>
  )

  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Planning</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Adjust values below to model different scenarios.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[['Portfolio value',fmt(totalValue)],['Total equity',fmt(totalEquity)],['Avg rate',`${avgRate.toFixed(2)}%`]].map(([l,v])=>(
          <div key={l} className="bg-gray-50 rounded-lg px-3 py-2.5">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{l}</div>
            <div className="text-[16px] font-medium text-gray-800">{v}</div>
          </div>
        ))}
      </div>

      {/* Per-property scenario cards */}
      {properties.map(p => {
        const sc = scenario[p.id] || { value: p.estimated_value||0, repayment: 0 }
        const loan = loans.find(l => l.property_id === p.id)
        const equity = sc.value - (loan?.loan_balance || 0)
        return (
          <Card key={p.id} className="mb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold text-gray-800">{p.address}</div>
              <span className="text-[10px] text-gray-400">{p.suburb}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-50 rounded-lg p-2.5 col-span-2">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Est. value</div>
                <input type="number" value={sc.value} onChange={e=>setSc(p.id,'value',+e.target.value)}
                  className="w-full text-[14px] font-semibold text-gray-800 bg-transparent border-none outline-none"/>
                <div className="text-[9px] text-gray-400 mt-0.5">What-if value</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Equity</div>
                <div className={`text-[14px] font-semibold ${equity>=0?'text-green-700':'text-red-600'}`}>{fmt(equity)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Repayment</div>
                <input type="number" value={sc.repayment} onChange={e=>setSc(p.id,'repayment',+e.target.value)}
                  className="w-full text-[14px] font-semibold text-gray-800 bg-transparent border-none outline-none"/>
                <div className="text-[9px] text-gray-400 mt-0.5">$/month</div>
              </div>
            </div>
          </Card>
        )
      })}

      {/* Projection inputs */}
      <Card className="mb-4">
        <CardTitle className="mb-3">Projection settings</CardTitle>
        <div className="grid grid-cols-3 gap-3">
          {[['Growth rate %','growthRate',growthRate,setGrowthRate],['Proposed repayment','proposedRepay',proposedRepay,setProposedRepay],['Annual lump sum','lumpSum',lumpSum,setLumpSum]].map(([lbl,key,val,setter])=>(
            <div key={key}>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">{lbl}</label>
              <input type="number" value={val} onChange={e=>setter(+e.target.value)}
                className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50"/>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="col-span-2">
          <CardTitle className="mb-3">10-year equity projection</CardTitle>
          <div style={{height:200}}><canvas ref={chartRef}/></div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[['Portfolio value','#2e3105'],['Equity (current)','#a8b87a'],['Equity (proposed)','#3B6D11'],['Debt','#c8d060']].map(([l,c])=>(
              <div key={l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{background:c}}/><span className="text-[10px] text-gray-500">{l}</span></div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle className="mb-3">Portfolio split</CardTitle>
          <div style={{height:140}}><canvas ref={donutRef}/></div>
          <div className="mt-3 space-y-1.5">
            {[['Equity',totalEquity,'#2e3105'],['Debt',totalOwing,'#dfe777']].map(([l,v,c])=>(
              <div key={l} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:c}}/><span className="text-[10px] text-gray-500">{l}</span></div>
                <span className="text-[11px] font-medium text-gray-700">{fmt(v)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmt, fmtDate, parseCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

function EditField({ label, value, onSave, type='text' }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-[11px] text-gray-400 w-32 flex-shrink-0">{label}</span>
      <input type={type} value={v} onChange={e=>setV(e.target.value)}
        onBlur={()=>onSave(v)}
        className="flex-1 text-[12px] text-gray-800 font-medium text-right bg-transparent border-none outline-none focus:bg-gray-50 focus:px-2 rounded transition-all"/>
    </div>
  )
}

export function Portfolio({ client, props, loans, isDemo, onRefresh }) {
  const { show: toast } = useToast()

  async function saveProp(id, field, value) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    const { error } = await supabase.from('properties').update({ [field]: value }).eq('id', id)
    if (error) toast('Save failed', 'error')
    else { toast('Saved'); onRefresh() }
  }

  async function saveLoan(id, field, value) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    const { error } = await supabase.from('loans').update({ [field]: value }).eq('id', id)
    if (error) toast('Save failed', 'error')
    else { toast('Saved'); onRefresh() }
  }

  async function deleteProp(id) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    if (!confirm('Delete this property?')) return
    await supabase.from('properties').delete().eq('id', id)
    toast('Property deleted'); onRefresh()
  }

  async function deleteLoan(id) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    if (!confirm('Delete this loan?')) return
    await supabase.from('loans').delete().eq('id', id)
    toast('Loan deleted'); onRefresh()
  }

  if (props.length === 0) return <Card className="text-center py-12 text-gray-400 text-sm">No properties yet.</Card>

  return (
    <div className="space-y-4 animate-fade-up">
      {props.map(p => {
        const loan = loans.find(l=>l.property_id===p.id)
        const eq = (p.estimated_value||0)-(loan?.loan_balance||0)
        return (
          <Card key={p.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[13px] font-semibold text-gray-800">{p.address}</div>
                <div className="text-[11px] text-gray-400">{p.suburb} {p.state} {p.postcode}</div>
              </div>
              <Badge variant={p.ownership_type==='PPOR'?'green':'amber'}>{p.ownership_type||'PPOR'}</Badge>
            </div>
            <EditField label="Est. value" value={fmt(p.estimated_value)} onSave={v=>saveProp(p.id,'estimated_value',parseCurrency(v))}/>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="text-[11px] text-gray-400 w-32">Equity</span>
              <span className="text-[12px] font-semibold text-green-700">{fmt(eq)}</span>
            </div>
            {p.weekly_rent && <EditField label="Weekly rent" value={fmt(p.weekly_rent)} onSave={v=>saveProp(p.id,'weekly_rent',parseCurrency(v))}/>}

            {loan ? (
              <div className="mt-3 bg-gray-50 rounded-xl p-3">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Linked loan</div>
                <EditField label="Lender" value={loan.lender} onSave={v=>saveLoan(loan.id,'lender',v)}/>
                <EditField label="Balance" value={fmt(loan.loan_balance)} onSave={v=>saveLoan(loan.id,'loan_balance',parseCurrency(v))}/>
                <EditField label="Rate" value={`${loan.interest_rate}%`} onSave={v=>saveLoan(loan.id,'interest_rate',parseFloat(v))}/>
                <EditField label="Monthly repayment" value={fmt(loan.monthly_repayment)} onSave={v=>saveLoan(loan.id,'monthly_repayment',parseCurrency(v))}/>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-[11px] text-gray-400 w-32">Rate type</span>
                  <select value={loan.rate_type} onChange={e=>saveLoan(loan.id,'rate_type',e.target.value)}
                    className="text-[12px] text-gray-800 font-medium bg-transparent border-none outline-none text-right">
                    <option value="variable">Variable</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                {loan.rate_type==='fixed' && <EditField label="Fixed expiry" value={loan.fixed_expiry_date||''} onSave={v=>saveLoan(loan.id,'fixed_expiry_date',v)} type="date"/>}
                <EditField label="Loan type" value={loan.loan_type} onSave={v=>saveLoan(loan.id,'loan_type',v)}/>
                <EditField label="LVR" value={`${loan.lvr||''}%`} onSave={v=>saveLoan(loan.id,'lvr',parseFloat(v))}/>
                <button onClick={()=>deleteLoan(loan.id)} className="mt-2 text-[10px] text-red-400 hover:text-red-600 transition-colors">Delete loan</button>
              </div>
            ) : <p className="text-[11px] text-gray-400 mt-2">No loan linked.</p>}

            <button onClick={()=>deleteProp(p.id)} className="mt-3 text-[10px] text-gray-300 hover:text-red-400 transition-colors">Delete property</button>
          </Card>
        )
      })}
    </div>
  )
}
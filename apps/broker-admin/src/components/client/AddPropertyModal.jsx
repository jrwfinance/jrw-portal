import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

export function AddPropertyModal({ client, broker, onClose, onCreated }) {
  const [prop, setProp] = useState({ address:'', suburb:'', state:'QLD', postcode:'', ownership_type:'PPOR', estimated_value:'' })
  const [loan, setLoan] = useState({ lender:'', loan_balance:'', interest_rate:'', rate_type:'variable', loan_type:'P&I', monthly_repayment:'', lvr:'' })
  const [addLoan, setAddLoan] = useState(true)
  const [loading, setLoading] = useState(false)
  const { show: toast } = useToast()
  const sp = (k,v) => setProp(f=>({...f,[k]:v}))
  const sl = (k,v) => setLoan(f=>({...f,[k]:v}))

  async function submit(e) {
    e.preventDefault(); setLoading(true)
    const { data: newProp, error: pErr } = await supabase.from('properties')
      .insert({ ...prop, estimated_value: parseFloat(prop.estimated_value)||0, client_id: client.id, broker_id: broker?.id })
      .select().single()
    if (pErr) { toast('Failed to create property', 'error'); setLoading(false); return }
    if (addLoan && loan.lender) {
      await supabase.from('loans').insert({
        ...loan,
        loan_balance: parseFloat(loan.loan_balance)||0,
        interest_rate: parseFloat(loan.interest_rate)||0,
        monthly_repayment: parseFloat(loan.monthly_repayment)||0,
        lvr: parseFloat(loan.lvr)||null,
        property_id: newProp.id, client_id: client.id, broker_id: broker?.id
      })
    }
    toast('Property added'); onCreated(); onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl my-4">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-4">Add property</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Address</label>
            <input required value={prop.address} onChange={e=>sp('address',e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['Suburb','suburb'],['State','state'],['Postcode','postcode']].map(([lbl,k])=>(
              <div key={k}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                <input value={prop[k]} onChange={e=>sp(k,e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Type</label>
              <select value={prop.ownership_type} onChange={e=>sp('ownership_type',e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark">
                <option value="PPOR">PPOR</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Est. value ($)</label>
              <input type="number" value={prop.estimated_value} onChange={e=>sp('estimated_value',e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-gray-600 pt-1">
            <input type="checkbox" checked={addLoan} onChange={e=>setAddLoan(e.target.checked)} className="accent-brand-dark"/>
            Add linked loan
          </label>

          {addLoan && (
            <div className="border border-gray-100 rounded-xl p-3 space-y-2.5 bg-gray-50">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Loan details</div>
              {[['Lender','lender'],['Balance ($)','loan_balance'],['Rate (%)','interest_rate'],['Monthly repayment ($)','monthly_repayment'],['LVR (%)','lvr']].map(([lbl,k])=>(
                <div key={k}>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                  <input value={loan[k]} onChange={e=>sl(k,e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-white"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {[['Rate type','rate_type',['variable','fixed']],['Loan type','loan_type',['P&I','IO']]].map(([lbl,k,opts])=>(
                  <div key={k}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                    <select value={loan[k]} onChange={e=>sl(k,e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-white">
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-brand-dark text-brand-lime rounded-lg text-[13px] font-semibold hover:bg-brand-darker disabled:opacity-50">
              {loading ? 'Saving…' : 'Add property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
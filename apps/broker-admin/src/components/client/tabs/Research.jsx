import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmt } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Search, Plus, ExternalLink } from 'lucide-react'

const STATUSES = ['Watching','Shortlisted','Inspected','Offer made','Purchased','Passed']

export function Research({ client, broker, isDemo, onRefresh, research }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ address:'', property_type:'', asking_price:'', estimated_yield:'', suburb_growth_5yr:'', listing_url:'', notes:'', status:'Watching' })
  const [saving, setSaving] = useState(false)
  const { show: toast } = useToast()
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function addResearch(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode'); return }
    setSaving(true)
    const { error } = await supabase.from('research').insert({
      ...form,
      asking_price: form.asking_price ? parseFloat(form.asking_price) : null,
      estimated_yield: form.estimated_yield ? parseFloat(form.estimated_yield) : null,
      client_id: client.id, broker_id: broker?.id
    })
    if (error) { toast('Failed to add', 'error'); setSaving(false); return }
    toast('Research property added')
    setForm({ address:'', property_type:'', asking_price:'', estimated_yield:'', suburb_growth_5yr:'', listing_url:'', notes:'', status:'Watching' })
    setShowAdd(false); onRefresh(); setSaving(false)
  }

  async function updateStatus(id, status) {
    if (isDemo) { toast('Demo mode'); return }
    await supabase.from('research').update({ status }).eq('id', id)
    onRefresh()
  }

  async function deleteResearch(id) {
    if (isDemo) { toast('Demo mode'); return }
    await supabase.from('research').delete().eq('id', id)
    toast('Removed'); onRefresh()
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-gray-700">{research.length} propert{research.length!==1?'ies':'y'} researched</span>
        {!isDemo && (
          <button onClick={() => setShowAdd(s=>!s)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark text-brand-lime text-[11px] font-semibold rounded-lg hover:bg-brand-darker transition-colors">
            <Plus size={12}/> Add property
          </button>
        )}
      </div>

      {showAdd && (
        <Card className="mb-4 border-brand-dark/20">
          <div className="text-[11px] font-semibold text-gray-700 mb-3">Add research property</div>
          <form onSubmit={addResearch} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Address *</label>
              <input required value={form.address} onChange={e=>set('address',e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Type','property_type'],['Asking price ($)','asking_price'],['Est. yield (%)','estimated_yield'],['5yr growth','suburb_growth_5yr']].map(([lbl,k])=>(
                <div key={k}>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                  <input value={form[k]} onChange={e=>set(k,e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Listing URL</label>
              <input type="url" value={form.listing_url} onChange={e=>set('listing_url',e.target.value)} placeholder="https://"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Notes</label>
              <textarea rows={2} value={form.notes} onChange={e=>set('notes',e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark resize-none"/>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker disabled:opacity-50">
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {research.length === 0 && !showAdd && <Card className="text-center py-12 text-gray-400 text-sm">No research properties yet.</Card>}

      {research.map(r => (
        <Card key={r.id} className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Search size={13} className="text-brand-dark"/>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-gray-800">{r.address}</div>
                {r.property_type && <div className="text-[11px] text-gray-400">{r.property_type}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select value={r.status||'Watching'} onChange={e=>updateStatus(r.id,e.target.value)}
                className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
              <button onClick={()=>deleteResearch(r.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            {r.asking_price && <span>Price: <strong className="text-gray-700">{fmt(r.asking_price)}</strong></span>}
            {r.estimated_yield && <span>Yield: <strong className="text-gray-700">{r.estimated_yield}%</strong></span>}
            {r.suburb_growth_5yr && <span>Growth: <strong className="text-green-600">{r.suburb_growth_5yr}</strong></span>}
          </div>
          {r.notes && <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{r.notes}</p>}
          {r.listing_url && (
            <a href={r.listing_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-brand-dark hover:underline mt-2">
              <ExternalLink size={11}/> View listing
            </a>
          )}
        </Card>
      ))}
    </div>
  )
}
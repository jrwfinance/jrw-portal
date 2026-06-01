import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'

export function ClientProfile({ client, isDemo, onRefresh }) {
  const [form, setForm] = useState({
    first_name:          client.first_name || '',
    last_name:           client.last_name  || '',
    mobile:              client.mobile     || '',
    client_since:        client.client_since || '',
    residential_address: client.residential_address || '',
  })
  const [saving, setSaving] = useState(false)
  const { show: toast } = useToast()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setSaving(true)
    const { error } = await supabase.from('clients').update(form).eq('id', client.id)
    if (error) toast('Save failed', 'error')
    else { toast('Profile saved'); onRefresh() }
    setSaving(false)
  }

  return (
    <div className="animate-fade-up max-w-lg">
      <h2 className="text-[13px] font-semibold text-gray-800 mb-1">Client Profile</h2>
      <p className="text-[11px] text-gray-400 mb-4">Edit this client's details.</p>
      <Card>
        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['First name','first_name','text'],['Last name','last_name','text'],['Mobile','mobile','tel'],['Year joined','client_since','number']].map(([lbl,key,type])=>(
              <div key={key}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Email <span className="normal-case font-normal text-gray-300">(read-only)</span>
            </label>
            <input value={client.email||''} readOnly className="w-full px-3 py-2 border border-gray-100 rounded-lg text-[12px] bg-gray-50 text-gray-400 cursor-not-allowed"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Residential address</label>
            <input value={form.residential_address} onChange={e=>set('residential_address',e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
          </div>
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </Card>
    </div>
  )
}
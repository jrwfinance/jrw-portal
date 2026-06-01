import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

export function CreateClientModal({ broker, onClose, onCreated }) {
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', mobile:'', client_since: new Date().getFullYear() })
  const [loading, setLoading] = useState(false)
  const { show: toast } = useToast()
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    // Call the create-client edge function
    const { data: { session } } = await supabase.auth.getSession()
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://amhevyrewmlmwxncujmp.supabase.co'}/functions/v1/create-client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ ...form, broker_id: broker?.id }),
      })
      const result = await res.json()
      if (!res.ok) { toast(result.error || 'Failed to create client', 'error'); setLoading(false); return }
      toast(`Client created — invite sent to ${form.email}`)
      onCreated()
      onClose()
    } catch(err) {
      toast('Network error', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-1">New client</h3>
        <p className="text-[11px] text-gray-400 mb-4">An invite link will be sent to the client's email.</p>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['First name','first_name'],['Last name','last_name']].map(([lbl,k])=>(
              <div key={k}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                <input required value={form[k]} onChange={e=>set(k,e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e=>set('email',e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Mobile</label>
              <input value={form.mobile} onChange={e=>set('mobile',e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Client since</label>
              <input type="number" value={form.client_since} onChange={e=>set('client_since',+e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-brand-dark text-brand-lime rounded-lg text-[13px] font-semibold hover:bg-brand-darker disabled:opacity-50">
              {loading ? 'Creating…' : 'Create & send invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
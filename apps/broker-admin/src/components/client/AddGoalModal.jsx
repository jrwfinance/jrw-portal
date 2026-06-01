import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

export function AddGoalModal({ client, broker, onClose, onCreated }) {
  const [form, setForm] = useState({ title:'', what:'', why:'', when_target:'', where_location:'', how:'' })
  const [loading, setLoading] = useState(false)
  const { show: toast } = useToast()
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function submit(e) {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.from('goals').insert({ ...form, client_id: client.id, broker_id: broker?.id, status:'Planning', progress:0 })
    if (error) { toast('Failed to add goal', 'error'); setLoading(false); return }
    toast('Goal added'); onCreated(); onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-4">Add goal</h3>
        <form onSubmit={submit} className="space-y-3">
          {[['Title (short label)','title',true],['What (the goal)','what',true],['Why','why',false],['When (target timeline)','when_target',false],['Where (location if relevant)','where_location',false],['How (action plan)','how',false]].map(([lbl,k,req])=>(
            <div key={k}>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
              <input required={req} value={form[k]} onChange={e=>set(k,e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark"/>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-brand-dark text-brand-lime rounded-lg text-[13px] font-semibold hover:bg-brand-darker disabled:opacity-50">
              {loading ? 'Saving…' : 'Add goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
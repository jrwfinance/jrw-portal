import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmtDate } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { Send } from 'lucide-react'

export function Notes({ client, notes, broker, isDemo, onRefresh }) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const { show: toast } = useToast()
  const sorted = [...notes].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at))

  async function send(e) {
    e.preventDefault()
    if (!body.trim()) return
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setSending(true)
    const { error } = await supabase.from('notes').insert({
      client_id: client.id, body: body.trim(), is_broker_note: true,
      author_name: broker?.name || 'Josh Weiler', category: 'General'
    })
    if (error) toast('Failed to send', 'error')
    else { setBody(''); onRefresh() }
    setSending(false)
  }

  async function deleteNote(id) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    await supabase.from('notes').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div className="flex flex-col h-full animate-fade-up" style={{maxHeight:'calc(100vh - 180px)'}}>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {sorted.length===0 && <p className="text-center text-gray-400 text-sm py-8">No messages yet.</p>}
        {sorted.map(n=>(
          <div key={n.id} className={`flex ${n.is_broker_note?'justify-end':'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${n.is_broker_note?'bg-brand-dark text-[#f0f4c0]':'bg-white border border-gray-200 text-gray-800'}`}>
              {!n.is_broker_note && <div className="text-[10px] font-semibold text-gray-400 mb-1">{n.author_name}</div>}
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{n.body}</p>
              <div className={`flex items-center justify-between gap-3 mt-1.5 ${n.is_broker_note?'text-brand-muted/60':'text-gray-400'}`}>
                <span className="text-[10px]">{fmtDate(n.created_at)}</span>
                <button onClick={()=>deleteNote(n.id)} className="text-[14px] leading-none opacity-30 hover:opacity-80 transition-opacity">×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a note to the client…"
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-dark"/>
        <button type="submit" disabled={sending||!body.trim()}
          className="px-4 py-2.5 bg-brand-dark text-brand-lime rounded-xl hover:bg-brand-darker disabled:opacity-40 transition-colors flex-shrink-0">
          <Send size={14}/>
        </button>
      </form>
    </div>
  )
}
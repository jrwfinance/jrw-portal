import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmtDate, initials } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Send } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const catVariant = { General:'grey', Strategy:'blue', Action:'amber', Update:'green', 'Portfolio review':'green', Question:'grey' }

export function Notes({ data, isDemo, onRefresh }) {
  const { notes, profile } = data
  const [body, setBody]   = useState('')
  const [sending, setSending] = useState(false)
  const { show: toast }   = useToast()

  const sorted = [...notes].sort((a,b) => new Date(a.created_at) - new Date(b.created_at))

  async function send(e) {
    e.preventDefault()
    if (!body.trim()) return
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setSending(true)
    const name = profile ? `${profile.first_name} ${profile.last_name}` : 'Client'
    const ini  = profile ? initials(profile.first_name, profile.last_name) : 'CL'
    const { error } = await supabase.from('notes').insert({
      client_id: profile.id, body: body.trim(),
      is_broker_note: false, author_name: name, author_initials: ini, category: 'General'
    })
    if (error) { toast('Failed to send', 'error'); setSending(false); return }
    setBody('')
    if (onRefresh) onRefresh()
    setSending(false)
  }

  return (
    <div className="animate-fade-up flex flex-col" style={{ height:'calc(100vh - 180px)' }}>
      <div className="mb-4">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Notes</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Messages between you and your broker</p>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
        {sorted.length === 0 && (
          <Card className="text-center py-12 text-gray-400 text-sm">No messages yet.</Card>
        )}
        {sorted.map(n => {
          const isBroker = !!n.is_broker_note
          return (
            <div key={n.id} className={`flex ${isBroker ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isBroker ? 'bg-white border border-gray-200 text-gray-800' : 'bg-brand-dark text-[#f0f4c0]'}`}>
                {isBroker && <div className="text-[10px] font-semibold text-gray-400 mb-1">{n.author_name}</div>}
                {n.category && isBroker && (
                  <Badge variant={catVariant[n.category] || 'grey'} className="mb-1.5">{n.category}</Badge>
                )}
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{n.body}</p>
                <div className={`text-[10px] mt-1.5 ${isBroker ? 'text-gray-400' : 'text-brand-muted/60'}`}>
                  {fmtDate(n.created_at)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reply box */}
      <form onSubmit={send} className="flex gap-2 flex-shrink-0">
        <input value={body} onChange={e => setBody(e.target.value)}
          placeholder="Reply to your broker…"
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-dark bg-white"/>
        <button type="submit" disabled={sending || !body.trim()}
          className="px-4 py-2.5 bg-brand-dark text-brand-lime rounded-xl hover:bg-brand-darker disabled:opacity-40 transition-colors flex-shrink-0">
          <Send size={14}/>
        </button>
      </form>
    </div>
  )
}
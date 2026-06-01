import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Overview }   from './tabs/Overview'
import { Portfolio }  from './tabs/Portfolio'
import { Planning }   from './tabs/Planning'
import { Notes }      from './tabs/Notes'
import { Documents }  from './tabs/Documents'
import { useToast }   from '@/components/ui/Toast'
import { cn }         from '@/lib/utils'

const TABS = ['Overview','Portfolio','Planning','Notes','Documents']

export function ClientDetail({ client: initialClient, broker, isDemo, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [data, setData] = useState({ props:[], loans:[], goals:[], notes:[], alerts:[], documents:[] })
  const [loading, setLoading] = useState(true)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertForm, setAlertForm] = useState({ title:'', body:'', alert_type:'info' })
  const { show: toast } = useToast()

  const load = useCallback(async () => {
    if (isDemo) {
      setData({ props: initialClient.properties||[], loans: initialClient.loans||[], goals: initialClient.goals||[], notes: initialClient.notes||[], alerts: initialClient.alerts||[], documents: initialClient.documents||[] })
      setLoading(false); return
    }
    setLoading(true)
    const id = initialClient.id
    const [props, loans, goals, notes, alerts, documents] = await Promise.all([
      supabase.from('properties').select('*').eq('client_id',id).order('created_at'),
      supabase.from('loans').select('*').eq('client_id',id).order('created_at'),
      supabase.from('goals').select('*').eq('client_id',id).order('created_at'),
      supabase.from('notes').select('*').eq('client_id',id).order('created_at',{ascending:false}),
      supabase.from('alerts').select('*').eq('client_id',id).eq('dismissed',false).order('created_at',{ascending:false}),
      supabase.from('documents').select('*').eq('client_id',id).order('created_at',{ascending:false}),
    ])
    setData({ props:props.data||[], loans:loans.data||[], goals:goals.data||[], notes:notes.data||[], alerts:alerts.data||[], documents:documents.data||[] })
    setLoading(false)
  }, [initialClient.id, isDemo])

  useEffect(() => { load() }, [load])

  async function deleteAlert(id) {
    if (isDemo) { toast('Demo mode'); return }
    await supabase.from('alerts').delete().eq('id',id)
    toast('Alert deleted'); load()
  }

  async function sendAlert(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode'); return }
    const { error } = await supabase.from('alerts').insert({ client_id:initialClient.id, broker_id:broker?.id, ...alertForm, dismissed:false })
    if (error) { toast('Failed','error'); return }
    toast('Alert sent'); setShowAlertModal(false); setAlertForm({title:'',body:'',alert_type:'info'}); load()
  }

  const sharedProps = { client:initialClient, broker, isDemo, onRefresh:load }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-5 flex-shrink-0">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            className={cn('px-4 py-3 text-[12px] font-medium border-b-2 transition-colors -mb-px',
              activeTab===t ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600')}>
            {t}
            {t==='Notes' && data.notes.length>0 && <span className="ml-1.5 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{data.notes.length}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/></div>
          : activeTab==='Overview'  ? <Overview  {...sharedProps} props={data.props} loans={data.loans} alerts={data.alerts} onDeleteAlert={deleteAlert} onAddAlert={()=>setShowAlertModal(true)}/>
          : activeTab==='Portfolio' ? <Portfolio {...sharedProps} props={data.props} loans={data.loans}/>
          : activeTab==='Planning'  ? <Planning  {...sharedProps} goals={data.goals}/>
          : activeTab==='Notes'     ? <Notes     {...sharedProps} notes={data.notes}/>
          : activeTab==='Documents' ? <Documents {...sharedProps} documents={data.documents}/>
          : null
        }
      </div>

      {/* Alert modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-4">Send alert to {initialClient.first_name}</h3>
            <form onSubmit={sendAlert} className="space-y-3">
              <input required placeholder="Alert title" value={alertForm.title} onChange={e=>setAlertForm(f=>({...f,title:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-brand-dark"/>
              <textarea required placeholder="Message" rows={3} value={alertForm.body} onChange={e=>setAlertForm(f=>({...f,body:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-brand-dark resize-none"/>
              <select value={alertForm.alert_type} onChange={e=>setAlertForm(f=>({...f,alert_type:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-brand-dark">
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="positive">Positive</option>
              </select>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={()=>setShowAlertModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-dark text-brand-lime rounded-lg text-[13px] font-semibold hover:bg-brand-darker">Send alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
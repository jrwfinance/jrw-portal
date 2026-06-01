import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase }            from '@/lib/supabase'
import { cn }                  from '@/lib/utils'
import { useBrokerRealtime }   from '@/hooks/useBrokerRealtime'
import { ErrorBoundary }       from '@/components/ui/ErrorBoundary'
import { Overview }            from './tabs/Overview'
import { Portfolio }           from './tabs/Portfolio'
import { Planning }            from './tabs/Planning'
import { Notes }               from './tabs/Notes'
import { Documents }           from './tabs/Documents'
import { ClientProfile }       from './tabs/ClientProfile'
import { AuditLog }            from './tabs/AuditLog'
import { useToast }            from '@/components/ui/Toast'
import { LayoutDashboard, Building2, Target, MessageSquare, FolderOpen, User, ClipboardList, ChevronLeft } from 'lucide-react'

const TABS = [
  { id:'overview',  label:'Overview',  icon:LayoutDashboard },
  { id:'portfolio', label:'Portfolio', icon:Building2 },
  { id:'planning',  label:'Planning',  icon:Target },
  { id:'notes',     label:'Messages',  icon:MessageSquare },
  { id:'documents', label:'Documents', icon:FolderOpen },
  { id:'profile',   label:'Profile',   icon:User },
  { id:'audit',     label:'Audit log', icon:ClipboardList },
]

export function ClientDetail({ client: initialClient, broker, isDemo, onBack, onDelete }) {
  const [activeTab, setActiveTab]       = useState('overview')
  const [collapsed, setCollapsed]       = useState(false)
  const [data, setData]                 = useState({ props:[], loans:[], goals:[], notes:[], alerts:[], documents:[] })
  const [loading, setLoading]           = useState(true)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertForm, setAlertForm]       = useState({ title:'', body:'', alert_type:'info' })
  const { show: toast }                 = useToast()

  const load = useCallback(async () => {
    if (isDemo) {
      setData({ props:initialClient.properties||[], loans:initialClient.loans||[], goals:initialClient.goals||[], notes:initialClient.notes||[], alerts:initialClient.alerts||[], documents:initialClient.documents||[] })
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

  // Live updates when client posts notes or uploads docs
  const handleRealtime = useCallback(() => load(), [load])
  useBrokerRealtime(!isDemo ? initialClient.id : null, handleRealtime)

  async function deleteAlert(id) {
    if (isDemo) { toast('Demo mode'); return }
    await supabase.from('alerts').delete().eq('id', id)
    toast('Alert deleted'); load()
  }

  async function sendAlert(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode'); return }
    const { error } = await supabase.from('alerts').insert({ client_id:initialClient.id, broker_id:broker?.id, ...alertForm, dismissed:false })
    if (error) { toast('Failed', 'error'); return }
    toast('Alert sent'); setShowAlertModal(false); setAlertForm({title:'',body:'',alert_type:'info'}); load()
  }

  const sharedProps = { client:initialClient, broker, isDemo, onRefresh:load }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar */}
      <motion.aside animate={{ width: collapsed ? 48 : 160 }} transition={{ duration:0.2, ease:'easeInOut' }}
        className="bg-brand-dark flex-shrink-0 flex flex-col overflow-hidden h-full">
        <div className="px-3 py-3 border-b border-white/8 flex items-center gap-2 overflow-hidden flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-brand-lime flex items-center justify-center text-[10px] font-bold text-brand-dark flex-shrink-0">
            {(initialClient.first_name?.[0]||'')+(initialClient.last_name?.[0]||'')}
          </div>
          {!collapsed && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="overflow-hidden min-w-0">
              <div className="text-[11px] font-semibold text-[#f0f4c0] truncate">{initialClient.first_name} {initialClient.last_name}</div>
              <div className="text-[9px] text-brand-muted truncate">Client since {initialClient.client_since||'–'}</div>
            </motion.div>
          )}
        </div>
        <nav className="flex-1 px-1.5 py-2 overflow-hidden">
          {TABS.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn('w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-0.5 text-[11px] font-medium transition-all overflow-hidden whitespace-nowrap',
                activeTab===id ? 'bg-brand-lime/20 text-[#e8f088]' : 'text-[#a0b878] hover:bg-brand-lime/10 hover:text-brand-lime')}>
              <Icon size={13} className="flex-shrink-0"/>
              {!collapsed && <span>{label}</span>}
              {id==='notes' && data.notes.length>0 && !collapsed && (
                <span className="ml-auto bg-brand-lime/20 text-brand-lime text-[9px] px-1.5 rounded-full">{data.notes.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-3 flex-shrink-0">
          <button onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center py-1.5 text-brand-muted/40 hover:text-brand-muted transition-colors">
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration:0.2 }}>
              <ChevronLeft size={13}/>
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <ErrorBoundary>
          {loading
            ? <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/></div>
            : activeTab==='overview'  ? <Overview  {...sharedProps} props={data.props} loans={data.loans} alerts={data.alerts} onDeleteAlert={deleteAlert} onAddAlert={()=>setShowAlertModal(true)}/>
            : activeTab==='portfolio' ? <Portfolio {...sharedProps} props={data.props} loans={data.loans} broker={broker}/>
            : activeTab==='planning'  ? <Planning  {...sharedProps} goals={data.goals} broker={broker}/>
            : activeTab==='notes'     ? <Notes     {...sharedProps} notes={data.notes}/>
            : activeTab==='documents' ? <Documents {...sharedProps} documents={data.documents}/>
            : activeTab==='profile'   ? <ClientProfile {...sharedProps} onDelete={() => { onDelete?.(); onBack() }}/>
            : activeTab==='audit'     ? <AuditLog  {...sharedProps}/>
            : null
          }
        </ErrorBoundary>
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
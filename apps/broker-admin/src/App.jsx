import { useState, useEffect, useCallback } from 'react'
import { useAuth }         from '@/hooks/useAuth'
import { supabase }        from '@/lib/supabase'
import { DEMO_CLIENTS }    from '@/lib/demo'
import { Topbar }          from '@/components/layout/Topbar'
import { LoginScreen }     from '@/components/auth/LoginScreen'
import { ClientGrid }      from '@/components/dashboard/ClientGrid'
import { ClientDetail }    from '@/components/client/ClientDetail'
import { Toaster }         from '@/components/ui/Toast'

export function App() {
  const { session, loading: authLoading } = useAuth()
  const [broker, setBroker]               = useState(null)
  const [clients, setClients]             = useState([])
  const [selected, setSelected]           = useState(null)
  const [isDemo, setIsDemo]               = useState(false)
  const [appLoading, setAppLoading]       = useState(false)

  const loadBrokerApp = useCallback(async (userId) => {
    setAppLoading(true)
    const { data: b } = await supabase.from('brokers').select('*').eq('id', userId).maybeSingle()
    if (!b) { await supabase.auth.signOut(); setAppLoading(false); return }
    setBroker(b)
    const { data: clientRows } = await supabase.from('clients').select('*').eq('broker_id', userId).order('created_at')
    // For each client, load their properties and loans
    const enriched = await Promise.all((clientRows||[]).map(async c => {
      const [props, loans] = await Promise.all([
        supabase.from('properties').select('*').eq('client_id',c.id),
        supabase.from('loans').select('*').eq('client_id',c.id),
      ])
      return { ...c, properties: props.data||[], loans: loans.data||[] }
    }))
    setClients(enriched)
    setAppLoading(false)
  }, [])

  useEffect(() => { if (session) loadBrokerApp(session.user.id) }, [session, loadBrokerApp])

  const handleSignOut = () => {
    if (isDemo) { setIsDemo(false); setClients([]); setSelected(null); return }
    supabase.auth.signOut()
  }

  const handleDemo = () => { setIsDemo(true); setClients(DEMO_CLIENTS) }

  if (authLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-7 h-7 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/></div>

  if (!session && !isDemo) return <LoginScreen onDemo={handleDemo}/>

  if (appLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-7 h-7 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/></div>

  return (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      <Topbar broker={broker} client={selected} onBack={()=>setSelected(null)} onSignOut={handleSignOut} isDemo={isDemo}/>
      <div className="flex flex-1 overflow-hidden">
        {selected
          ? <ClientDetail key={selected.id} client={selected} broker={broker} isDemo={isDemo} onBack={()=>setSelected(null)}/>
          : <ClientGrid clients={clients} onSelect={setSelected} isDemo={isDemo} onCreateClient={()=>{}}/>
        }
      </div>
      <Toaster/>
    </div>
  )
}
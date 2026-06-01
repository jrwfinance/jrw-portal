import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth }       from '@/hooks/useAuth'
import { useClientData } from '@/hooks/useClientData'
import { supabase }      from '@/lib/supabase'
import { DEMO_DATA }     from '@/lib/demo'
import { Sidebar }       from '@/components/layout/Sidebar'
import { Topbar }        from '@/components/layout/Topbar'
import { LoginScreen }   from '@/components/auth/LoginScreen'
import { Toaster, useToast } from '@/components/ui/Toast'
import { Overview }    from '@/components/tabs/Overview'
import { Portfolio }   from '@/components/tabs/Portfolio'
import { Goals }       from '@/components/tabs/Goals'
import { Notes }       from '@/components/tabs/Notes'
import { Alerts }      from '@/components/tabs/Alerts'
import { Documents }   from '@/components/tabs/Documents'
import { Research }    from '@/components/tabs/Research'

const TAB_LABELS = {
  overview: 'Overview', portfolio: 'Portfolio', goals: 'Goals',
  notes: 'Notes', alerts: 'Alerts', documents: 'Documents', research: 'Research',
}

export function App() {
  const { session, loading: authLoading } = useAuth()
  const { data, load, setData }           = useClientData(session?.user?.id)
  const [activeTab, setActiveTab]         = useState('overview')
  const [isDemo, setIsDemo]               = useState(false)
  const [demoData, setDemoData]           = useState(null)
  const [brokerLogoUrl, setBrokerLogoUrl] = useState(null)
  const { show: toast }                   = useToast()

  useEffect(() => { if (session) load() }, [session, load])

  // Load broker logo from brokers table using client's broker_id
  useEffect(() => {
    const profile = isDemo ? demoData?.profile : data.profile
    if (!profile?.broker_id) return
    supabase.from('brokers').select('logo_url').eq('id', profile.broker_id).single()
      .then(({ data: b }) => { if (b?.logo_url) setBrokerLogoUrl(b.logo_url) })
  }, [data.profile, isDemo, demoData])

  const handleDemoMode = useCallback(() => {
    setIsDemo(true)
    setDemoData(DEMO_DATA)
  }, [])

  const handleDismissAlert = useCallback(async (id) => {
    if (isDemo) { toast('Demo mode — changes are not saved'); return }
    const { error } = await supabase.from('alerts').update({ dismissed: true }).eq('id', id)
    if (error) { toast('Failed to dismiss alert', 'error'); return }
    setData(d => ({ ...d, alerts: d.alerts.filter(a => a.id !== id) }))
  }, [isDemo, setData, toast])

  const handleSignOut = () => {
    if (isDemo) { setIsDemo(false); setDemoData(null); return }
    supabase.auth.signOut()
  }

  if (authLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
    </div>
  )

  if (!session && !isDemo) return <LoginScreen onDemo={handleDemoMode} />

  const activeData = isDemo ? demoData : data

  return (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      <Topbar profile={activeData.profile} crumb={TAB_LABELS[activeTab]} isDemo={isDemo} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={activeTab}
          onChange={setActiveTab}
          alertCount={activeData.alerts.length}
          onSignOut={handleSignOut}
          brokerLogoUrl={brokerLogoUrl}
          isDemo={isDemo}
        />
        <main className="flex-1 overflow-y-auto px-5 py-5 pb-16 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'overview'  && <Overview  data={activeData} onDismissAlert={handleDismissAlert} />}
              {activeTab === 'portfolio' && <Portfolio data={activeData} />}
              {activeTab === 'goals'     && <Goals     data={activeData} />}
              {activeTab === 'notes'     && <Notes     data={activeData} />}
              {activeTab === 'alerts'    && <Alerts    data={activeData} onDismiss={handleDismissAlert} />}
              {activeTab === 'documents' && <Documents data={activeData} />}
              {activeTab === 'research'  && <Research  data={activeData} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth }       from '@/hooks/useAuth'
import { useClientData } from '@/hooks/useClientData'
import { supabase }      from '@/lib/supabase'
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
  const { show: toast }                   = useToast()

  useEffect(() => { if (session) load() }, [session, load])

  const handleDismissAlert = useCallback(async (id) => {
    const { error } = await supabase.from('alerts').update({ dismissed: true }).eq('id', id)
    if (error) { toast('Failed to dismiss alert', 'error'); return }
    setData(d => ({ ...d, alerts: d.alerts.filter(a => a.id !== id) }))
  }, [setData, toast])

  const handleSignOut = () => supabase.auth.signOut()

  if (authLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
    </div>
  )

  if (!session) return <LoginScreen />

  const tabProps = { data, onDismissAlert: handleDismissAlert, onDismiss: handleDismissAlert }

  return (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      <Topbar profile={data.profile} crumb={TAB_LABELS[activeTab]} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={activeTab}
          onChange={setActiveTab}
          alertCount={data.alerts.length}
          onSignOut={handleSignOut}
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
              {activeTab === 'overview'   && <Overview   {...tabProps} />}
              {activeTab === 'portfolio'  && <Portfolio  {...tabProps} />}
              {activeTab === 'goals'      && <Goals      {...tabProps} />}
              {activeTab === 'notes'      && <Notes      {...tabProps} />}
              {activeTab === 'alerts'     && <Alerts     {...tabProps} />}
              {activeTab === 'documents'  && <Documents  {...tabProps} />}
              {activeTab === 'research'   && <Research   {...tabProps} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
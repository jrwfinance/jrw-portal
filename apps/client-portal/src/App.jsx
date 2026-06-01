import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth }               from '@/hooks/useAuth'
import { useClientData }         from '@/hooks/useClientData'
import { useRealtime }           from '@/hooks/useRealtime'
import { supabase }              from '@/lib/supabase'
import { DEMO_DATA }             from '@/lib/demo'
import { Sidebar }               from '@/components/layout/Sidebar'
import { Topbar }                from '@/components/layout/Topbar'
import { ProfilePanel }          from '@/components/layout/ProfilePanel'
import { LoginScreen }           from '@/components/auth/LoginScreen'
import { SignupScreen }          from '@/components/auth/SignupScreen'
import { ForgotPasswordScreen }  from '@/components/auth/ForgotPasswordScreen'
import { PasswordResetScreen }   from '@/components/auth/PasswordResetScreen'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Toaster, useToast }     from '@/components/ui/Toast'
import { Overview }    from '@/components/tabs/Overview'
import { Portfolio }   from '@/components/tabs/Portfolio'
import { Planning }    from '@/components/tabs/Planning'
import { Goals }       from '@/components/tabs/Goals'
import { Notes }       from '@/components/tabs/Notes'
import { Alerts }      from '@/components/tabs/Alerts'
import { Documents }   from '@/components/tabs/Documents'
import { Research }    from '@/components/tabs/Research'

const TAB_LABELS = {
  overview:'Overview', portfolio:'Portfolio', planning:'Planning', goals:'Goals',
  notes:'Notes', alerts:'Alerts', documents:'Documents', research:'Research',
}

export function App() {
  const { session, loading: authLoading } = useAuth()
  const { data, load, setData }           = useClientData(session?.user?.id)
  const [activeTab, setActiveTab]         = useState('overview')
  const [isDemo, setIsDemo]               = useState(false)
  const [demoData, setDemoData]           = useState(null)
  const [brokerLogoUrl, setBrokerLogoUrl] = useState(null)
  const [profileOpen, setProfileOpen]     = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [screen, setScreen]               = useState('login') // login | forgot | reset | signup
  const { show: toast }                   = useToast()

  // Realtime — reload specific data when broker makes changes
  const handleRealtimeUpdate = useCallback((table) => {
    if (isDemo) return
    load()
    if (table === 'alerts') toast('New alert from your broker')
    if (table === 'notes')  toast('New message from your broker')
  }, [isDemo, load, toast])
  useRealtime(!isDemo ? session?.user?.id : null, handleRealtimeUpdate)

  // Detect URL-based flows (password reset, invite signup)
  useEffect(() => {
    const hash   = window.location.hash
    const search = window.location.search
    if (hash.includes('type=recovery'))   setScreen('reset')
    else if (search.includes('type=recovery')) setScreen('reset')
    else if (search.includes('invite=client')) setScreen('signup')
  }, [])

  useEffect(() => { if (session) load() }, [session, load])

  useEffect(() => {
    const profile = isDemo ? demoData?.profile : data.profile
    if (!profile?.broker_id) return
    supabase.from('brokers').select('photo_url').eq('id', profile.broker_id).single()
      .then(({ data: b }) => { if (b?.photo_url) setBrokerLogoUrl(b.photo_url) })
  }, [data.profile, isDemo, demoData])

  const handleDemoMode = useCallback(() => { setIsDemo(true); setDemoData(DEMO_DATA) }, [])
  const handleSignOut  = () => {
    if (isDemo) { setIsDemo(false); setDemoData(null); return }
    supabase.auth.signOut()
  }

  const handleDismissAlert = useCallback(async (id) => {
    if (isDemo) { toast('Demo mode — changes are not saved'); return }
    const { error } = await supabase.from('alerts').update({ dismissed: true }).eq('id', id)
    if (error) { toast('Failed to dismiss alert', 'error'); return }
    setData(d => ({ ...d, alerts: d.alerts.filter(a => a.id !== id) }))
  }, [isDemo, setData, toast])

  const handleProfileUpdate = useCallback((updated) => {
    setData(d => ({ ...d, profile: updated }))
  }, [setData])

  // Auth screens (before login)
  if (screen === 'reset')  return <PasswordResetScreen/>
  if (screen === 'signup') return <SignupScreen/>

  if (authLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/>
    </div>
  )

  if (!session && !isDemo) {
    if (screen === 'forgot') return <ForgotPasswordScreen onBack={() => setScreen('login')}/>
    return <LoginScreen onDemo={handleDemoMode} onForgot={() => setScreen('forgot')}/>
  }

  const activeData = isDemo ? demoData : data

  return (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      <Topbar
        profile={activeData.profile}
        crumb={TAB_LABELS[activeTab]}
        onAvatarClick={() => setProfileOpen(p => !p)}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={activeTab}
          onChange={tab => { setActiveTab(tab); setProfileOpen(false); setMobileSidebarOpen(false) }}
          alertCount={activeData.alerts.length}
          onSignOut={handleSignOut}
          brokerLogoUrl={brokerLogoUrl}
          isDemo={isDemo}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}/>
        <main className="flex-1 overflow-y-auto px-5 py-5 pb-16 min-w-0">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                transition={{duration:0.18}}>
                {activeTab==='overview'  && <Overview  data={activeData} onDismissAlert={handleDismissAlert}/>}
                {activeTab==='portfolio' && <Portfolio data={activeData}/>}
                {activeTab==='planning'  && <Planning  data={activeData}/>}
                {activeTab==='goals'     && <Goals     data={activeData}/>}
                {activeTab==='notes'     && <Notes     data={activeData} isDemo={isDemo} onRefresh={load}/>}
                {activeTab==='alerts'    && <Alerts    data={activeData} onDismiss={handleDismissAlert}/>}
                {activeTab==='documents' && <Documents data={activeData} isDemo={isDemo} onRefresh={load}/>}
                {activeTab==='research'  && <Research  data={activeData}/>}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      <ProfilePanel
        profile={activeData.profile}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        isDemo={isDemo}
        onUpdate={handleProfileUpdate}
      />
      <Toaster/>
    </div>
  )
}
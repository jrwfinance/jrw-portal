import { LogOut, ArrowLeft, Settings } from 'lucide-react'
import { initials } from '@/lib/utils'

export function Topbar({ broker, client, onBack, onSignOut, onOpenSettings, isDemo, view }) {
  const name = broker?.name || 'Josh Weiler'
  const ini  = initials(name.split(' ')[0], name.split(' ')[1])

  return (
    <header className="h-[46px] bg-[#1e2203] flex items-center px-4 gap-3 border-b border-brand-lime/8 flex-shrink-0 z-10">
      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
        <img src="/logo.png" alt="JRW Finance" className="w-full h-full object-cover"/>
      </div>
      <span className="text-[11px] font-semibold text-[#f0f4c0] tracking-tight">JRW Finance</span>
      <div className="w-px h-4 bg-brand-lime/15 flex-shrink-0"/>

      {view === 'settings'
        ? <span className="text-[11px] text-brand-muted">Settings</span>
        : client
          ? <>
              <button onClick={onBack} className="flex items-center gap-1.5 text-brand-muted text-[11px] hover:text-brand-lime transition-colors">
                <ArrowLeft size={12}/> Clients
              </button>
              <span className="text-brand-muted/40 text-[11px]">/</span>
              <span className="text-[11px] text-[#f0f4c0] font-medium">{client.first_name} {client.last_name}</span>
            </>
          : <span className="text-[11px] text-brand-muted">{isDemo ? 'Demo mode' : 'All clients'}</span>
      }

      <div className="flex-1"/>
      <div className="flex items-center gap-2">
        <button onClick={onOpenSettings} title="Broker settings"
          className="text-brand-muted/60 hover:text-brand-lime transition-colors p-1">
          <Settings size={13}/>
        </button>
        <button onClick={onOpenSettings} title="Broker profile"
          className="w-7 h-7 rounded-full bg-brand-lime flex items-center justify-center text-[10px] font-bold text-brand-dark flex-shrink-0 hover:bg-brand-lime-dim transition-colors overflow-hidden">
          {broker?.photo_url ? <img src={broker.photo_url} className="w-full h-full object-cover rounded-full"/> : ini}
        </button>
        <button onClick={onSignOut} className="text-brand-muted/60 hover:text-red-400 transition-colors p-1" title="Sign out">
          <LogOut size={13}/>
        </button>
      </div>
    </header>
  )
}
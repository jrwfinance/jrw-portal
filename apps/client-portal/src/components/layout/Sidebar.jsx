import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Building2, TrendingUp, Target, FileText, Bell, FolderOpen, Search, ChevronLeft, LogOut } from 'lucide-react'

const NAV = [
  { id:'overview',  label:'Overview',  icon:LayoutDashboard },
  { id:'portfolio', label:'Portfolio', icon:Building2 },
  { id:'planning',  label:'Planning',  icon:TrendingUp },
  { id:'goals',     label:'Goals',     icon:Target },
  { id:'notes',     label:'Notes',     icon:FileText },
  { id:'alerts',    label:'Alerts',    icon:Bell },
  { id:'documents', label:'Documents', icon:FolderOpen },
  { id:'research',  label:'Research',  icon:Search },
]

export function Sidebar({ active, onChange, alertCount, onSignOut, brokerLogoUrl, isDemo }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <motion.aside animate={{ width: collapsed ? 52 : 176 }} transition={{ duration:0.2, ease:'easeInOut' }}
      className="bg-brand-dark flex-shrink-0 flex flex-col overflow-hidden h-full">
      <div className="px-3 py-3.5 border-b border-white/8 flex items-center gap-2 overflow-hidden flex-shrink-0">
        <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
          <img src={brokerLogoUrl || '/logo.png'} alt="JRW Finance" className="w-full h-full object-cover"/>
        </div>
        {!collapsed && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="overflow-hidden">
            <div className="text-[13px] font-bold text-[#f0f4c0] leading-tight whitespace-nowrap">JRW Finance</div>
            <div className="text-[10px] text-brand-muted whitespace-nowrap">{isDemo ? 'Demo mode' : 'Client Portal'}</div>
          </motion.div>
        )}
      </div>
      <nav className="flex-1 px-2 py-2.5 overflow-hidden">
        {NAV.map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={cn('w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-0.5 text-[12px] font-medium transition-all duration-100 overflow-hidden whitespace-nowrap',
              active===id ? 'bg-brand-lime/20 text-[#e8f088]' : 'text-[#a0b878] hover:bg-brand-lime/10 hover:text-brand-lime')}>
            <Icon size={14} className="flex-shrink-0"/>
            {!collapsed && <span>{label}</span>}
            {id==='alerts' && alertCount>0 && !collapsed && (
              <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{alertCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-2 pb-3 flex flex-col gap-1 flex-shrink-0">
        <button onClick={onSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[11px] text-brand-muted/70 hover:text-red-400 hover:bg-red-400/10 transition-all overflow-hidden whitespace-nowrap">
          <LogOut size={13} className="flex-shrink-0"/>
          {!collapsed && <span>{isDemo ? 'Exit demo' : 'Sign out'}</span>}
        </button>
        <button onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center py-1.5 text-brand-muted/40 hover:text-brand-muted transition-colors">
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration:0.2 }}>
            <ChevronLeft size={14}/>
          </motion.div>
        </button>
      </div>
    </motion.aside>
  )
}
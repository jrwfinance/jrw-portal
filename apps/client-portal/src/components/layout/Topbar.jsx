import { motion } from 'framer-motion'
import { initials } from '@/lib/utils'
import { Menu } from 'lucide-react'

export function Topbar({ profile, crumb, onAvatarClick, onMenuClick }) {
  const ini = initials(profile?.first_name, profile?.last_name)
  return (
    <header className="h-[46px] bg-[#1e2203] flex items-center px-4 gap-3 border-b border-brand-lime/8 flex-shrink-0 z-10">
      {/* Hamburger — mobile only */}
      <button onClick={onMenuClick} className="md:hidden text-brand-muted/70 hover:text-brand-lime transition-colors p-1 -ml-1">
        <Menu size={18}/>
      </button>
      <span className="text-[11px] font-semibold text-brand-muted tracking-wide flex-1 truncate">{crumb}</span>
      {profile && (
        <motion.button initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
          onClick={onAvatarClick}
          className="w-[30px] h-[30px] rounded-full bg-brand-lime flex items-center justify-center text-[10px] font-bold text-brand-dark flex-shrink-0 cursor-pointer hover:bg-brand-lime-dim transition-colors overflow-hidden">
          {profile.photo_url
            ? <img src={profile.photo_url} className="w-full h-full object-cover rounded-full"/>
            : ini
          }
        </motion.button>
      )}
    </header>
  )
}
import { motion } from 'framer-motion'
import { initials } from '@/lib/utils'

export function Topbar({ profile, crumb }) {
  return (
    <header className="h-[46px] bg-[#1e2203] flex items-center px-4 gap-3 border-b border-brand-lime/8 flex-shrink-0 z-10">
      <span className="text-[11px] font-semibold text-brand-muted tracking-wide flex-1">{crumb}</span>
      {profile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[30px] h-[30px] rounded-full bg-brand-lime flex items-center justify-center text-[10px] font-bold text-brand-dark flex-shrink-0 cursor-pointer hover:bg-brand-lime-dim transition-colors"
        >
          {profile.avatar_url
            ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-full" />
            : initials(profile.first_name, profile.last_name)
          }
        </motion.div>
      )}
    </header>
  )
}
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
let _id = 0, _add = null
export function useToast() {
  const show = useCallback((msg, type='success') => _add?.({ id:++_id, msg, type }), [])
  return { show }
}
export function Toaster() {
  const [toasts, setToasts] = useState([])
  _add = (t) => { setToasts(p=>[...p,t]); setTimeout(()=>setToasts(p=>p.filter(x=>x.id!==t.id)),3000) }
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t=>(
          <motion.div key={t.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
            className={cn('px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg pointer-events-auto',
              t.type==='error' ? 'bg-red-600 text-white' : 'bg-brand-dark text-brand-lime border border-brand-lime/20')}>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
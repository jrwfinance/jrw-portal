import { motion, AnimatePresence } from 'framer-motion'
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

const typeStyle = {
  urgent:   { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: '⚠️', dot: 'bg-amber-400' },
  positive: { bg: 'bg-green-50',  border: 'border-green-200',  icon: '✅', dot: 'bg-green-400' },
  info:     { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'ℹ️', dot: 'bg-blue-400'  },
}

export function Alerts({ data, onDismiss }) {
  const { alerts } = data
  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Alerts</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
      </div>
      {alerts.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">You're all up to date.</Card>}
      <AnimatePresence>
        {alerts.map(a => {
          const s = typeStyle[a.alert_type] || typeStyle.info
          return (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`${s.bg} ${s.border} border rounded-xl p-4 mb-3 flex gap-3`}>
              <div className="text-base flex-shrink-0 mt-0.5">{s.icon}</div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-800 mb-1">{a.title}</div>
                <div className="text-[12px] text-gray-600 leading-relaxed">{a.body}</div>
                <div className="text-[10px] text-gray-400 mt-2">{fmtDate(a.created_at)}</div>
              </div>
              <button onClick={() => onDismiss(a.id)}
                className="text-gray-300 hover:text-gray-500 text-xl leading-none flex-shrink-0 self-start transition-colors">×</button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
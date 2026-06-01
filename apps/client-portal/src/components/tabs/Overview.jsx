import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { fmt, fmtDate } from '@/lib/utils'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

function StatTile({ label, value, sub }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2.5">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[17px] font-medium text-gray-800">{value}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function AlertCard({ alert, onDismiss }) {
  const typeMap = {
    urgent:   { bg: 'bg-amber-50', border: 'border-amber-300', icon: '⚠️', iconBg: 'bg-amber-100' },
    positive: { bg: 'bg-green-50', border: 'border-green-300', icon: '✅', iconBg: 'bg-green-100' },
    info:     { bg: 'bg-blue-50',  border: 'border-blue-300',  icon: 'ℹ️', iconBg: 'bg-blue-100'  },
  }
  const s = typeMap[alert.alert_type] || typeMap.info
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`${s.bg} ${s.border} border rounded-xl p-3.5 flex gap-3`}
    >
      <div className={`${s.iconBg} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm`}>
        {s.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-gray-800 mb-0.5">{alert.title}</div>
        <div className="text-[12px] text-gray-500 leading-relaxed">{alert.body}</div>
        <div className="text-[10px] text-gray-400 mt-1.5">{fmtDate(alert.created_at)}</div>
      </div>
      <button onClick={() => onDismiss(alert.id)}
        className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0 self-start transition-colors">×</button>
    </motion.div>
  )
}

export function Overview({ data, onDismissAlert }) {
  const { profile, properties, loans, alerts } = data

  const totalValue    = useMemo(() => properties.reduce((s, p) => s + (p.estimated_value || 0), 0), [properties])
  const totalOwing    = useMemo(() => loans.reduce((s, l) => s + (l.loan_balance || 0), 0), [loans])
  const totalEquity   = totalValue - totalOwing
  const monthlyRepay  = useMemo(() => loans.reduce((s, l) => s + (l.monthly_repayment || 0), 0), [loans])

  const firstName = profile?.first_name || 'there'

  return (
    <div className="animate-fade-up">
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          Hey, {firstName} 👋
        </h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Here's your financial snapshot.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        <StatTile label="Portfolio value"    value={fmt(totalValue)}   />
        <StatTile label="Total owing"        value={fmt(totalOwing)}   />
        <StatTile label="Total equity"       value={fmt(totalEquity)}  />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <StatTile label="Properties"         value={properties.length} />
        <StatTile label="Monthly repayments" value={fmt(monthlyRepay)} />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="mb-4">
          <CardTitle className="mb-3">Alerts & updates</CardTitle>
          <div className="space-y-2.5">
            {alerts.map(a => (
              <AlertCard key={a.id} alert={a} onDismiss={onDismissAlert} />
            ))}
          </div>
        </Card>
      )}

      {/* Loans quick view */}
      {loans.length > 0 && (
        <Card>
          <CardTitle className="mb-3">Active loans</CardTitle>
          <div className="space-y-2">
            {loans.map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-[13px] font-medium text-gray-800">{l.lender}</div>
                  <div className="text-[11px] text-gray-400">{fmt(l.monthly_repayment)}/mo</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-medium text-gray-800">{fmt(l.loan_balance)}</div>
                  <Badge variant={l.rate_type === 'Fixed' ? 'amber' : 'blue'} className="mt-0.5">
                    {l.rate_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
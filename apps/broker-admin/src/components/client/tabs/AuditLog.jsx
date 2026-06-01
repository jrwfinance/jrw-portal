import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { fmtDate } from '@/lib/utils'

export function AuditLog({ client, isDemo }) {
  const [logs, setLogs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) { setLogs([]); setLoading(false); return }
    supabase.from('audit_log').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setLogs(data||[]); setLoading(false) })
  }, [client.id, isDemo])

  const actionColor = { INSERT:'text-green-600', UPDATE:'text-blue-600', DELETE:'text-red-500', LOGIN:'text-purple-600' }

  return (
    <div className="animate-fade-up">
      <h2 className="text-[13px] font-semibold text-gray-800 mb-1">Audit Log</h2>
      <p className="text-[11px] text-gray-400 mb-4">All changes to this client's data.</p>
      {loading
        ? <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"/></div>
        : logs.length === 0
          ? <Card className="text-center py-12 text-gray-400 text-sm">{isDemo ? 'Audit log not available in demo mode.' : 'No audit entries yet.'}</Card>
          : <div className="space-y-1.5">
              {logs.map((l, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className={`text-[11px] font-bold w-14 flex-shrink-0 ${actionColor[l.action]||'text-gray-600'}`}>{l.action}</span>
                  <span className="text-[12px] text-gray-700 flex-1">{l.table_name} {l.record_id ? `· ${l.record_id.slice(0,8)}…` : ''}</span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{fmtDate(l.created_at)}</span>
                </div>
              ))}
            </div>
      }
    </div>
  )
}
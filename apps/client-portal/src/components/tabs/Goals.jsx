import { fmt, fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Target } from 'lucide-react'

const statusVariant = { 'On Track': 'green', 'At Risk': 'amber', 'Completed': 'blue', 'Not Started': 'grey' }

export function Goals({ data }) {
  const { goals } = data
  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Goals</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{goals.length} goal{goals.length !== 1 ? 's' : ''} tracked</p>
      </div>
      {goals.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">No goals set yet.</Card>}
      {goals.map(g => (
        <Card key={g.id} className="mb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
                <Target size={16} className="text-brand-dark" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-gray-800">{g.what}</div>
                {g.why && <div className="text-[11px] text-gray-400 mt-0.5">{g.why}</div>}
              </div>
            </div>
            <Badge variant={statusVariant[g.status] || 'grey'}>{g.status || 'Not Started'}</Badge>
          </div>
          {g.progress != null && (
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Progress</span><span>{g.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-dark rounded-full transition-all" style={{ width: `${g.progress}%` }} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            {g.target_date && <div>Target: <span className="font-medium text-gray-700">{fmtDate(g.target_date)}</span></div>}
            {g.target_amount && <div>Amount: <span className="font-medium text-gray-700">{fmt(g.target_amount)}</span></div>}
          </div>
        </Card>
      ))}
    </div>
  )
}
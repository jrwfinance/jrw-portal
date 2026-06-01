import { fmt } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search } from 'lucide-react'

export function Research({ data }) {
  const { research } = data
  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Research</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{research.length} propert{research.length !== 1 ? 'ies' : 'y'} watched</p>
      </div>
      {research.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">No research properties yet.</Card>}
      {research.map(r => (
        <Card key={r.id} className="mb-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <Search size={15} className="text-brand-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 truncate">{r.address}</div>
            <div className="text-[11px] text-gray-400">{r.suburb}</div>
          </div>
          <div className="text-right flex-shrink-0">
            {r.asking_price && <div className="text-[13px] font-medium text-gray-800">{fmt(r.asking_price)}</div>}
            {r.status && <Badge variant="grey" className="mt-0.5">{r.status}</Badge>}
          </div>
        </Card>
      ))}
    </div>
  )
}
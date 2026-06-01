import { fmt, fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, ExternalLink } from 'lucide-react'

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
        <Card key={r.id} className="mb-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Search size={15} className="text-brand-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-gray-800">{r.address}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {r.property_type && <span className="text-[11px] text-gray-400">{r.property_type}</span>}
                {r.asking_price && <span className="text-[12px] font-medium text-gray-700">{fmt(r.asking_price)}</span>}
                {r.estimated_yield && <span className="text-[11px] text-gray-400">{r.estimated_yield}% yield</span>}
                {r.suburb_growth_5yr && <span className="text-[11px] text-green-600">{r.suburb_growth_5yr} 5yr growth</span>}
              </div>
              {r.notes && <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{r.notes}</p>}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {r.status && <Badge variant="grey">{r.status}</Badge>}
              {r.listing_url && (
                <a href={r.listing_url} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink size={13}/>
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
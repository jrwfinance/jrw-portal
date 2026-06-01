import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText } from 'lucide-react'

const catVariant = { General: 'grey', Strategy: 'blue', Action: 'amber', Update: 'green' }

export function Notes({ data }) {
  const { notes } = data
  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Notes</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''} from your broker</p>
      </div>
      {notes.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">No notes yet.</Card>}
      {notes.map(n => (
        <Card key={n.id} className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-[12px] text-gray-400">{fmtDate(n.created_at)}</span>
            </div>
            {n.category && <Badge variant={catVariant[n.category] || 'grey'}>{n.category}</Badge>}
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{n.body}</p>
        </Card>
      ))}
    </div>
  )
}
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { FolderOpen, ExternalLink } from 'lucide-react'

export function Documents({ data }) {
  const { documents } = data
  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Documents</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
      </div>
      {documents.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">No documents uploaded yet.</Card>}
      {documents.map(d => (
        <Card key={d.id} className="mb-2.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderOpen size={15} className="text-brand-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 truncate">{d.name || d.file_name}</div>
            <div className="text-[11px] text-gray-400">{d.category} · {fmtDate(d.created_at)}</div>
          </div>
          {d.file_url && (
            <a href={d.file_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <ExternalLink size={14} />
            </a>
          )}
        </Card>
      ))}
    </div>
  )
}
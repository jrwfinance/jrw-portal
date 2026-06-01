import { supabase } from '@/lib/supabase'
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { FolderOpen, ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function Documents({ client, documents, isDemo, onRefresh }) {
  const { show: toast } = useToast()

  async function deleteDoc(id) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    if (!confirm('Remove this document?')) return
    await supabase.from('documents').delete().eq('id', id)
    toast('Document removed'); onRefresh()
  }

  return (
    <div className="animate-fade-up">
      {documents.length===0 && <Card className="text-center py-12 text-gray-400 text-sm">No documents yet.</Card>}
      {documents.map(d=>(
        <Card key={d.id} className="mb-2.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderOpen size={15} className="text-brand-dark"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 truncate">{d.name || d.file_name}</div>
            <div className="text-[11px] text-gray-400">{d.category} · {fmtDate(d.created_at)}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {d.file_url && <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><ExternalLink size={14}/></a>}
            <button onClick={()=>deleteDoc(d.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
          </div>
        </Card>
      ))}
    </div>
  )
}
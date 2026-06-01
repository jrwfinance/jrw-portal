import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { FolderOpen, ExternalLink, Upload } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function Documents({ data, isDemo, onRefresh }) {
  const { documents, profile } = data
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const { show: toast } = useToast()

  async function handleUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 50 * 1024 * 1024) { toast('File must be under 50 MB'); return }
    if (isDemo) { toast('Demo mode — uploads not saved'); return }
    setUploading(true)
    const path = `${profile.id}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('client-documents').upload(path, file, { upsert: false })
    if (upErr) { toast('Upload failed: ' + upErr.message, 'error'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('client-documents').getPublicUrl(path)
    await supabase.from('documents').insert({
      client_id:   profile.id,
      name:        file.name,
      file_url:    publicUrl,
      file_size_kb: Math.round(file.size / 1024),
      category:    'Other',
      uploaded_by: profile ? `${profile.first_name} ${profile.last_name}` : 'Client'
    })
    toast('Document uploaded')
    e.target.value = ''
    if (onRefresh) onRefresh()
    setUploading(false)
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-brand-lime text-[12px] font-semibold rounded-lg hover:bg-brand-darker disabled:opacity-50 transition-colors">
          <Upload size={13}/> {uploading ? 'Uploading…' : 'Upload file'}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.heic"/>
      </div>

      {documents.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-300 mb-3"><FolderOpen size={32} className="mx-auto"/></div>
          <p className="text-gray-400 text-sm">No documents yet.</p>
          <button onClick={() => fileRef.current?.click()} className="mt-3 text-[12px] text-brand-dark font-medium hover:underline">
            Upload your first document
          </button>
        </Card>
      )}

      {documents.map(d => (
        <Card key={d.id} className="mb-2.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderOpen size={15} className="text-brand-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 truncate">{d.name || d.file_name}</div>
            <div className="text-[11px] text-gray-400">
              {d.category} · {fmtDate(d.created_at)}
              {d.file_size_kb ? ` · ${(d.file_size_kb / 1024).toFixed(1)} MB` : ''}
            </div>
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
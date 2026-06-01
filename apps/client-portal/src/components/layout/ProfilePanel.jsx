import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { initials } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { X, Camera } from 'lucide-react'

export function ProfilePanel({ profile, isOpen, onClose, isDemo, onUpdate }) {
  const [form, setForm] = useState({
    first_name:          profile?.first_name          || '',
    last_name:           profile?.last_name           || '',
    mobile:              profile?.mobile              || '',
    residential_address: profile?.residential_address || '',
  })
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const { show: toast } = useToast()
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function saveProfile(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setSaving(true)
    const { error } = await supabase.from('clients').update(form).eq('id', profile.id)
    if (error) { toast('Save failed', 'error'); setSaving(false); return }
    toast('Profile saved')
    onUpdate({ ...profile, ...form })
    setSaving(false)
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 1024*1024) { toast('Photo must be under 1 MB'); return }
    if (!file.type.startsWith('image/')) { toast('Please choose an image'); return }
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setUploading(true)
    const path = `${profile.id}/avatar`
    const { error: upErr } = await supabase.storage.from('profile-photos').upload(path, file, { upsert:true, cacheControl:'0', contentType:file.type })
    if (upErr) { toast('Upload failed', 'error'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(path)
    const photoUrl = `${publicUrl}?v=${Date.now()}`
    await supabase.from('clients').update({ photo_url: photoUrl }).eq('id', profile.id)
    onUpdate({ ...profile, photo_url: photoUrl })
    toast('Photo updated')
    setUploading(false)
  }

  async function removePhoto() {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    await supabase.storage.from('profile-photos').remove([`${profile.id}/avatar`]).catch(()=>{})
    await supabase.from('clients').update({ photo_url: null }).eq('id', profile.id)
    onUpdate({ ...profile, photo_url: null })
    toast('Photo removed')
  }

  const ini = initials(profile?.first_name, profile?.last_name)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-40" onClick={onClose}/>
          <motion.div
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
            transition={{duration:0.2}}
            className="fixed top-[46px] right-0 w-64 bg-white border-l border-b border-gray-200 rounded-bl-xl shadow-xl z-50 overflow-y-auto max-h-[calc(100vh-46px)]"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold text-gray-700">My profile</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={14}/></button>
              </div>

              {/* Photo */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-brand-dark flex items-center justify-center text-lg font-bold text-brand-lime flex-shrink-0 overflow-hidden border-2 border-gray-200">
                  {profile?.photo_url
                    ? <img src={profile.photo_url} className="w-full h-full object-cover"/>
                    : ini
                  }
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={()=>fileRef.current?.click()}
                    className="flex items-center gap-1.5 text-[11px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
                    <Camera size={11}/> {uploading ? 'Uploading…' : 'Change photo'}
                  </button>
                  {profile?.photo_url && (
                    <button onClick={removePhoto} className="text-[10px] text-red-400 hover:text-red-600 transition-colors text-left">Remove</button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
              </div>

              {/* Form */}
              <form onSubmit={saveProfile} className="space-y-2.5">
                {[['First name','first_name'],['Last name','last_name'],['Mobile','mobile']].map(([lbl,key])=>(
                  <div key={key}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                    <input value={form[key]} onChange={e=>set(key,e.target.value)}
                      className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Address</label>
                  <input value={form.residential_address} onChange={e=>set('residential_address',e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Email <span className="normal-case font-normal text-gray-300">(read-only)</span></label>
                  <input value={profile?.email||''} readOnly className="w-full px-2.5 py-2 border border-gray-100 rounded-lg text-[12px] text-gray-400 bg-gray-50 cursor-not-allowed"/>
                </div>
                <button type="submit" disabled={saving}
                  className="w-full py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker disabled:opacity-50 transition-colors mt-1">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
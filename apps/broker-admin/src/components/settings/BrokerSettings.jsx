import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, Camera } from 'lucide-react'
import { initials } from '@/lib/utils'

export function BrokerSettings({ broker, onBack, isDemo, onBrokerUpdate }) {
  const [form, setForm] = useState({
    name:    broker?.name    || '',
    mobile:  broker?.mobile  || '',
    licence: broker?.licence_details || '',
  })
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [mfaStatus, setMfaStatus]   = useState(null)
  const fileRef                     = useRef()
  const { show: toast }             = useToast()
  const ini = initials((broker?.name||'Josh Weiler').split(' ')[0], (broker?.name||'Josh Weiler').split(' ')[1])

  useEffect(() => {
    if (isDemo) return
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp?.find(f => f.status === 'verified')
      setMfaStatus(totp ? 'enabled' : 'disabled')
    })
  }, [isDemo])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function saveProfile(e) {
    e.preventDefault()
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setSaving(true)
    const { error } = await supabase.from('brokers').update({
      name: form.name, mobile: form.mobile, licence_details: form.licence
    }).eq('id', broker.id)
    if (error) toast('Save failed', 'error')
    else { toast('Profile saved'); onBrokerUpdate?.({ ...broker, ...form }) }
    setSaving(false)
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 2*1024*1024) { toast('Photo must be under 2 MB'); return }
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    setUploading(true)
    const path = `broker-${broker.id}/avatar`
    const { error: upErr } = await supabase.storage.from('profile-photos').upload(path, file, { upsert:true, cacheControl:'0', contentType:file.type })
    if (upErr) { toast('Upload failed', 'error'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(path)
    const photoUrl = `${publicUrl}?v=${Date.now()}`
    await supabase.from('brokers').update({ photo_url: photoUrl }).eq('id', broker.id)
    onBrokerUpdate?.({ ...broker, photo_url: photoUrl })
    toast('Photo updated')
    setUploading(false)
  }

  async function changePassword() {
    if (isDemo) { toast('Demo mode'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(broker?.email||'', { redirectTo:`${window.location.origin}?type=recovery` })
    if (error) toast('Failed to send reset email', 'error')
    else toast('Password reset email sent')
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 text-[11px] hover:text-gray-600 transition-colors mb-4">
        <ArrowLeft size={12}/> Back to clients
      </button>
      <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-0.5">Broker Settings</h1>
      <p className="text-[11px] text-gray-400 mb-5">Your account and preferences.</p>

      {/* Photo */}
      <Card className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Profile photo</div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-dark flex items-center justify-center text-xl font-bold text-brand-lime flex-shrink-0 overflow-hidden border-2 border-gray-200">
            {broker?.photo_url
              ? <img src={broker.photo_url} className="w-full h-full object-cover"/>
              : ini
            }
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 text-[12px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50">
              <Camera size={13}/> {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            <p className="text-[10px] text-gray-400 mt-1.5">JPG, PNG, WEBP · Max 2 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
        </div>
      </Card>

      {/* Profile */}
      <Card className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Personal details</div>
        <form onSubmit={saveProfile} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['Full name','name','text'],['Mobile','mobile','tel']].map(([lbl,k,type])=>(
              <div key={k}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Email <span className="normal-case font-normal text-gray-300">(read-only)</span></label>
            <input value={broker?.email||''} readOnly className="w-full px-3 py-2 border border-gray-100 rounded-lg text-[12px] bg-gray-50 text-gray-400 cursor-not-allowed"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Licence / credit rep details</label>
            <input value={form.licence} onChange={e=>set('licence',e.target.value)} placeholder="Credit Representative 574207 – ACL 486112"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors"/>
          </div>
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </Card>

      {/* Password */}
      <Card className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Password</div>
        <p className="text-[12px] text-gray-500 mb-3">Send a password reset link to your email address.</p>
        <button onClick={changePassword} className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
          Send reset email
        </button>
      </Card>

      {/* 2FA */}
      <Card>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Two-factor authentication</div>
        {isDemo
          ? <p className="text-[12px] text-gray-400">Not available in demo mode.</p>
          : mfaStatus === 'enabled'
            ? <div className="flex items-center gap-3">
                <span className="text-[12px] text-green-600 font-medium">✓ 2FA is enabled</span>
              </div>
            : <div>
                <p className="text-[12px] text-gray-500 mb-3">Secure your broker account with an authenticator app.</p>
                <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-3">To enable 2FA, go to <strong>Supabase Dashboard → Authentication → MFA</strong> and enrol your account, or contact your administrator.</p>
              </div>
        }
      </Card>
    </div>
  )
}
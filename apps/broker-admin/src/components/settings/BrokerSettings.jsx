import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft } from 'lucide-react'

export function BrokerSettings({ broker, onBack, isDemo }) {
  const [form, setForm] = useState({
    name:    broker?.name    || '',
    mobile:  broker?.mobile  || '',
    licence: broker?.licence || '',
  })
  const [saving, setSaving]       = useState(false)
  const [mfaStatus, setMfaStatus] = useState(null)
  const { show: toast }           = useToast()

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
    const { error } = await supabase.from('brokers').update(form).eq('id', broker.id)
    if (error) toast('Save failed', 'error')
    else toast('Profile saved')
    setSaving(false)
  }

  async function changePassword() {
    if (isDemo) { toast('Demo mode'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(broker?.email || '', {
      redirectTo: `${window.location.origin}?type=recovery`
    })
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

      {/* Profile */}
      <Card className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Personal details</div>
        <form onSubmit={saveProfile} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['Full name','name','text'],['Mobile','mobile','tel']].map(([lbl,key,type])=>(
              <div key={key}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{lbl}</label>
                <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)}
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
        <button onClick={changePassword}
          className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
          Send reset email
        </button>
      </Card>

      {/* 2FA */}
      <Card>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Two-factor authentication</div>
        {isDemo
          ? <p className="text-[12px] text-gray-400">2FA management not available in demo mode.</p>
          : mfaStatus === 'enabled'
            ? <div className="flex items-center gap-3">
                <span className="text-[12px] text-green-600 font-medium">✓ 2FA is enabled</span>
                <button onClick={async()=>{ await supabase.auth.mfa.unenroll({ factorId: '' }); setMfaStatus('disabled'); toast('2FA removed') }}
                  className="text-[11px] text-red-400 hover:text-red-600 transition-colors">Remove</button>
              </div>
            : <div>
                <p className="text-[12px] text-gray-500 mb-3">Add an extra layer of security to your broker account.</p>
                <button onClick={()=>toast('Open Supabase Auth settings to enroll TOTP — coming soon')}
                  className="px-4 py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker transition-colors">
                  Enable 2FA
                </button>
              </div>
        }
      </Card>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export function SignupScreen({ token }) {
  const [form, setForm]       = useState({ firstName:'', lastName:'', password:'', confirm:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error: pwErr } = await supabase.auth.updateUser({ password: form.password })
    if (pwErr) { setError(pwErr.message); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('clients').update({ first_name: form.firstName, last_name: form.lastName }).eq('id', user.id)
    }
    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-center max-w-sm">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h1>
        <p className="text-sm text-gray-500 mb-6">Your account is ready. You can now sign in to your portal.</p>
        <Button onClick={() => window.location.href = '/'}>Go to portal</Button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="JRW Finance" className="w-24 h-24 rounded-2xl object-cover shadow-lg"/>
        </div>
        <div className="bg-brand-dark border border-brand-lime/10 rounded-2xl p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-[#f0f4c0] mb-1">Welcome to JRW Finance</h1>
          <p className="text-xs text-brand-muted mb-6">Confirm your details and set a password to activate your portal.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[['First name','firstName'],['Last name','lastName']].map(([lbl,key])=>(
                <div key={key}>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1">{lbl}</label>
                  <input value={form[key]} onChange={e=>set(key,e.target.value)} required
                    className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] focus:outline-none focus:border-brand-lime/50 transition-all"/>
                </div>
              ))}
            </div>
            {[['Password','password','password'],['Confirm password','confirm','password']].map(([lbl,key,type])=>(
              <div key={key}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1">{lbl}</label>
                <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)} required minLength={8} placeholder="Min 8 characters"
                  className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] placeholder-brand-muted/50 focus:outline-none focus:border-brand-lime/50 transition-all"/>
              </div>
            ))}
            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</motion.p>}
            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'Setting up…' : 'Activate my account'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
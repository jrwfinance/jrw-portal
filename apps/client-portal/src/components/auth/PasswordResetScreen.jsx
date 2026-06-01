import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export function PasswordResetScreen() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Min 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true); setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-center max-w-sm text-[#f0f4c0]">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-xl font-bold mb-2">Password updated</h1>
        <p className="text-sm text-brand-muted mb-6">You can now sign in with your new password.</p>
        <Button onClick={() => window.location.href = '/'}>Sign in</Button>
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
          <h1 className="text-lg font-bold text-[#f0f4c0] mb-1">Set new password</h1>
          <p className="text-xs text-brand-muted mb-6">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['New password','password'],['Confirm password','confirm']].map(([lbl,key])=>(
              <div key={key}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1.5">{lbl}</label>
                <input type="password" value={key==='password'?password:confirm}
                  onChange={e=>key==='password'?setPassword(e.target.value):setConfirm(e.target.value)}
                  required minLength={8} placeholder="Min 8 characters"
                  className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] placeholder-brand-muted/50 focus:outline-none focus:border-brand-lime/50 transition-all"/>
              </div>
            ))}
            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</motion.p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Saving…' : 'Set new password'}</Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
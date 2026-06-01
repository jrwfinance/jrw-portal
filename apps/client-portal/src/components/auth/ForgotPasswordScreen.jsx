import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?type=recovery`
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="JRW Finance" className="w-24 h-24 rounded-2xl object-cover shadow-lg"/>
        </div>
        <div className="bg-brand-dark border border-brand-lime/10 rounded-2xl p-7 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="text-3xl mb-3">📧</div>
              <h1 className="text-base font-bold text-[#f0f4c0] mb-2">Check your email</h1>
              <p className="text-xs text-brand-muted mb-5">We sent a reset link to <span className="text-brand-lime">{email}</span>. Follow the link to set a new password.</p>
              <button onClick={onBack} className="text-xs text-brand-muted hover:text-brand-lime transition-colors">Back to sign in</button>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold text-[#f0f4c0] mb-1">Forgot password?</h1>
              <p className="text-xs text-brand-muted mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] placeholder-brand-muted/50 focus:outline-none focus:border-brand-lime/50 transition-all"/>
                </div>
                {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</motion.p>}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
              </form>
              <button onClick={onBack} className="w-full text-center text-xs text-brand-muted/60 hover:text-brand-muted mt-4 transition-colors">Back to sign in</button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
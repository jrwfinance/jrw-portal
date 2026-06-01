import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export function LoginScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 bg-brand-dark rounded-lg border border-brand-lime/30 flex items-center justify-center">
            <span className="text-brand-lime font-bold text-sm">JW</span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#f0f4c0] leading-tight">JRW Finance</div>
            <div className="text-[10px] text-brand-muted">Client Portal</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-brand-dark border border-brand-lime/10 rounded-2xl p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-[#f0f4c0] mb-1">Welcome back</h1>
          <p className="text-xs text-brand-muted mb-6">Sign in to your portal</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] placeholder-brand-muted/50 focus:outline-none focus:border-brand-lime/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-xs bg-white/7 border border-brand-lime/20 text-[#f0f4c0] placeholder-brand-muted/50 focus:outline-none focus:border-brand-lime/50 focus:bg-white/10 transition-all"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] text-brand-muted/60 mt-6">
          JRW Finance Group · ABN 57 691 406 318
        </p>
      </motion.div>
    </div>
  )
}
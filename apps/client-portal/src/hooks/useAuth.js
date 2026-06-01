import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (session?.user?.id) pingLastActive(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session?.user?.id) pingLastActive(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}

async function pingLastActive(userId) {
  await supabase.from('clients').update({ last_active_at: new Date().toISOString() }).eq('id', userId)
}
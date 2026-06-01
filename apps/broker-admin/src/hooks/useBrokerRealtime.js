import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useBrokerRealtime(clientId, onUpdate) {
  useEffect(() => {
    if (!clientId) return
    const channel = supabase
      .channel(`broker-client-${clientId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notes',
        filter: `client_id=eq.${clientId}`
      }, () => onUpdate('notes'))
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'documents',
        filter: `client_id=eq.${clientId}`
      }, () => onUpdate('documents'))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [clientId, onUpdate])
}
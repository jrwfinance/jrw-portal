import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtime(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`client-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'alerts',
        filter: `client_id=eq.${userId}`
      }, () => onUpdate('alerts'))
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notes',
        filter: `client_id=eq.${userId}`
      }, () => onUpdate('notes'))
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'alerts',
        filter: `client_id=eq.${userId}`
      }, () => onUpdate('alerts'))
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'documents',
        filter: `client_id=eq.${userId}`
      }, () => onUpdate('documents'))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onUpdate])
}
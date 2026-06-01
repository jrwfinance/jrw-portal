import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useClientData(userId) {
  const [data, setData] = useState({
    profile: null, properties: [], loans: [], goals: [],
    notes: [], alerts: [], documents: [], research: [],
  })
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const [profile, properties, loans, goals, notes, alerts, documents, research] = await Promise.all([
      supabase.from('clients').select('*').eq('id', userId).single(),
      supabase.from('properties').select('*').eq('client_id', userId).order('created_at'),
      supabase.from('loans').select('*').eq('client_id', userId).order('created_at'),
      supabase.from('goals').select('*').eq('client_id', userId).order('created_at'),
      supabase.from('notes').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
      supabase.from('alerts').select('*').eq('client_id', userId).eq('dismissed', false).order('created_at', { ascending: false }),
      supabase.from('documents').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
      supabase.from('research').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    ])
    setData({
      profile:    profile.data,
      properties: properties.data || [],
      loans:      loans.data || [],
      goals:      goals.data || [],
      notes:      notes.data || [],
      alerts:     alerts.data || [],
      documents:  documents.data || [],
      research:   research.data || [],
    })
    setLoading(false)
  }, [userId])

  return { data, loading, load, setData }
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Convert empty strings to null for date/number fields
const cleanForm = (values) => ({
  ...values,
  billing_cycle_start: values.billing_cycle_start || null,
  project_deadline:    values.project_deadline    || null,
  monthly_rate:        values.monthly_rate        ? Number(values.monthly_rate)  : null,
  project_value:       values.project_value       ? Number(values.project_value) : null,
})

export function useClients(userId, isAdmin) {
  const [clients, setClients]   = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (isAdmin) query = query.eq('user_id', userId)
    const { data, error } = await query
    if (!error) setClients(data || [])
    setLoading(false)
  }, [userId, isAdmin])

  useEffect(() => { fetch() }, [fetch])

  const addClient = async (values) => {
    const { error } = await supabase
      .from('clients')
      .insert({ ...cleanForm(values), user_id: userId })
    if (!error) fetch()
    return error
  }

  const updateClient = async (id, values) => {
    const { error } = await supabase
      .from('clients')
      .update({ ...cleanForm(values), updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) fetch()
    return error
  }

  const deleteClient = async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) fetch()
    return error
  }

  const markPaid = async (client) => {
    const now   = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return updateClient(client.id, { payment_status: 'paid', last_paid_month: month })
  }

  return { clients, loading, addClient, updateClient, deleteClient, markPaid, refetch: fetch }
}
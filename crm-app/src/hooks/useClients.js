import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

export function useClients(userId, isAdmin) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    if (isAdmin && !userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const ref = collection(db, 'clients')
      // Query without composite index requirement:
      let q = isAdmin && userId
        ? query(ref, where('user_id', '==', userId))
        : ref

      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(d => {
        const raw = d.data()
        return {
          id: d.id,
          ...raw,
          created_at: raw.created_at?.toDate?.()
            ? raw.created_at.toDate().toISOString()
            : (raw.created_at || new Date().toISOString()),
          updated_at: raw.updated_at?.toDate?.()
            ? raw.updated_at.toDate().toISOString()
            : (raw.updated_at || new Date().toISOString()),
        }
      })

      // Sort client-side by newest first
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setClients(data)
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
    setLoading(false)
  }, [userId, isAdmin])

  useEffect(() => { fetchClients() }, [fetchClients])

  const addClient = async (values) => {
    if (!userId) return new Error('User ID is required to add a client.')
    try {
      await addDoc(collection(db, 'clients'), {
        ...cleanForm(values),
        user_id: userId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
      fetchClients()
      return null
    } catch (err) {
      console.error('Error adding client:', err)
      return err
    }
  }

  const updateClient = async (id, values) => {
    try {
      const ref = doc(db, 'clients', id)
      await updateDoc(ref, {
        ...cleanForm(values),
        updated_at: serverTimestamp(),
      })
      fetchClients()
      return null
    } catch (err) {
      console.error('Error updating client:', err)
      return err
    }
  }

  const deleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, 'clients', id))
      fetchClients()
      return null
    } catch (err) {
      console.error('Error deleting client:', err)
      return err
    }
  }

  const markPaid = async (client) => {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return updateClient(client.id, { payment_status: 'paid', last_paid_month: month })
  }

  return { clients, loading, addClient, updateClient, deleteClient, markPaid, refetch: fetchClients }
}

// Convert empty strings to null for date/number fields, strip out `id` so it doesn't get written as a field
function cleanForm(values) {
  const { id, created_at, updated_at, ...rest } = values
  return {
    ...rest,
    billing_cycle_start: rest.billing_cycle_start || null,
    project_deadline:    rest.project_deadline    || null,
    monthly_rate:        rest.monthly_rate        ? Number(rest.monthly_rate)  : null,
    project_value:       rest.project_value       ? Number(rest.project_value) : null,
  }
}
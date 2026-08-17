import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    getDoc(doc(db, 'profiles', userId))
      .then((snap) => {
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() })
        } else {
          setProfile(null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Profile fetch error:', err)
        setProfile(null)
        setLoading(false)
      })
  }, [userId])

  return { profile, loading }
}
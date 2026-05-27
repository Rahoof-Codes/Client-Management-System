import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import LoginPage from '../pages/LoginPage'

export default function AuthGuard({ children }) {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(undefined)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      if (data.session) fetchProfile(data.session.user.id)
      else setProfile(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null)
      if (s) fetchProfile(s.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined || profile === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-[--color-bg]">
        <div className="w-8 h-8 border-4 border-[--color-primary] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || !profile) return <LoginPage />

  return children(session.user, profile)
}
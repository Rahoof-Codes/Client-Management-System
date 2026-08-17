import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import LoginPage from '../pages/LoginPage'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AuthGuard({ children }) {
  const [user, setUser]       = useState(undefined)
  const [profile, setProfile] = useState(undefined)
  const [error, setError]     = useState(null)

  const fetchProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'profiles', uid))
      if (snap.exists()) {
        setProfile({ id: snap.id, ...snap.data() })
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user === undefined) setError('connection_timeout')
    }, 10000)

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout)
      if (firebaseUser) {
        setUser(firebaseUser)
        fetchProfile(firebaseUser.uid)
      } else {
        setUser(null)
        setProfile(null)
      }
    }, (err) => {
      clearTimeout(timeout)
      console.error('Auth state error:', err)
      setError('auth_error')
    })

    return () => { clearTimeout(timeout); unsubscribe() }
  }, [])

  // ── Error State ──
  if (error) {
    const messages = {
      connection_timeout: {
        title: 'Connection Timeout',
        desc: 'Could not connect to Firebase. Please check your network connection.',
        hint: 'Make sure your Firebase project is active and config is correct.',
      },
      auth_error: {
        title: 'Authentication Error',
        desc: 'Something went wrong while checking your session.',
        hint: 'Try refreshing the page.',
      },
    }
    const msg = messages[error] || messages.auth_error

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--th-bg-gradient)' }}>
        <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-fade-in-scale text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--th-danger-bg)' }}>
            <AlertTriangle className="w-7 h-7" style={{ color: 'var(--color-danger)' }} />
          </div>
          <h2 className="text-xl font-bold font-[--font-display] mb-2" style={{ color: 'var(--th-text)' }}>
            {msg.title}
          </h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--th-text-secondary)' }}>{msg.desc}</p>
          <p className="text-xs mb-6" style={{ color: 'var(--th-muted)' }}>{msg.hint}</p>
          <button onClick={() => window.location.reload()}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
      </div>
    )
  }

  // ── Loading State ──
  if (user === undefined || profile === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: 'var(--th-bg-gradient)' }}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full" style={{ border: '2px solid var(--th-border)', borderTopColor: 'var(--color-primary)', animation: 'spin 0.8s linear infinite' }} />
          <div className="absolute inset-0 w-12 h-12 rounded-full" style={{ animation: 'pulseRing 1.5s ease-out infinite', border: '2px solid var(--th-primary-glow)' }} />
        </div>
        <div className="text-center animate-fade-in">
          <p className="text-sm font-medium" style={{ color: 'var(--th-text)' }}>Connecting to ClientOS</p>
          <p className="text-xs mt-1" style={{ color: 'var(--th-muted)' }}>Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) return <LoginPage />
  return children(user, profile)
}
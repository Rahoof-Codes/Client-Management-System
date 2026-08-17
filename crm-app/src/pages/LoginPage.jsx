import { useState } from 'react'
import { auth, db } from '../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { ShieldCheck, Users, LogIn, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme()
  const [role, setRole]             = useState(null)
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPass] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const profileSnap = await getDoc(doc(db, 'profiles', cred.user.uid))
      if (!profileSnap.exists() || profileSnap.data().role !== role) {
        await auth.signOut()
        setError(`This account does not have ${role} access.`)
        setLoading(false)
        return
      }
      setLoading(false)
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      }
      setError(messages[err.code] || err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--th-bg-gradient)' }}>

      {/* Theme Toggle */}
      <button onClick={toggleTheme} className="theme-toggle absolute top-5 right-5 z-20" title="Toggle theme">
        <div className="toggle-thumb">
          {theme === 'light'
            ? <Sun className="w-3 h-3 text-white" />
            : <Moon className="w-3 h-3 text-white" />}
        </div>
      </button>

      {/* Ambient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-60 animate-float"
        style={{ background: `radial-gradient(circle, var(--th-orb-1) 0%, transparent 70%)` }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-50 animate-float"
        style={{ background: `radial-gradient(circle, var(--th-orb-2) 0%, transparent 70%)`, animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[15%] w-[250px] h-[250px] rounded-full opacity-40 animate-float"
        style={{ background: `radial-gradient(circle, var(--th-orb-3) 0%, transparent 70%)`, animationDelay: '1.5s' }} />

      <div className="w-full max-w-md space-y-6 relative z-10">

        {/* Branding */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--th-primary-light)', border: '1px solid var(--th-primary-glow)', boxShadow: `0 0 20px var(--th-primary-glow)` }}>
            <span className="text-2xl font-extrabold text-gradient font-[--font-display]">C</span>
          </div>
          <h1 className="text-3xl font-extrabold font-[--font-display] text-gradient">ClientOS</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--th-text-secondary)' }}>Choose your role to sign in</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button type="button" onClick={() => { setRole('admin'); setError('') }}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 cursor-pointer ${role === 'admin' ? 'glass-card' : 'glass glass-hover'}`}
            style={role === 'admin' ? { borderColor: 'var(--th-primary-glow)', background: 'var(--th-primary-light)', boxShadow: `0 0 20px var(--th-primary-glow)` } : {}}>
            <div className={`p-3 rounded-xl transition-all duration-300`}
              style={role === 'admin' ? { background: 'linear-gradient(135deg, #7c5cfc, #a78bfa)', boxShadow: '0 4px 20px var(--th-primary-glow)' } : { background: 'var(--th-surface)' }}>
              <ShieldCheck className={`w-6 h-6 ${role === 'admin' ? 'text-white' : ''}`} style={role !== 'admin' ? { color: 'var(--th-muted)' } : {}} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm" style={{ color: role === 'admin' ? 'var(--color-primary)' : 'var(--th-text)' }}>Admin</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--th-muted)' }}>Full access</div>
            </div>
            {role === 'admin' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse-glow" style={{ background: 'var(--color-primary)' }} />}
          </button>

          <button type="button" onClick={() => { setRole('staff'); setError('') }}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 cursor-pointer ${role === 'staff' ? 'glass-card' : 'glass glass-hover'}`}
            style={role === 'staff' ? { borderColor: 'rgba(56,189,248,0.3)', background: 'var(--th-accent-light)', boxShadow: '0 0 20px rgba(56,189,248,0.12)' } : {}}>
            <div className="p-3 rounded-xl transition-all duration-300"
              style={role === 'staff' ? { background: 'linear-gradient(135deg, #38bdf8, #22d3ee)', boxShadow: '0 4px 20px rgba(56,189,248,0.3)' } : { background: 'var(--th-surface)' }}>
              <Users className={`w-6 h-6 ${role === 'staff' ? 'text-white' : ''}`} style={role !== 'staff' ? { color: 'var(--th-muted)' } : {}} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm" style={{ color: role === 'staff' ? 'var(--color-accent)' : 'var(--th-text)' }}>Staff</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--th-muted)' }}>View only</div>
            </div>
            {role === 'staff' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)', animation: 'pulseGlow 2.5s ease-in-out infinite' }} />}
          </button>
        </div>

        {/* Login Form */}
        <div className={`transition-all duration-500 ${role ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-1.5 rounded-lg" style={{ background: role === 'admin' ? 'var(--th-primary-light)' : 'var(--th-accent-light)' }}>
                {role === 'admin'
                  ? <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  : <Users className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />}
              </div>
              <span className="font-semibold text-sm capitalize" style={{ color: 'var(--th-text)' }}>Sign in as {role}</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--th-text-secondary)' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--th-text-secondary)' }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="glass-input w-full px-4 py-2.5 pr-10 rounded-xl text-sm" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--th-muted)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-sm px-4 py-3 rounded-xl animate-fade-in"
                  style={{ background: 'var(--th-danger-bg)', border: '1px solid rgba(239,68,68,0.15)', color: 'var(--color-danger)' }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading || !role}
                className="btn-gradient w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                {loading ? 'Signing in…' : `Sign in as ${role || '…'}`}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs animate-fade-in" style={{ color: 'var(--th-muted)', animationDelay: '0.3s' }}>
          Powered by Firebase Auth · Firestore
        </p>
      </div>
    </div>
  )
}
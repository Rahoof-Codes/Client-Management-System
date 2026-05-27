import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { ShieldCheck, Users, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [role, setRole]         = useState(null)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile || profile.role !== role) {
      await supabase.auth.signOut()
      setError(`This account does not have ${role} access.`)
      setLoading(false)
      return
    }

    setLoading(false)
  }

  const isAdmin = role === 'admin'
  const accent  = isAdmin ? 'indigo' : 'violet'

  return (
    <div className="min-h-screen bg-[--color-bg] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">

        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold font-[--font-display] text-[--color-text]">ClientOS</h1>
          <p className="text-[--color-muted] text-sm mt-1">Choose your role to sign in</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Admin Card */}
          <button
            type="button"
            onClick={() => { setRole('admin'); setError('') }}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              role === 'admin'
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-[--color-border] bg-white hover:border-indigo-300'
            }`}
          >
            <div className={`p-3 rounded-xl ${role === 'admin' ? 'bg-indigo-500' : 'bg-slate-100'}`}>
              <ShieldCheck className={`w-6 h-6 ${role === 'admin' ? 'text-white' : 'text-[--color-muted]'}`} />
            </div>
            <div className="text-center">
              <div className={`font-semibold text-sm ${role === 'admin' ? 'text-indigo-600' : 'text-[--color-text]'}`}>
                Admin
              </div>
              <div className="text-xs text-[--color-muted]">Full access</div>
            </div>
            {role === 'admin' && (
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {/* Staff Card */}
          <button
            type="button"
            onClick={() => { setRole('staff'); setError('') }}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              role === 'staff'
                ? 'border-violet-400 bg-violet-50 shadow-md'
                : 'border-[--color-border] bg-white hover:border-violet-300'
            }`}
          >
            <div className={`p-3 rounded-xl ${role === 'staff' ? 'bg-violet-400' : 'bg-slate-100'}`}>
              <Users className={`w-6 h-6 ${role === 'staff' ? 'text-white' : 'text-[--color-muted]'}`} />
            </div>
            <div className="text-center">
              <div className={`font-semibold text-sm ${role === 'staff' ? 'text-violet-600' : 'text-[--color-text]'}`}>
                Staff
              </div>
              <div className="text-xs text-[--color-muted]">View only</div>
            </div>
            {role === 'staff' && (
              <div className="w-2 h-2 rounded-full bg-violet-400" />
            )}
          </button>
        </div>

        {/* Login Form — appears after role selected */}
        <div className={`transition-all duration-300 ${role ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-[--color-border] p-6">

            {/* Form header */}
            <div className="flex items-center gap-2 mb-5">
              {role === 'admin'
                ? <ShieldCheck className="w-4 h-4 text-indigo-500" />
                : <Users className="w-4 h-4 text-violet-500" />}
              <span className="font-semibold text-sm text-[--color-text] capitalize">
                Sign in as {role}
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[--color-text] block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[--color-text] block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2.5 rounded-xl">{error}</p>
              )}

              {/* ✅ Sign In Button — same style for both roles */}
              <button
                type="submit"
                disabled={loading || !role}
                className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm ${
                  role === 'admin'
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : 'bg-violet-400 hover:bg-violet-500'
                }`}
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Signing in…' : `Sign in as ${role || '…'}`}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
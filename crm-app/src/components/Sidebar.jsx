import { LayoutDashboard, LogOut, ShieldCheck, Users, Sun, Moon } from 'lucide-react'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar({ user, profile }) {
  const { theme, toggleTheme } = useTheme()
  const isAdmin = profile?.role === 'admin'
  const initials = (profile?.full_name || user.email || '?')
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0].toUpperCase())
    .join('')

  return (
    <aside className="w-[260px] shrink-0 flex flex-col min-h-screen glass animate-slide-in-right"
      style={{ borderRight: '1px solid var(--th-border)', background: 'var(--th-sidebar-bg)' }}>

      {/* ── Logo & Top Theme Switcher ── */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--th-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--th-primary-light)', border: '1px solid var(--th-primary-glow)' }}>
              <span className="text-sm font-extrabold text-gradient font-[--font-display]">C</span>
            </div>
            <span className="font-bold text-lg font-[--font-display] text-gradient">ClientOS</span>
          </div>

          {/* Theme Toggle at top */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Bright'} mode`}
          >
            <div className="toggle-thumb">
              {theme === 'light'
                ? <Sun className="w-3 h-3 text-white" />
                : <Moon className="w-3 h-3 text-white" />}
            </div>
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
            isAdmin
              ? 'text-[--color-primary]'
              : 'text-[--color-accent]'
          }`}
          style={{ background: isAdmin ? 'var(--th-primary-light)' : 'var(--th-accent-light)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: 'var(--th-text)' }}>{profile?.full_name || user.email}</div>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: isAdmin ? 'var(--th-primary-light)' : 'var(--th-accent-light)',
                color: isAdmin ? 'var(--color-primary)' : 'var(--color-accent)'
              }}>
              {isAdmin
                ? <><ShieldCheck className="w-2.5 h-2.5" /> Admin</>
                : <><Users className="w-2.5 h-2.5" /> Staff</>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 p-3 space-y-1">
        <a href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--th-primary-light)',
            color: 'var(--color-primary)',
            borderLeft: '3px solid var(--color-primary)',
          }}>
          <LayoutDashboard className="w-4 h-4" />
          {isAdmin ? 'Dashboard' : 'Client List'}
        </a>
      </nav>

      {/* ── Sign Out at Bottom ── */}
      <div className="p-3" style={{ borderTop: '1px solid var(--th-border)' }}>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 hover:text-[--color-danger] cursor-pointer"
          style={{ background: 'transparent', color: 'var(--th-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--th-danger-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
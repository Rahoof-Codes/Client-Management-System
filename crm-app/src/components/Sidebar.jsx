import { LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Sidebar({ user, profile }) {
  const isAdmin = profile?.role === 'admin'

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[--color-border] flex flex-col min-h-screen">
      <div className="p-6 border-b border-[--color-border]">
        <div className="font-bold text-lg font-[--font-display] text-[--color-primary]">ClientOS</div>
        <div className="text-xs text-[--color-muted] mt-0.5 truncate">{user.email}</div>
        {/* Role badge */}
        <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isAdmin ? 'bg-[--color-primary-light] text-[--color-primary]' : 'bg-indigo-50 text-indigo-500'
        }`}>
          {isAdmin
            ? <><ShieldCheck className="w-3 h-3" /> Admin</>
            : <><Users className="w-3 h-3" /> Staff</>}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[--color-primary-light] text-[--color-primary] font-medium text-sm">
          <LayoutDashboard className="w-4 h-4" />
          {isAdmin ? 'Dashboard' : 'Client List'}
        </a>
      </nav>

      <div className="p-3 border-t border-[--color-border]">
        <button onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[--color-muted] hover:bg-rose-50 hover:text-rose-500 text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
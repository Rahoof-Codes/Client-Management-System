import { useState, useMemo } from 'react'
import { useClients } from '../hooks/useClients'
import Sidebar from '../components/Sidebar'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import ClientTable from '../components/ClientTable'
import ClientModal from '../components/ClientModal'
import StaffClientTable from '../components/StaffClientTable'
import { Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function DashboardPage({ user, profile }) {
  const { theme, toggleTheme } = useTheme()
  const isAdmin = profile?.role === 'admin'
  const userId = user?.uid || user?.id
  const { clients, loading, addClient, updateClient, deleteClient, markPaid } = useClients(userId, isAdmin)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort]     = useState('created_at')
  const [modal, setModal]   = useState(null)

  const filtered = useMemo(() => {
    let list = [...clients]
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
    )
    if (filter !== 'all') list = list.filter(c => c.type === filter)
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'payment_status') return a.payment_status.localeCompare(b.payment_status)
      return new Date(b.created_at) - new Date(a.created_at)
    })
    return list
  }, [clients, search, filter, sort])

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Company','Type','Monthly Rate','Project Value','Deadline','Status','Notes']
    const rows = clients.map(c => [
      c.name, c.email, c.phone, c.company, c.type,
      c.monthly_rate, c.project_value,
      c.project_deadline || c.billing_cycle_start,
      c.payment_status, (c.notes || '').replace(/,/g, ';')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `clients-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  const handleSave = async (form) => {
    if (form.id) return updateClient(form.id, form)
    return addClient(form)
  }

  // Get greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex min-h-screen"
      style={{ background: 'var(--th-bg)' }}>
      <Sidebar user={user} profile={profile} />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* Page Header with Top Theme Toggle */}
          <div className="flex items-start justify-between mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold font-[--font-display] text-gradient">
                {isAdmin ? 'Client Dashboard' : 'Client List'}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--th-text-secondary)' }}>
                {greeting} — {clients.length} clients ·{' '}
                {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
                {!isAdmin && <span className="ml-2 text-[--color-accent] font-medium">· Staff View</span>}
              </p>
            </div>

            {/* Top-Right Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full glass glass-hover cursor-pointer transition-all duration-300 shadow-sm"
              style={{ border: '1px solid var(--th-border)', background: 'var(--th-surface)' }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Bright'} mode`}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--th-text)' }}>
                {theme === 'light' ? 'Bright' : 'Dark'}
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: theme === 'light' ? 'rgba(245,158,11,0.15)' : 'rgba(124,92,252,0.2)' }}>
                {theme === 'light'
                  ? <Sun className="w-3.5 h-3.5 text-amber-500" />
                  : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
            </button>
          </div>

          {/* Admin-only: Stats + full controls */}
          {isAdmin && (
            <>
              <StatsBar clients={clients} />
              <FilterBar
                search={search} setSearch={setSearch}
                filter={filter} setFilter={setFilter}
                sort={sort}     setSort={setSort}
                onExport={exportCSV}
                onAdd={() => setModal({})}
              />
            </>
          )}

          {/* Staff: simple search only */}
          {!isAdmin && (
            <div className="relative mb-4 max-w-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--th-muted)' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search clients…"
                className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="glass-card rounded-2xl py-20 text-center animate-fade-in">
              <div className="inline-block w-8 h-8 rounded-full mb-3"
                style={{ border: '2px solid var(--th-border)', borderTopColor: 'var(--color-primary)', animation: 'spin 0.8s linear infinite' }} />
              <p className="text-sm" style={{ color: 'var(--th-muted)' }}>Loading clients…</p>
            </div>
          ) : isAdmin ? (
            <ClientTable
              clients={filtered}
              onEdit={setModal}
              onDelete={deleteClient}
              onMarkPaid={markPaid}
            />
          ) : (
            <StaffClientTable clients={filtered} />
          )}

        </div>
      </main>

      {/* Admin-only modal */}
      {isAdmin && modal !== null && (
        <ClientModal
          client={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
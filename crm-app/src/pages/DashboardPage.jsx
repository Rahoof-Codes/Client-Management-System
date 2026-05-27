import { useState, useMemo } from 'react'
import { useClients } from '../hooks/useClients'
import Sidebar from '../components/Sidebar'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import ClientTable from '../components/ClientTable'
import ClientModal from '../components/ClientModal'
import StaffClientTable from '../components/StaffClientTable'
import { Search } from 'lucide-react'

export default function DashboardPage({ user, profile }) {
  const isAdmin = profile?.role === 'admin'
  const { clients, loading, addClient, updateClient, deleteClient, markPaid } = useClients(user.id, isAdmin)

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

  return (
    <div className="flex min-h-screen bg-[--color-bg]">
      <Sidebar user={user} profile={profile} />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-[--font-display]">
              {isAdmin ? 'Client Dashboard' : 'Client List'}
            </h1>
            <p className="text-[--color-muted] text-sm mt-0.5">
              {clients.length} clients ·{' '}
              {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
              {!isAdmin && <span className="ml-2 text-indigo-400 font-medium">· Staff View</span>}
            </p>
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
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-muted]" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search clients…"
                className="pl-9 pr-4 py-2 rounded-xl border border-[--color-border] text-sm w-full focus:outline-none focus:ring-2 focus:ring-[--color-primary] bg-white"
              />
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="text-center py-20 text-[--color-muted]">Loading…</div>
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
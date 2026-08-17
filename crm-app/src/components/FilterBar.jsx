import { Search, Download, Plus } from 'lucide-react'

export default function FilterBar({ search, setSearch, filter, setFilter, sort, setSort, onExport, onAdd }) {
  return (
    <div className="space-y-3 mb-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      {/* Add Button */}
      <button
        onClick={onAdd}
        className="btn-gradient w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add New Client
      </button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--th-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or company…"
          className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="glass-input flex-1 px-3 py-2 rounded-xl text-sm cursor-pointer"
        >
          <option value="all" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>All Types</option>
          <option value="monthly" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>Monthly</option>
          <option value="onetime" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>One-Time</option>
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="glass-input flex-1 px-3 py-2 rounded-xl text-sm cursor-pointer"
        >
          <option value="created_at" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>Newest First</option>
          <option value="name" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>Name A–Z</option>
          <option value="payment_status" style={{ background: 'var(--th-dropdown-bg)', color: 'var(--th-text)' }}>By Status</option>
        </select>

        <button
          onClick={onExport}
          className="glass glass-hover flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer"
          style={{ color: 'var(--th-text-secondary)' }}
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>
    </div>
  )
}
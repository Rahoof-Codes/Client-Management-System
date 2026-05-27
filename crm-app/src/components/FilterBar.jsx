import { Search, Download, Plus } from 'lucide-react'

export default function FilterBar({ search, setSearch, filter, setFilter, sort, setSort, onExport, onAdd }) {
  return (
    <div className="space-y-3 mb-6">
      <button
        onClick={onAdd}
        style={{ backgroundColor: '#4f46e5' }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white font-semibold text-sm shadow-sm"
      >
        <Plus size={18} color="white" />
        <span style={{ color: 'white' }}>Add New Client</span>
      </button>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or company…"
          className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
        >
          <option value="all">All Types</option>
          <option value="monthly">Monthly</option>
          <option value="onetime">One-Time</option>
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
        >
          <option value="created_at">Newest First</option>
          <option value="name">Name A–Z</option>
          <option value="payment_status">By Status</option>
        </select>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-100 transition-colors bg-white"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>
    </div>
  )
}
import { format } from 'date-fns'
import { Pencil, Trash2, CheckCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function ClientTable({ clients, onEdit, onDelete, onMarkPaid }) {
  const handleDelete = (client) => {
    if (window.confirm(`Delete "${client.name}"? This cannot be undone.`)) {
      onDelete(client.id)
    }
  }

  if (clients.length === 0)
    return (
      <div className="text-center py-20 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
        No clients yet. Click <strong>Add New Client</strong> to get started.
      </div>
    )

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-xs uppercase tracking-wide">
            <th className="text-left px-5 py-3">Client</th>
            <th className="text-left px-5 py-3">Type</th>
            <th className="text-left px-5 py-3">Value</th>
            <th className="text-left px-5 py-3">Deadline / Cycle</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-800">{c.name}</div>
                <div className="text-slate-400 text-xs">{c.email}</div>
                {c.company && <div className="text-slate-400 text-xs">{c.company}</div>}
              </td>
              <td className="px-5 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  c.type === 'monthly' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'
                }`}>
                  {c.type === 'monthly' ? '📅 Monthly' : '💼 One-Time'}
                </span>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-700">
                {c.type === 'monthly'
                  ? `₹${(c.monthly_rate || 0).toLocaleString()}/mo`
                  : `₹${(c.project_value || 0).toLocaleString()}`}
              </td>
              <td className="px-5 py-4 text-slate-400 text-xs">
                {c.type === 'monthly'
                  ? c.billing_cycle_start ? `Cycle: ${format(new Date(c.billing_cycle_start), 'MMM d')}` : '—'
                  : c.project_deadline ? format(new Date(c.project_deadline), 'MMM d, yyyy') : '—'}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={c.payment_status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  {c.type === 'monthly' && c.payment_status !== 'paid' && (
                    <button
                      onClick={() => onMarkPaid(c)}
                      title="Mark as Paid"
                      className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(c)}
                    title="Edit"
                    className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    title="Delete"
                    className="p-2 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
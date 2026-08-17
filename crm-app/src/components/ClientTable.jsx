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
      <div className="glass-card rounded-2xl text-center py-20 animate-fade-in">
        <p className="text-sm" style={{ color: 'var(--th-muted)' }}>
          No clients yet. Click <strong style={{ color: 'var(--color-primary)' }}>Add New Client</strong> to get started.
        </p>
      </div>
    )

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--th-table-header)', borderBottom: '1px solid var(--th-border)' }}>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Client</th>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Type</th>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Value</th>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Deadline / Cycle</th>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Status</th>
              <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--th-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <tr
                key={c.id}
                className="animate-fade-in transition-colors duration-200"
                style={{
                  animationDelay: `${0.35 + i * 0.04}s`,
                  borderBottom: '1px solid var(--th-border)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--th-table-row-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="px-5 py-4">
                  <div className="font-semibold" style={{ color: 'var(--th-text)' }}>{c.name}</div>
                  <div className="text-xs" style={{ color: 'var(--th-muted)' }}>{c.email}</div>
                  {c.company && <div className="text-xs" style={{ color: 'var(--th-muted)' }}>{c.company}</div>}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: c.type === 'monthly' ? 'var(--th-primary-light)' : 'var(--th-accent-light)',
                      color: c.type === 'monthly' ? 'var(--color-primary)' : 'var(--color-accent)',
                      border: `1px solid ${c.type === 'monthly' ? 'var(--th-primary-glow)' : 'rgba(56,189,248,0.2)'}`,
                    }}
                  >
                    {c.type === 'monthly' ? '📅 Monthly' : '💼 One-Time'}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold" style={{ color: 'var(--th-text)' }}>
                  {c.type === 'monthly'
                    ? `₹${(c.monthly_rate || 0).toLocaleString()}/mo`
                    : `₹${(c.project_value || 0).toLocaleString()}`}
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: 'var(--th-muted)' }}>
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
                        className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
                        style={{ background: 'transparent', color: 'var(--color-success)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--th-success-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(c)}
                      title="Edit"
                      className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
                      style={{ background: 'transparent', color: 'var(--color-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--th-primary-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      title="Delete"
                      className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
                      style={{ background: 'transparent', color: 'var(--color-danger)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--th-danger-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
    </div>
  )
}
import { FileText } from 'lucide-react'

export default function StaffClientTable({ clients }) {
  if (clients.length === 0)
    return (
      <div className="glass-card rounded-2xl text-center py-20 animate-fade-in">
        <p className="text-sm" style={{ color: 'var(--th-muted)' }}>No clients yet.</p>
      </div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {clients.map((c, i) => (
        <div
          key={c.id}
          className="glass-card rounded-2xl p-5 animate-fade-in"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold font-[--font-display]" style={{ color: 'var(--th-text)' }}>{c.name}</h3>
              {c.company && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--th-muted)' }}>{c.company}</p>
              )}
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
              style={{
                background: c.type === 'monthly' ? 'var(--th-primary-light)' : 'var(--th-accent-light)',
                color: c.type === 'monthly' ? 'var(--color-primary)' : 'var(--color-accent)',
                border: `1px solid ${c.type === 'monthly' ? 'var(--th-primary-glow)' : 'rgba(56,189,248,0.2)'}`,
              }}
            >
              {c.type === 'monthly' ? 'Monthly' : 'One-Time'}
            </span>
          </div>

          {/* Requirements / Notes */}
          <div className="mt-3">
            {c.notes ? (
              <div className="rounded-xl p-3" style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: 'var(--th-muted)' }} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--th-muted)' }}>Requirements</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--th-text-secondary)' }}>{c.notes}</p>
              </div>
            ) : (
              <p className="text-xs italic" style={{ color: 'var(--th-muted)' }}>No requirements added yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
import { FileText } from 'lucide-react'

export default function StaffClientTable({ clients }) {
  if (clients.length === 0)
    return <div className="text-center py-20 text-[--color-muted] text-sm">No clients yet.</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {clients.map(c => (
        <div key={c.id} className="bg-white rounded-2xl border border-[--color-border] shadow-sm p-5 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-[--color-text] font-[--font-display]">{c.name}</h3>
              {c.company && (
                <p className="text-xs text-[--color-muted] mt-0.5">{c.company}</p>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
              c.type === 'monthly' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'
            }`}>
              {c.type === 'monthly' ? 'Monthly' : 'One-Time'}
            </span>
          </div>

          {/* Requirements / Notes */}
          <div className="mt-3">
            {c.notes ? (
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-[--color-muted]" />
                  <span className="text-xs font-medium text-[--color-muted] uppercase tracking-wide">Requirements</span>
                </div>
                <p className="text-sm text-[--color-text] leading-relaxed whitespace-pre-wrap">{c.notes}</p>
              </div>
            ) : (
              <p className="text-xs text-[--color-muted] italic">No requirements added yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
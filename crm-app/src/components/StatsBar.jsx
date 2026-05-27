import { DollarSign, Users, AlertCircle, CheckCircle } from 'lucide-react'

export default function StatsBar({ clients }) {
  const outstanding = clients
    .filter(c => c.payment_status !== 'paid')
    .reduce((sum, c) => {
      if (c.type === 'monthly') return sum + (c.monthly_rate || 0)
      if (c.type === 'onetime') return sum + (c.project_value || 0)
      return sum
    }, 0)

  const paid    = clients.filter(c => c.payment_status === 'paid').length
  const pending = clients.filter(c => c.payment_status === 'pending').length
  const overdue = clients.filter(c => c.payment_status === 'overdue').length

  const stats = [
    { label: 'Outstanding Balance', value: `₹${outstanding.toLocaleString()}`, icon: DollarSign, color: 'text-rose-500 bg-rose-50' },
    { label: 'Total Clients',       value: clients.length,  icon: Users,         color: 'text-indigo-500 bg-indigo-50' },
    { label: 'Paid',                value: paid,            icon: CheckCircle,   color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Pending / Overdue',   value: `${pending} / ${overdue}`, icon: AlertCircle, color: 'text-amber-500 bg-amber-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-[--color-border] p-5 shadow-sm flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${s.color.split(' ')[1]}`}>
            <s.icon className={`w-5 h-5 ${s.color.split(' ')[0]}`} />
          </div>
          <div>
            <div className="text-xl font-bold font-[--font-display] text-[--color-text]">{s.value}</div>
            <div className="text-xs text-[--color-muted]">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
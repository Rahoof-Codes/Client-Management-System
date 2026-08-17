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
    {
      label: 'Outstanding',
      value: `₹${outstanding.toLocaleString()}`,
      icon: DollarSign,
      iconBg: 'var(--th-danger-bg)',
      iconColor: 'var(--color-danger)',
    },
    {
      label: 'Total Clients',
      value: clients.length,
      icon: Users,
      iconBg: 'var(--th-primary-light)',
      iconColor: 'var(--color-primary)',
    },
    {
      label: 'Paid',
      value: paid,
      icon: CheckCircle,
      iconBg: 'var(--th-success-bg)',
      iconColor: 'var(--color-success)',
    },
    {
      label: 'Pending / Overdue',
      value: `${pending} / ${overdue}`,
      icon: AlertCircle,
      iconBg: 'var(--th-warning-bg)',
      iconColor: 'var(--color-warning)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="glass-card rounded-2xl p-5 flex items-center gap-4 animate-fade-in"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="p-3 rounded-xl" style={{ background: s.iconBg }}>
            <s.icon className="w-5 h-5" style={{ color: s.iconColor }} />
          </div>
          <div>
            <div className="text-xl font-bold font-[--font-display]" style={{ color: 'var(--th-text)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--th-muted)' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default function StatusBadge({ status }) {
  const map = {
    paid:    'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  )
}
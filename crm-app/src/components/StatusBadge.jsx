export default function StatusBadge({ status }) {
  const map = {
    paid: {
      bg: 'rgba(52,211,153,0.10)',
      border: 'rgba(52,211,153,0.20)',
      text: '#34d399',
      dot: '#34d399',
    },
    pending: {
      bg: 'rgba(251,191,36,0.10)',
      border: 'rgba(251,191,36,0.20)',
      text: '#fbbf24',
      dot: '#fbbf24',
    },
    overdue: {
      bg: 'rgba(248,113,113,0.10)',
      border: 'rgba(248,113,113,0.20)',
      text: '#f87171',
      dot: '#f87171',
    },
  }

  const s = map[status] || map.pending

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: s.dot,
          boxShadow: `0 0 6px ${s.dot}`,
          ...(status === 'overdue' ? { animation: 'pulseGlow 2s ease-in-out infinite' } : {}),
        }}
      />
      {status}
    </span>
  )
}
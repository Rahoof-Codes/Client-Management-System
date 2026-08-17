import { useState, useEffect } from 'react'
import { X, User, Building2, Mail, Phone, Calendar, DollarSign, FileText, CreditCard } from 'lucide-react'

const empty = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  type: 'monthly',
  billing_cycle_start: '',
  monthly_rate: '',
  project_value: '',
  project_deadline: '',
  payment_status: 'pending'
}

const inp = "glass-input w-full px-3 py-2.5 rounded-xl text-sm"

export default function ClientModal({ client, onClose, onSave }) {
  const [form, setForm]       = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    setForm(client ? { ...empty, ...client } : empty)
    setError('')
  }, [client])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await onSave(form)
    if (err) { setError(err.message); setLoading(false) }
    else { setLoading(false); onClose() }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      style={{ background: 'var(--th-modal-backdrop)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto animate-slide-up"
        style={{
          background: 'var(--th-modal-bg)',
          border: '1px solid var(--th-border)',
          backdropFilter: 'blur(24px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-3xl sm:rounded-t-2xl"
          style={{ background: 'var(--th-modal-bg)', borderBottom: '1px solid var(--th-border)' }}
        >
          <div>
            <h2 className="text-lg font-bold font-[--font-display]" style={{ color: 'var(--th-text)' }}>
              {client?.id ? 'Edit Client' : '+ Add New Client'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--th-muted)' }}>
              {client?.id ? 'Update client information' : 'Fill in the client details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors cursor-pointer"
            style={{ background: 'var(--th-surface)', color: 'var(--th-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ── Section 1: Basic Info ── */}
          <div className="space-y-3">
            <SectionTitle icon={User} title="Basic Information" />

            <Field label="Full Name" required>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={inp}
                placeholder="e.g. John Doe"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inp}
                  placeholder="john@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={inp}
                  placeholder="+91 98765 43210"
                />
              </Field>
            </div>

            <Field label="Company / Brand">
              <input
                value={form.company}
                onChange={e => set('company', e.target.value)}
                className={inp}
                placeholder="e.g. Acme Pvt Ltd"
              />
            </Field>
          </div>

          {/* ── Section 2: Project Type ── */}
          <div className="space-y-3">
            <SectionTitle icon={CreditCard} title="Project Type" />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => set('type', 'monthly')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
                style={{
                  background: form.type === 'monthly' ? 'var(--th-primary-light)' : 'var(--th-surface)',
                  border: `2px solid ${form.type === 'monthly' ? 'var(--color-primary)' : 'var(--th-border)'}`,
                  boxShadow: form.type === 'monthly' ? '0 0 20px var(--th-primary-glow)' : 'none',
                }}
              >
                <span className="text-2xl">📅</span>
                <div className="text-center">
                  <div className="font-semibold text-sm" style={{ color: form.type === 'monthly' ? 'var(--color-primary)' : 'var(--th-text)' }}>
                    Monthly
                  </div>
                  <div className="text-xs" style={{ color: 'var(--th-muted)' }}>Recurring billing</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => set('type', 'onetime')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
                style={{
                  background: form.type === 'onetime' ? 'var(--th-accent-light)' : 'var(--th-surface)',
                  border: `2px solid ${form.type === 'onetime' ? 'var(--color-accent)' : 'var(--th-border)'}`,
                  boxShadow: form.type === 'onetime' ? '0 0 20px rgba(56,189,248,0.2)' : 'none',
                }}
              >
                <span className="text-2xl">💼</span>
                <div className="text-center">
                  <div className="font-semibold text-sm" style={{ color: form.type === 'onetime' ? 'var(--color-accent)' : 'var(--th-text)' }}>
                    One-Time
                  </div>
                  <div className="text-xs" style={{ color: 'var(--th-muted)' }}>Fixed project</div>
                </div>
              </button>
            </div>
          </div>

          {/* ── Section 3: Payment Details ── */}
          <div className="space-y-3">
            <SectionTitle icon={DollarSign} title="Payment Details" />

            {form.type === 'monthly' ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rate (₹)" required>
                  <input
                    type="number"
                    value={form.monthly_rate}
                    onChange={e => set('monthly_rate', e.target.value)}
                    className={inp}
                    placeholder="5000"
                    min="0"
                  />
                </Field>
                <Field label="Billing Cycle Start">
                  <input
                    type="date"
                    value={form.billing_cycle_start || ''}
                    onChange={e => set('billing_cycle_start', e.target.value)}
                    className={inp}
                  />
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project Value (₹)" required>
                  <input
                    type="number"
                    value={form.project_value}
                    onChange={e => set('project_value', e.target.value)}
                    className={inp}
                    placeholder="50000"
                    min="0"
                  />
                </Field>
                <Field label="Project Deadline">
                  <input
                    type="date"
                    value={form.project_deadline || ''}
                    onChange={e => set('project_deadline', e.target.value)}
                    className={inp}
                  />
                </Field>
              </div>
            )}

            {/* Payment Status */}
            <Field label="Payment Status">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pending', label: 'Pending', emoji: '⏳', color: 'var(--color-warning)', bg: 'var(--th-warning-bg)', border: 'rgba(245,158,11,0.3)' },
                  { value: 'paid',    label: 'Paid',    emoji: '✅', color: 'var(--color-success)', bg: 'var(--th-success-bg)', border: 'rgba(34,197,94,0.3)' },
                  { value: 'overdue', label: 'Overdue', emoji: '🔴', color: 'var(--color-danger)', bg: 'var(--th-danger-bg)', border: 'rgba(239,68,68,0.3)' },
                ].map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set('payment_status', s.value)}
                    className="py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      background: form.payment_status === s.value ? s.bg : 'var(--th-surface)',
                      border: `2px solid ${form.payment_status === s.value ? s.border : 'var(--th-border)'}`,
                      color: form.payment_status === s.value ? s.color : 'var(--th-muted)',
                      boxShadow: form.payment_status === s.value ? `0 0 12px ${s.bg}` : 'none',
                    }}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* ── Section 4: Requirements & Notes ── */}
          <div className="space-y-3">
            <SectionTitle icon={FileText} title="Requirements & Notes" />

            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={4}
              className={inp + ' resize-none'}
              placeholder="Add project links, client requirements, special instructions, deadlines…"
            />
            <p className="text-xs" style={{ color: 'var(--th-muted)' }}>
              📌 This is visible to staff as their task reference.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl animate-fade-in"
              style={{ background: 'var(--th-danger-bg)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)' }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="grid grid-cols-2 gap-3 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{ background: 'var(--th-surface)', border: '2px solid var(--th-border)', color: 'var(--th-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient py-3 rounded-xl text-sm cursor-pointer"
            >
              {loading ? 'Saving…' : client?.id ? '💾 Save Changes' : '✓ Add Client'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ── Helpers ──

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg" style={{ background: 'var(--th-primary-light)' }}>
        <Icon className="w-3.5 h-3.5 text-[--color-primary]" />
      </div>
      <h3 className="font-semibold text-sm" style={{ color: 'var(--th-text)' }}>{title}</h3>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--th-muted)' }}>
        {label}{required && <span className="text-[--color-danger] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
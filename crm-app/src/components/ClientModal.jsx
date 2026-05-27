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
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 rounded-t-3xl sm:rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {client?.id ? 'Edit Client' : '+ Add New Client'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {client?.id ? 'Update client information' : 'Fill in the client details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
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
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  form.type === 'monthly'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-200'
                }`}
              >
                <span className="text-2xl">📅</span>
                <div className="text-center">
                  <div className={`font-semibold text-sm ${form.type === 'monthly' ? 'text-indigo-600' : 'text-slate-700'}`}>
                    Monthly
                  </div>
                  <div className="text-xs text-slate-400">Recurring billing</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => set('type', 'onetime')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  form.type === 'onetime'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-violet-200'
                }`}
              >
                <span className="text-2xl">💼</span>
                <div className="text-center">
                  <div className={`font-semibold text-sm ${form.type === 'onetime' ? 'text-violet-600' : 'text-slate-700'}`}>
                    One-Time
                  </div>
                  <div className="text-xs text-slate-400">Fixed project</div>
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
                  { value: 'pending', label: 'Pending', emoji: '⏳', active: 'border-amber-500 bg-amber-50 text-amber-600' },
                  { value: 'paid',    label: 'Paid',    emoji: '✅', active: 'border-emerald-500 bg-emerald-50 text-emerald-600' },
                  { value: 'overdue', label: 'Overdue', emoji: '🔴', active: 'border-rose-500 bg-rose-50 text-rose-600' },
                ].map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set('payment_status', s.value)}
                    className={`py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      form.payment_status === s.value
                        ? s.active
                        : 'border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
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
            <p className="text-xs text-slate-400">
              📌 This is visible to staff as their task reference.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="text-rose-500 text-sm bg-rose-50 px-4 py-3 rounded-xl border border-rose-200">
              ⚠️ {error}
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="grid grid-cols-2 gap-3 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: loading ? '#a5b4fc' : '#4f46e5' }}
              className="py-3 rounded-xl text-white text-sm font-semibold shadow-sm transition-all"
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

const inp = "w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-indigo-50">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <h3 className="font-semibold text-sm text-slate-700">{title}</h3>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-400 block mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
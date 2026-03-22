import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import { API, authFetch } from '../lib/api'

export default function RequestDeleteAccount() {
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason.trim()) { setError('Please provide a reason for your deletion request.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await authFetch(`${API}/user/request-deletion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Failed to submit request. Please try again.'); return }
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-800">Account Deletion Request</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Request Submitted</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your account deletion request has been submitted. Your administrator will review and process it within 7 working days. You will be notified via email once a decision has been made.
            </p>
            <p className="text-xs text-slate-400">
              Your account remains active until the deletion is approved.
            </p>
            <button onClick={() => navigate('/dashboard')}
              className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-colors text-sm">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo variant="dark" size="sm" />
          <span className="font-semibold text-slate-800">Request Account Deletion</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-800">This action is irreversible</p>
            <p className="text-xs text-red-600 leading-relaxed">
              Requesting account deletion will permanently remove your personal data from VChron once approved by your administrator. Your attendance records may be retained for compliance purposes as required by law.
            </p>
          </div>
        </div>

        {/* What happens */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">What happens when you request deletion?</h3>
          <ul className="space-y-2">
            {[
              'Your request is sent to your ministry administrator for review.',
              'Your account remains active until the administrator approves the deletion.',
              'Once approved, your personal data (name, email, phone) will be deleted or anonymised within 30 days.',
              'Attendance records may be retained for up to 7 years for legal compliance.',
              'You will receive an email confirmation once the deletion is processed.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-600">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Reason for deletion</h3>
          <p className="text-xs text-slate-500">Please tell us why you want to delete your account. This helps us improve VChron.</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. I am no longer employed at this ministry, I want my data removed..."
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none resize-none"
          />
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 h-11 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading || !reason.trim()}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Trash2 className="w-4 h-4" /> Submit Request</>
              }
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400">
          Changed your mind? You can cancel this request by contacting your administrator before it is approved.
        </p>
      </div>
    </div>
  )
}

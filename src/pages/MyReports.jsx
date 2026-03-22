/**
 * MyReports — Employee Attendance Report Download Page
 *
 * Allows employees to:
 *  1. Generate an encrypted PDF attendance report for a chosen period
 *  2. Have the report emailed to them (optional)
 *  3. Download the report directly from the browser
 *  4. View their report history and re-download past reports
 *
 * PDF is password-protected with the user's phone number (digits only).
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react'
import { API, authFetch } from '@/lib/api'

// ─── Period options ───────────────────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { value: 'daily',   label: 'Today' },
  { value: 'weekly',  label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'custom',  label: 'Custom Range' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-ZM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-ZM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function periodTypeLabel(t) {
  return { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', custom: 'Custom' }[t] || t
}

// ─── ReportHistoryItem ────────────────────────────────────────────────────────
function ReportHistoryItem({ report, onDownload, downloading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-medium text-sm truncate">{report.period_label}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {formatDate(report.date_from)} – {formatDate(report.date_to)}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {periodTypeLabel(report.period_type)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {report.record_count} record{report.record_count !== 1 ? 's' : ''}
        </span>
        {report.emailed && (
          <span className="flex items-center gap-1 text-teal-600">
            <Mail className="w-3 h-3" />
            Emailed {formatDateTime(report.emailed_at)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onDownload(report.report_id, report.period_label)}
          disabled={downloading === report.report_id}
          className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
        >
          {downloading === report.report_id ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
          ) : (
            <><Download className="w-3.5 h-3.5" /> Download PDF</>
          )}
        </button>
      </div>

      <p className="text-slate-400 text-[11px]">
        Generated {formatDateTime(report.created_at)}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyReports() {
  const navigate = useNavigate()

  // Generate form state
  const [periodType, setPeriodType]       = useState('monthly')
  const [customFrom, setCustomFrom]       = useState('')
  const [customTo, setCustomTo]           = useState('')
  const [sendEmail, setSendEmail]         = useState(true)
  const [generating, setGenerating]       = useState(false)
  const [lastGenerated, setLastGenerated] = useState(null)

  // History state
  const [reports, setReports]             = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError]   = useState(null)
  const [downloading, setDownloading]     = useState(null)
  const [showHistory, setShowHistory]     = useState(true)

  // User info (for phone hint)
  const [user, setUser] = useState(null)

  // ── Fetch user profile ──
  useEffect(() => {
    authFetch(`${API}/auth/me`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user) })
      .catch(() => {})
  }, [])

  // ── Fetch report history ──
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await authFetch(`${API}/reports/my`)
      if (!res.ok) throw new Error('Failed to load reports')
      const data = await res.json()
      setReports(data.reports || [])
    } catch (err) {
      setHistoryError(err.message)
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  // ── Generate report ──
  const handleGenerate = async () => {
    if (periodType === 'custom' && (!customFrom || !customTo)) {
      toast.error('Please select both start and end dates for a custom range.')
      return
    }
    if (periodType === 'custom' && new Date(customFrom) > new Date(customTo)) {
      toast.error('Start date must be before end date.')
      return
    }

    setGenerating(true)
    setLastGenerated(null)
    try {
      const body = { period_type: periodType, send_email: sendEmail }
      if (periodType === 'custom') {
        body.date_from = customFrom
        body.date_to   = customTo
      }

      const res = await authFetch(`${API}/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Failed to generate report')
      }

      // Get report metadata from headers
      const reportId    = res.headers.get('X-Report-Id')
      const recordCount = res.headers.get('X-Record-Count')

      // Trigger download
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `VChron_Report_${periodType}_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLastGenerated({ reportId, recordCount: parseInt(recordCount || '0') })
      toast.success('Report generated and download started!')
      if (sendEmail) {
        toast.info('A copy has also been sent to your email.')
      }

      // Refresh history
      fetchHistory()
    } catch (err) {
      toast.error(err.message || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  // ── Download existing report ──
  const handleDownload = async (reportId, periodLabel) => {
    setDownloading(reportId)
    try {
      const res = await authFetch(`${API}/reports/download/${reportId}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Download failed')
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `VChron_Report_${periodLabel.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      toast.error(err.message || 'Download failed')
    } finally {
      setDownloading(null)
    }
  }

  // ── Phone hint ──
  const phoneHint = user?.phone_number
    ? user.phone_number.replace(/\D/g, '')
    : 'your phone number (digits only)'

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <FileText className="w-5 h-5 text-teal-600" />
          <h1 className="text-base font-semibold text-slate-800">My Reports</h1>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
          title="Refresh history"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Password Info Banner ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium text-sm">Reports are password protected</p>
            <p className="text-amber-700 text-xs mt-1">
              Your PDF password is your phone number (digits only).
            </p>
            {user?.phone_number && (
              <p className="text-amber-800 text-xs mt-1 font-mono bg-amber-100 px-2 py-0.5 rounded inline-block">
                Password: {phoneHint}
              </p>
            )}
          </div>
        </div>

        {/* ── Generate Report Card ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-800">Generate New Report</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* Period selector */}
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-2">Select Period</label>
              <div className="grid grid-cols-2 gap-2">
                {PERIOD_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPeriodType(opt.value)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border
                      ${periodType === opt.value
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date range */}
            {periodType === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    max={customTo || new Date().toISOString().slice(0, 10)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                    min={customFrom}
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email toggle */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-800 font-medium">Send to my email</p>
                  <p className="text-xs text-slate-500">Also email the PDF to {user?.email || 'your email'}</p>
                </div>
              </div>
              <button
                onClick={() => setSendEmail(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${sendEmail ? 'bg-teal-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sendEmail ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Success message after generation */}
            {lastGenerated && (
              <div className="flex items-start gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-teal-800 text-sm font-medium">Report generated!</p>
                  <p className="text-teal-700 text-xs mt-0.5">
                    {lastGenerated.recordCount} attendance record{lastGenerated.recordCount !== 1 ? 's' : ''} included.
                    {sendEmail && ' A copy was sent to your email.'}
                  </p>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {generating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Report…</>
              ) : (
                <><Download className="w-5 h-5" /> Generate &amp; Download</>
              )}
            </button>
          </div>
        </div>

        {/* ── Report History ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-full px-4 py-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-slate-800">Report History</h2>
              {reports.length > 0 && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {reports.length}
                </span>
              )}
            </div>
            {showHistory ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showHistory && (
            <div className="p-4">
              {historyLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading history…</span>
                </div>
              ) : historyError ? (
                <div className="flex items-center gap-2 text-red-500 py-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm">{historyError}</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No reports generated yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Generate your first report above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map(r => (
                    <ReportHistoryItem
                      key={r.report_id}
                      report={r}
                      onDownload={handleDownload}
                      downloading={downloading}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

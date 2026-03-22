import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

const LAST_UPDATED = 'March 2026'

export default function PrivacyPolicy({ modal = false, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (modal && onClose) { onClose(); return }
    navigate(-1)
  }

  return (
    <div className={modal ? '' : 'min-h-screen bg-slate-50'}>
      {/* Header */}
      <div className={`sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 ${modal ? '' : ''}`}>
        <button onClick={handleBack} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo variant="dark" size="sm" />
          <span className="font-semibold text-slate-800">Privacy Policy</span>
        </div>
        <span className="ml-auto text-xs text-slate-400">Updated {LAST_UPDATED}</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-slate-700 text-sm leading-relaxed">

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-800 text-sm">
          <strong>VChron</strong> is a product of <strong>GreenWebb Technologies</strong>. This Privacy Policy explains how we collect, use, and protect your personal data when you use the VChron workforce attendance system.
        </div>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Who We Are</h2>
          <p>VChron is developed and operated by <strong>GreenWebb Technologies</strong>. VChron is a verified workforce intelligence platform designed to help government ministries and organisations manage employee attendance, shift reporting, and workforce analytics.</p>
          <p className="mt-2">For data protection enquiries, contact: <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a></p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Data We Collect</h2>
          <p>We collect the following personal data when you register and use VChron:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Identity data:</strong> Full name, employee number</li>
            <li><strong>Contact data:</strong> Email address, phone number</li>
            <li><strong>Employment data:</strong> Ministry, province, district, facility/school/office, job position</li>
            <li><strong>Attendance data:</strong> Time-in, time-out, shift records, location data at time of check-in</li>
            <li><strong>Device data:</strong> IP address, browser type, device identifiers (for security purposes)</li>
            <li><strong>Usage data:</strong> Pages visited, features used, timestamps</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To verify your identity and authenticate your account via OTP</li>
            <li>To record and manage your attendance and shift reports</li>
            <li>To provide administrators and superusers with workforce analytics and reports</li>
            <li>To send you transactional notifications (OTP codes, account alerts)</li>
            <li>To maintain an audit trail of system actions for compliance and security</li>
            <li>To improve the VChron platform and troubleshoot issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Legal Basis for Processing</h2>
          <p>We process your personal data under the following legal bases:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Contract performance:</strong> To provide the attendance management service you or your employer has engaged</li>
            <li><strong>Legitimate interests:</strong> Security, fraud prevention, and system integrity</li>
            <li><strong>Consent:</strong> Where you have explicitly agreed (e.g., at registration)</li>
            <li><strong>Legal obligation:</strong> Where required by applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Sharing</h2>
          <p>We do not sell your personal data. We may share your data with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Your employer / ministry:</strong> Administrators assigned to your ministry can view your attendance records</li>
            <li><strong>Superusers:</strong> System-level administrators with access to aggregated analytics across ministries</li>
            <li><strong>Service providers:</strong> Hosting, email delivery, and database providers who process data on our behalf under strict data processing agreements</li>
            <li><strong>Legal authorities:</strong> Where required by law or court order</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">6. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active or as required by law. Attendance records are retained for a minimum of 7 years for compliance with employment regulations. When you request account deletion and it is approved, your personal data is anonymised or deleted within 30 days, except where retention is required by law.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate data</li>
            <li><strong>Request deletion</strong> of your account and data (subject to legal retention requirements)</li>
            <li><strong>Object</strong> to certain types of processing</li>
            <li><strong>Data portability</strong> — receive your attendance records in a machine-readable format</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, use the <strong>Request Account Deletion</strong> feature in the app or contact <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a>.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">8. Security</h2>
          <p>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), OTP-based authentication, JWT token expiry, audit logging of all administrative actions, and role-based access controls. No system is completely secure; if you suspect unauthorised access to your account, contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">9. Cookies</h2>
          <p>VChron uses strictly necessary cookies for authentication (session tokens). We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use of VChron after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">11. Contact</h2>
          <p>For any privacy-related questions or to exercise your rights:</p>
          <p className="mt-1"><strong>GreenWebb Technologies</strong><br />Email: <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a></p>
        </section>

        <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
          Last updated: {LAST_UPDATED} &mdash; VChron by GreenWebb Technologies
        </div>
      </div>
    </div>
  )
}

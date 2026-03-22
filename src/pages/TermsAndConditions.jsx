import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

const LAST_UPDATED = 'March 2026'

export default function TermsAndConditions({ modal = false, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (modal && onClose) { onClose(); return }
    navigate(-1)
  }

  return (
    <div className={modal ? '' : 'min-h-screen bg-slate-50'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={handleBack} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo variant="dark" size="sm" />
          <span className="font-semibold text-slate-800">Terms &amp; Conditions</span>
        </div>
        <span className="ml-auto text-xs text-slate-400">Updated {LAST_UPDATED}</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-slate-700 text-sm leading-relaxed">

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-800 text-sm">
          Please read these Terms and Conditions carefully before using VChron. By creating an account or using the service, you agree to be bound by these terms.
        </div>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
          <p>By registering for or using VChron ("the Service"), you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, you must not use the Service. These terms form a legally binding agreement between you and <strong>GreenWebb Technologies</strong>, the developer and operator of VChron.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Description of Service</h2>
          <p>VChron is a verified workforce intelligence platform that enables employees of government ministries and organisations to record attendance, manage shift check-ins and check-outs, and allows administrators to monitor and report on workforce attendance data.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Account Registration</h2>
          <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account. You must notify us immediately of any unauthorised use of your account. VChron uses OTP (One-Time Password) verification — you are responsible for keeping your registered email and phone number secure.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Submit false or misleading attendance records</li>
            <li>Attempt to access another user's account or data</li>
            <li>Reverse-engineer, decompile, or tamper with the Service</li>
            <li>Use the Service for any unlawful purpose</li>
            <li>Interfere with the integrity or performance of the Service</li>
            <li>Share your OTP codes or access credentials with any other person</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">5. Attendance Data Accuracy</h2>
          <p>You are solely responsible for the accuracy of attendance records you submit. Submitting false attendance data may constitute a disciplinary or legal offence under your employment terms and applicable law. VChron provides the platform; your employer or ministry is responsible for verifying and acting on attendance data.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">6. Administrator and Superuser Responsibilities</h2>
          <p>Users with Administrator or Superuser roles are granted elevated access to workforce data. These users agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access only data within their authorised scope (ministry, province, district)</li>
            <li>Not extract, download, or share workforce data for unauthorised purposes</li>
            <li>Understand that all administrative actions are logged in an audit trail</li>
            <li>Report any data breaches or suspected misuse immediately</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">7. Intellectual Property</h2>
          <p>All rights, title, and interest in VChron — including the software, design, branding, and documentation — are owned by GreenWebb Technologies. You are granted a limited, non-exclusive, non-transferable licence to use the Service for its intended purpose. You may not copy, modify, or distribute any part of the Service without written permission.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">8. Availability and Modifications</h2>
          <p>We aim to keep VChron available at all times but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice where possible.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, GreenWebb Technologies shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of VChron, including but not limited to loss of data, loss of employment, or disciplinary actions resulting from attendance records.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">10. Account Termination</h2>
          <p>You may request deletion of your account at any time through the in-app Request Account Deletion feature. Deletion requests are subject to approval by your ministry administrator. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">11. Governing Law</h2>
          <p>These Terms are governed by the laws of the Republic of Zambia. Any disputes arising from these Terms shall be subject to the jurisdiction of the courts of Zambia.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">12. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of material changes via email or in-app notice. Continued use of VChron after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">13. Contact</h2>
          <p><strong>GreenWebb Technologies</strong><br />Email: <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a></p>
        </section>

        <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
          Last updated: {LAST_UPDATED} &mdash; VChron by GreenWebb Technologies
        </div>
      </div>
    </div>
  )
}

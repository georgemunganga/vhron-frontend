import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Logo from '@/components/Logo'

const LAST_UPDATED = 'April 2026'

export default function PrivacyPolicy({ modal = false, onClose }) {
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
          <span className="font-semibold text-slate-800">Data Protection &amp; Privacy Policy</span>
        </div>
        <span className="ml-auto text-xs text-slate-400 shrink-0">Updated {LAST_UPDATED}</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-slate-700 text-sm leading-relaxed">

        {/* Intro banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-800 text-sm flex gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong>VCHRON Data Protection and Privacy Policy</strong>
            <br />Compliant with the <strong>Data Protection Act of Zambia, 2021</strong>. This policy governs how personal data is collected, processed, stored, and protected across all VChron deployments.
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Introduction</h2>
          <p>VChron is a digital workforce attendance and verification system designed to enhance accountability, transparency, and service delivery across public and private sector institutions.</p>
          <p className="mt-2">This Data Protection and Privacy Policy outlines how personal data is collected, processed, stored, and protected in compliance with applicable data protection laws of the Republic of Zambia.</p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Scope and Applicability</h2>
          <p>This Policy applies to all users of VChron, including employees, administrators, and authorised personnel within deploying institutions.</p>
          <p className="mt-2">For government deployments:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The relevant Ministry or Institution shall act as the <strong>Data Controller</strong></li>
            <li>GreenWebb Technologies (VChron) shall act as the <strong>Data Processor</strong></li>
          </ul>
          <p className="mt-2">Each party shall fulfil its obligations in accordance with applicable data protection laws.</p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Definitions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Data:</strong> Any information relating to an identifiable individual, including name, contact details, job designation, and location data.</li>
            <li><strong>Data Subject:</strong> An individual whose personal data is processed.</li>
            <li><strong>Data Controller:</strong> The entity determining the purpose and means of processing personal data.</li>
            <li><strong>Data Processor:</strong> An entity processing data on behalf of the Data Controller.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Purpose of Data Processing</h2>
          <p>Personal data is collected and processed strictly for legitimate and defined purposes, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Attendance tracking (clock-in and clock-out)</li>
            <li>Workforce accountability and reporting</li>
            <li>Operational oversight and supervision</li>
            <li>Improvement of service delivery</li>
          </ul>
          <p className="mt-2">Personal data shall not be processed for purposes incompatible with the above.</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">5. Lawful Basis for Processing</h2>
          <p>Processing of personal data is carried out based on one or more of the following lawful grounds:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Performance of employment-related obligations</li>
            <li>Compliance with legal or regulatory requirements</li>
            <li>Performance of a task carried out in the public interest or under official authority (for government institutions)</li>
            <li>Consent of the data subject, where applicable</li>
          </ul>
          <p className="mt-2">In employment and public sector contexts, reliance is primarily placed on legal obligation and public interest rather than consent.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">6. Categories of Data Collected</h2>
          <p>VChron collects only data necessary for its intended functions, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Full name</li>
            <li>Job title / designation</li>
            <li>Ministry, department, facility, or institution</li>
            <li>Contact details (email and/or phone number)</li>
            <li>Date and time of attendance records</li>
            <li>GPS location data (captured only at check-in and check-out)</li>
          </ul>
          <p className="mt-2">VChron does not conduct continuous tracking or collect excessive or irrelevant personal data.</p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">7. Data Minimisation</h2>
          <p>All data collection is limited to what is necessary for attendance verification and workforce management.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>GPS data is collected only at reporting times</li>
            <li>No continuous monitoring or surveillance is conducted</li>
            <li>Data fields are restricted to operational requirements only</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">8. Data Security Measures</h2>
          <p>Appropriate technical and organisational measures are implemented to protect personal data, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Encryption of data in transit and at rest</li>
            <li>Role-based access controls</li>
            <li>Secure authentication mechanisms</li>
            <li>System audit logs and monitoring</li>
            <li>Restricted access to authorised personnel only</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">9. Data Retention</h2>
          <p>Personal data is retained only for as long as necessary to fulfil its intended purpose and meet legal or administrative requirements:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Attendance records:</strong> retained for up to 12 months (aligned with audit and reporting cycles)</li>
            <li><strong>GPS / location data:</strong> retained for 3–6 months for verification and dispute resolution</li>
          </ul>
          <p className="mt-2">Data may be retained for longer periods where required by law or institutional policy. All data is securely deleted or anonymised after the retention period.</p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">10. Data Subject Rights</h2>
          <p>Data subjects have the following rights, subject to applicable legal and administrative limitations:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Right to access personal data</li>
            <li>Right to correct inaccurate or incomplete data</li>
            <li>Right to request deletion of personal data</li>
            <li>Right to object to processing</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent (where consent is the basis of processing)</li>
          </ul>
          <p className="mt-2">Requests may be limited where processing is required by law, public duty, or legitimate administrative obligations.</p>
          <p className="mt-2">To exercise any of these rights, use the <strong>Request Account Deletion</strong> feature in the app or contact <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a>.</p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">11. Data Sharing and Disclosure</h2>
          <p>Personal data shall not be disclosed to third parties except:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Where required by law or legal process</li>
            <li>For legitimate administrative or operational purposes within the institution</li>
            <li>To authorised data processors under binding confidentiality agreements</li>
          </ul>
          <p className="mt-2">All third-party processors are required to comply with applicable data protection standards.</p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">12. Data Storage and Cross-Border Transfers</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal data shall primarily be stored within the Republic of Zambia.</li>
            <li>No transfer of data outside Zambia shall occur without appropriate safeguards and, where required, regulatory approval.</li>
          </ul>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">13. Automated Decision-Making</h2>
          <p>VChron does not make automated decisions that produce legal or similarly significant effects on individuals without human review.</p>
          <p className="mt-2">Attendance records and system-generated insights are subject to administrative verification before action is taken.</p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">14. Data Protection Officer</h2>
          <p>A Data Protection Officer (DPO) shall be designated to oversee compliance. The DPO shall:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Operate independently</li>
            <li>Advise on data protection obligations</li>
            <li>Monitor compliance with applicable laws</li>
            <li>Serve as the point of contact for data subjects and regulators</li>
          </ul>
        </section>

        {/* Section 15 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">15. Data Breach Management</h2>
          <p>In the event of a data breach:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The incident shall be reported to the relevant regulatory authority within legally prescribed timelines</li>
            <li>Affected individuals shall be notified where there is a risk to their rights or freedoms</li>
            <li>Immediate containment and corrective measures shall be implemented</li>
          </ul>
        </section>

        {/* Section 16 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">16. Accountability and Governance</h2>
          <p>VChron shall implement and maintain:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Records of processing activities</li>
            <li>Data Protection Impact Assessments (where required)</li>
            <li>Internal policies and compliance controls</li>
            <li>Regular system audits and monitoring mechanisms</li>
          </ul>
        </section>

        {/* Section 17 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">17. Policy Updates</h2>
          <p>This Policy may be updated periodically to reflect legal, regulatory, or operational changes. Users and deploying institutions shall be notified of any significant changes.</p>
        </section>

        {/* Section 18 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">18. Contact Information</h2>
          <p>For data protection enquiries, requests, or complaints, contact:</p>
          <div className="mt-2 bg-slate-100 rounded-lg p-3 text-slate-700">
            <p><strong>Data Protection Officer – VChron</strong></p>
            <p>GreenWebb Technologies</p>
            <p>Email: <a href="mailto:vchron@greenwebb.tech" className="text-teal-600 underline">vchron@greenwebb.tech</a></p>
          </div>
        </section>

        {/* Section 19 */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">19. Acceptance</h2>
          <p>By using VChron, users acknowledge that they have read and understood this Policy. For institutional deployments, acceptance is governed by contractual agreements between the deploying institution and <strong>GreenWebb Technologies</strong>.</p>
        </section>

        <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
          Last updated: {LAST_UPDATED} &mdash; VChron by GreenWebb Technologies &mdash; Compliant with the Data Protection Act of Zambia, 2021
        </div>
      </div>
    </div>
  )
}

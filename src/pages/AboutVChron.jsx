import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, Shield, BarChart2, Smartphone, Globe } from 'lucide-react'
import Logo from '@/components/Logo'

const benefits = [
  {
    icon: Clock,
    title: 'Effortless Attendance',
    desc: 'Clock in and out in seconds from your phone. No paper registers, no queues — just a simple tap to record your presence.',
  },
  {
    icon: Shield,
    title: 'Verified & Tamper-Proof',
    desc: 'Every attendance record is timestamped and verified. Your records are secure and cannot be altered after submission.',
  },
  {
    icon: BarChart2,
    title: 'Your Attendance History',
    desc: 'View your full attendance history at any time. Download your own records as a PDF or spreadsheet for personal use.',
  },
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    desc: 'VChron works on any smartphone, tablet, or computer. No app download required — just open the link in your browser.',
  },
  {
    icon: Globe,
    title: 'Nationwide Coverage',
    desc: 'Designed for government ministries across all provinces and districts of Zambia — from Lusaka to Kasama.',
  },
  {
    icon: CheckCircle,
    title: 'Transparent & Fair',
    desc: 'Your attendance data is visible to you at all times. Disputes can be raised through your administrator with a full audit trail.',
  },
]

export default function AboutVChron() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo variant="dark" size="sm" />
          <span className="font-semibold text-slate-800">About VChron</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="light" size="lg" />
          </div>
          <h1 className="text-2xl font-bold mb-2">VChron</h1>
          <p className="text-teal-200 text-sm font-medium mb-4">Verified Workforce Intelligence</p>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm">
            <span className="text-teal-200">A product of</span>
            <span className="font-bold text-white">GreenWebb Technologies</span>
          </div>
        </div>

        {/* What is VChron */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900">What is VChron?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            VChron is a modern, mobile-first workforce attendance management system developed by <strong>GreenWebb Technologies</strong> for government ministries and public sector organisations in Zambia.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            VChron replaces paper-based attendance registers and outdated manual systems with a fast, secure, and verifiable digital platform — giving employees, administrators, and ministry leadership real-time visibility into workforce attendance.
          </p>
        </div>

        {/* Benefits for employees */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">How VChron Benefits You</h2>
          <div className="grid grid-cols-1 gap-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5">{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GreenWebb */}
        <div className="bg-slate-100 rounded-2xl p-6 text-slate-900 space-y-3">
          <h2 className="text-base font-bold">About GreenWebb Technologies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            GreenWebb Technologies is a Zambian technology company building digital solutions for the public sector. Our mission is to modernise government operations through accessible, reliable, and secure software.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            VChron is our flagship workforce management product, designed specifically for the operational realities of Zambia's government ministries — including limited connectivity, diverse device types, and multi-ministry deployment.
          </p>
          <a href="mailto:vchron@greenwebb.tech" className="inline-flex items-center gap-2 text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors">
            vchron@greenwebb.tech
          </a>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-slate-400 pb-4">
          VChron v1.0 &mdash; &copy; {new Date().getFullYear()} GreenWebb Technologies
        </p>
      </div>
    </div>
  )
}

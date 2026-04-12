import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, CheckCircle2, Smartphone, Wifi, Clock, Shield, ArrowRight, ExternalLink } from 'lucide-react'

function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Already installed in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true)
      return
    }
    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!prompt) return false
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setPrompt(null)
    return outcome === 'accepted'
  }

  return { prompt, isInstalled, install }
}

const FEATURES = [
  { icon: Clock,    title: 'One-tap check-in',     desc: 'Report for duty in seconds, even on slow networks.' },
  { icon: Wifi,     title: 'Works offline',         desc: 'Draft your check-in offline — it syncs when you reconnect.' },
  { icon: Shield,   title: 'Secure & private',      desc: 'Your data is encrypted and only visible to your organisation.' },
  { icon: Smartphone, title: 'Native app feel',     desc: 'Runs like a real app — no browser chrome, no app store needed.' },
]

function IOSInstructions() {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-left">
      <p className="text-sm font-semibold text-teal-400 mb-3">Install on iPhone / iPad</p>
      <ol className="space-y-2 text-sm text-slate-300">
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          <span>Tap the <strong>Share</strong> button <span className="text-slate-400">(square with arrow)</span> at the bottom of Safari</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
          <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
          <span>Tap <strong>Add</strong> in the top-right corner</span>
        </li>
      </ol>
    </div>
  )
}

export default function Install() {
  const navigate = useNavigate()
  const { prompt, isInstalled, install } = useInstallPrompt()
  const [installing, setInstalling] = useState(false)
  const [justInstalled, setJustInstalled] = useState(false)
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const showIOSGuide = isIOS && isSafari && !isInstalled

  const handleInstall = async () => {
    setInstalling(true)
    const ok = await install()
    setInstalling(false)
    if (ok) {
      setJustInstalled(true)
      setTimeout(() => navigate('/app/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start px-5 py-10 overflow-y-auto">
      {/* Logo + brand */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/50 mb-4 border-2 border-teal-700/40">
          <img src="/logo192.png" alt="VChron" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold font-['Manrope'] tracking-tight">VChron</h1>
        <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">
          Verified Workforce Intelligence — attendance tracking for government employees
        </p>
      </div>

      {/* Install card */}
      <div className="w-full max-w-sm">
        {isInstalled || justInstalled ? (
          /* Already installed */
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-teal-900/30 border border-teal-700">
            <CheckCircle2 className="w-12 h-12 text-teal-400" />
            <div className="text-center">
              <p className="text-lg font-semibold text-teal-300">VChron is installed!</p>
              <p className="text-sm text-slate-400 mt-1">
                {justInstalled ? 'Opening the app…' : 'You can open it from your home screen.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors"
            >
              Open App <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : prompt ? (
          /* Android / Chrome — native install prompt available */
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-teal-600/20 flex items-center justify-center">
              <Download className="w-7 h-7 text-teal-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Install VChron</p>
              <p className="text-sm text-slate-400 mt-1">
                Add to your home screen for the best experience — no app store required.
              </p>
            </div>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold text-base transition-colors shadow-lg shadow-teal-900/40"
            >
              {installing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing…
                </span>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Install App
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/app/login')}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Continue in browser instead
            </button>
          </div>
        ) : showIOSGuide ? (
          /* iOS Safari — manual install guide */
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-teal-600/20 flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-teal-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Add to Home Screen</p>
              <p className="text-sm text-slate-400 mt-1">
                Follow these steps to install VChron on your iPhone or iPad.
              </p>
            </div>
            <IOSInstructions />
            <button
              onClick={() => navigate('/app/login')}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              Continue in browser instead
            </button>
          </div>
        ) : (
          /* Fallback — browser doesn't support install prompt */
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-teal-600/20 flex items-center justify-center">
              <ExternalLink className="w-7 h-7 text-teal-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Open VChron</p>
              <p className="text-sm text-slate-400 mt-1">
                To install, open this page in Chrome (Android) or Safari (iOS) and use "Add to Home Screen".
              </p>
            </div>
            <button
              onClick={() => navigate('/app/login')}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base transition-colors"
            >
              Open App <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Feature highlights */}
      <div className="w-full max-w-sm mt-8 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-4">Why install?</p>
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-600 mt-10 text-center">
        VChron by GreenWebb Technologies · <a href="/app/privacy-policy" className="underline hover:text-slate-400">Privacy Policy</a>
      </p>
    </div>
  )
}

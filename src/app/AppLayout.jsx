import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Home, Clock, User, Menu, X, LogOut, Shield, ChevronRight, Bell, Wifi, WifiOff, Download } from 'lucide-react'
import { authFetch, API } from '../lib/api'

// ─── Install Prompt Hook ──────────────────────────────────────────────────────
function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setIsInstalled(true)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setPrompt(null)
  }, [prompt])

  return { prompt, isInstalled, install }
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const tabs = [
    { label: 'Home', icon: Home, route: '/app/dashboard' },
    { label: 'History', icon: Clock, route: '/app/history' },
    { label: 'Profile', icon: User, route: '/app/profile' },
  ]

  if (role === 'admin' || role === 'superuser') {
    tabs.splice(2, 0, { label: 'Admin', icon: Shield, route: role === 'superuser' ? '/app/superuser' : '/app/admin' })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 safe-area-bottom">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ label, icon: Icon, route }) => {
          const active = path === route || path.startsWith(route + '/')
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px]
                ${active ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-teal-400' : ''}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? 'text-teal-400' : ''}`}>{label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-teal-400 rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Drawer Menu ──────────────────────────────────────────────────────────────
function Drawer({ open, onClose, user, role, onLogout }) {
  const navigate = useNavigate()

  const items = [
    { label: 'My Reports', route: '/app/my-reports' },
    { label: 'About VChron', route: '/app/about' },
    { label: 'Privacy Policy', route: '/app/privacy-policy' },
    { label: 'Terms & Conditions', route: '/app/terms' },
    { label: 'Request Account Deletion', route: '/app/request-deletion', danger: true },
  ]

  if (role === 'superuser') {
    items.unshift(
      { label: 'Analytics', route: '/app/analytics' },
      { label: 'Admin Scoping', route: '/app/admin-scoping' },
      { label: 'Audit Trail', route: '/app/audit-trail' },
    )
  }
  if (role === 'admin') {
    items.unshift(
      { label: 'Deletion Requests', route: '/app/deletion-requests' },
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-slate-900 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{user?.name || 'User'}</p>
              <p className="text-slate-400 text-xs">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.map(({ label, route, danger }) => (
            <button
              key={route}
              onClick={() => { navigate(route); onClose() }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                ${danger ? 'text-red-400 hover:bg-red-900/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <span>{label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Install Banner ───────────────────────────────────────────────────────────
function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow-lg">
      <Download className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">Install VChron</p>
        <p className="text-xs text-teal-200 leading-tight">Add to home screen for quick access</p>
      </div>
      <button onClick={onInstall} className="bg-white text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0">
        Install
      </button>
      <button onClick={onDismiss} className="text-teal-200 hover:text-white flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Offline Banner ───────────────────────────────────────────────────────────
function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  if (!offline) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-amber-600 text-white px-4 py-2 flex items-center gap-2 text-sm">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>You're offline — some features may be limited</span>
    </div>
  )
}

// ─── Main AppLayout ───────────────────────────────────────────────────────────
export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const { prompt, isInstalled, install } = useInstallPrompt()

  // Show install banner if prompt is available and not dismissed
  useEffect(() => {
    if (prompt && !isInstalled && !sessionStorage.getItem('install-dismissed')) {
      setShowInstallBanner(true)
    }
  }, [prompt, isInstalled])

  // Load user from auth/me
  useEffect(() => {
    authFetch(`${API}/auth/me`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
          setRole(data.user.role?.toLowerCase())
        } else {
          navigate('/app/login', { replace: true })
        }
      })
      .catch(() => navigate('/app/login', { replace: true }))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('vchron_token')
    navigate('/app/login', { replace: true })
  }

  const handleInstall = async () => {
    await install()
    setShowInstallBanner(false)
  }

  const handleDismissInstall = () => {
    sessionStorage.setItem('install-dismissed', '1')
    setShowInstallBanner(false)
  }

  // Page title from route
  const titles = {
    '/app/dashboard': 'Dashboard',
    '/app/history': 'Attendance History',
    '/app/profile': 'My Profile',
    '/app/admin': 'Admin Panel',
    '/app/superuser': 'Superuser Panel',
    '/app/about': 'About VChron',
    '/app/privacy-policy': 'Privacy Policy',
    '/app/terms': 'Terms & Conditions',
    '/app/request-deletion': 'Delete Account',
    '/app/analytics': 'Analytics',
    '/app/admin-scoping': 'Admin Scoping',
    '/app/audit-trail': 'Audit Trail',
    '/app/deletion-requests': 'Deletion Requests',
    '/app/my-reports': 'My Reports',
  }
  const pageTitle = titles[location.pathname] || 'VChron'
  const topOffset = showInstallBanner ? 'pt-[108px]' : 'pt-[60px]'

  if (!user) {
    // Splash / loading screen
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center">
        <img src="/logo192.png" alt="VChron" className="w-20 h-20 rounded-2xl mb-4 animate-pulse" />
        <p className="text-teal-400 text-sm font-medium tracking-widest uppercase">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Offline banner */}
      <OfflineBanner />

      {/* Install banner */}
      {showInstallBanner && (
        <InstallBanner onInstall={handleInstall} onDismiss={handleDismissInstall} />
      )}

      {/* Top header */}
      <header className={`fixed top-0 left-0 right-0 z-20 bg-slate-900 border-b border-slate-700 ${showInstallBanner ? 'mt-[48px]' : ''}`}>
        <div className="flex items-center justify-between px-4 h-[60px] max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo192.png" alt="VChron" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-white font-semibold text-sm">{pageTitle}</span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className={`flex-1 ${topOffset} pb-[72px] overflow-y-auto`}>
        <div className="max-w-lg mx-auto w-full min-h-full">
          <Outlet context={{ user, role }} />
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav role={role} />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        role={role}
        onLogout={handleLogout}
      />
    </div>
  )
}

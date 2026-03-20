import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import AdminDashboard from "@/pages/AdminDashboard";
import SuperUserDashboard from "@/pages/SuperUserDashboard";
import CompleteRegistration from "@/pages/CompleteRegistration";

// Vite exposes env vars via import.meta.env.VITE_*
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://api.vcron.cloud";
const API = `${BACKEND_URL}/api`;

// Auth Context hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API}/auth/me`, { credentials: 'include' });
      if (response.ok) {
        setUser(await response.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkAuth(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem('vchron_token');
  };

  return { user, setUser, loading, logout, checkAuth, isOnline };
};

// Protected Route
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && userData?.role !== 'admin' && userData?.role !== 'superuser') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// Router
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complete-registration" element={<ProtectedRoute><CompleteRegistration /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/superuser" element={<ProtectedRoute requireAdmin><SuperUserDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
export { API, BACKEND_URL };

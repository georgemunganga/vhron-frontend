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

// All API helpers live in lib/api.js — imported here AND by pages.
// Pages must import from "@/lib/api" NOT from "@/App" to avoid circular deps.
import {
  API,
  BACKEND_URL,
  authFetch,
  setStoredToken,
  clearStoredToken,
} from "@/lib/api";

// Re-export for any legacy import sites (will be cleaned up over time)
export { API, BACKEND_URL, authFetch, setStoredToken, clearStoredToken };
export { getStoredToken } from "@/lib/api";

// ─── Token capture on OAuth redirect ─────────────────────────────────────────
// When the backend redirects back after Google OAuth it appends ?token=...
// This component reads it, stores it, and cleans the URL.
function OAuthTokenCapture({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setStoredToken(token);
      params.delete('token');
      const newSearch = params.toString();
      navigate(location.pathname + (newSearch ? `?${newSearch}` : ''), { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  return children;
}

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authFetch(`${API}/auth/me`);
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
          setIsAuthenticated(true);
        } else {
          clearStoredToken();
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

// ─── Router ───────────────────────────────────────────────────────────────────
function AppRouter() {
  return (
    <OAuthTokenCapture>
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
    </OAuthTokenCapture>
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

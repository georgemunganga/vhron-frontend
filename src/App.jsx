import React, { Component, Suspense, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Eagerly loaded pages (no leaflet dependency)
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import StaffLogin from "@/pages/StaffLogin";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import CompleteRegistration from "@/pages/CompleteRegistration";
import AboutVChron from "@/pages/AboutVChron";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import RequestDeleteAccount from "@/pages/RequestDeleteAccount";
import AuditTrail from "@/pages/AuditTrail";
import Analytics from "@/pages/Analytics";
import AdminScoping from "@/pages/AdminScoping";
import DeletionRequests from "@/pages/DeletionRequests";

// Lazy-loaded pages that import react-leaflet (prevents LeafletContext TDZ crash)
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const SuperUserDashboard = React.lazy(() => import("@/pages/SuperUserDashboard"));

import {
  API,
  BACKEND_URL,
  authFetch,
  setStoredToken,
  clearStoredToken,
} from "@/lib/api";

// Re-export for legacy import sites
export { API, BACKEND_URL, authFetch, setStoredToken, clearStoredToken };
export { getStoredToken } from "@/lib/api";

// ─── Lazy load fallback ───────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Global Error Boundary ────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6 text-sm">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/login';
              }}
              className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Token capture on OAuth redirect ─────────────────────────────────────────
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
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const response = await authFetch(`${API}/auth/me`);
        if (cancelled) return;
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
          setIsAuthenticated(true);
        } else {
          clearStoredToken();
          setIsAuthenticated(false);
        }
      } catch {
        if (!cancelled) setIsAuthenticated(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return <PageLoader />;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && userData?.role !== 'admin' && userData?.role !== 'superuser') {
    return <Navigate to="/dashboard" replace />;
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
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/complete-registration"
          element={
            <ProtectedRoute>
              <CompleteRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/superuser"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageLoader />}>
                <SuperUserDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        {/* In-app informational & account pages (protected) */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutVChron />
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/terms"
          element={<TermsAndConditions />}
        />
        <Route
          path="/request-deletion"
          element={
            <ProtectedRoute>
              <RequestDeleteAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-trail"
          element={
            <ProtectedRoute requireAdmin>
              <AuditTrail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requireAdmin>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-scoping"
          element={
            <ProtectedRoute requireAdmin>
              <AdminScoping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deletion-requests"
          element={
            <ProtectedRoute requireAdmin>
              <DeletionRequests />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OAuthTokenCapture>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <AppRouter />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;

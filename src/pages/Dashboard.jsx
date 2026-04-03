import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Clock, 
  MapPin, 
  LogIn, 
  LogOut, 
  History, 
  Settings, 
  User, 
  Wifi, 
  WifiOff,
  Building2,
  Briefcase,
  Menu,
  X,
  Phone,
  Shield,
  Info,
  FileText,
  Trash2,
  ChevronDown,
  Plus,
  CheckCircle2,
  ClipboardList
} from "lucide-react";
import { API, authFetch } from "@/lib/api";
import localforage from "localforage";
import Logo from "@/components/Logo";

// Initialize localforage for offline storage
const offlineStore = localforage.createInstance({
  name: "vchron-offline"
});

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [availableShifts, setAvailableShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [assignedShift, setAssignedShift] = useState(null);

  // Task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const taskInputRef = useRef(null);

  // Fetch attendance status
  const fetchStatus = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      const response = await authFetch(`${API}/attendance/status`, {
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  }, [isOnline]);

  // Sync offline records (declared before the online/offline useEffect that depends on it)
  const syncOfflineRecords = useCallback(async () => {
    try {
      const offlineRecords = await offlineStore.getItem("pendingRecords") || [];
      
      if (offlineRecords.length === 0) return;

      const response = await authFetch(`${API}/attendance/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: offlineRecords })
      });

      if (response.ok) {
        await offlineStore.setItem("pendingRecords", []);
        setPendingSync(0);
        toast.success(`Synced ${offlineRecords.length} offline record(s)`);
        fetchStatus();
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  }, [fetchStatus]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineRecords();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineRecords]);

  // Fetch areas of allocation
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await authFetch(`${API}/data/areas`);
        if (response.ok) {
          const data = await response.json();
          setAreas(data.areas || []);
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Fetch available shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await authFetch(`${API}/shifts/available`, { });
        if (response.ok) {
          const data = await response.json();
          setAvailableShifts(data.shifts || []);
          if (data.assigned_shift && data.assigned_shift !== "self_select") {
            setAssignedShift(data.assigned_shift);
            setSelectedShift(data.assigned_shift);
          }
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    fetchShifts();
  }, []);

  // Always fetch fresh user data from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authFetch(`${API}/auth/me`, {
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Check if user needs to complete registration (position and facility only)
          if (!userData.position || !userData.facility) {
            navigate("/complete-registration", { state: { user: userData } });
            return;
          }
          setUser(userData);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [user, fetchStatus]);

  // Get current location
  // ── Geolocation: 3-tier strategy ────────────────────────────────────────
  // Tier 1: High-accuracy GPS (best for mobile outdoors)
  // Tier 2: Low-accuracy network/WiFi positioning (works on all devices)
  // Tier 3: IP-based geolocation (last resort, city-level accuracy)
  const getLocationTier = (highAccuracy) =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('no_api')); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 20000 : 10000, maximumAge: highAccuracy ? 0 : 60000 }
      );
    });

  const getLocationViaIP = async () => {
    // Free IP geolocation — no API key needed, returns city-level coords
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('ip_geo_failed');
    const d = await res.json();
    if (!d.latitude || !d.longitude) throw new Error('ip_geo_no_coords');
    return { latitude: d.latitude, longitude: d.longitude, accuracy: null, source: 'ip' };
  };

  const getCurrentLocation = async () => {
    // Tier 1: GPS
    try {
      const loc = await getLocationTier(true);
      return { ...loc, source: 'gps' };
    } catch (e1) {
      console.warn('GPS failed, trying network positioning:', e1.message);
    }
    // Tier 2: Network/WiFi
    try {
      const loc = await getLocationTier(false);
      return { ...loc, source: 'network' };
    } catch (e2) {
      console.warn('Network positioning failed, trying IP geolocation:', e2.message);
    }
    // Tier 3: IP geolocation
    try {
      const loc = await getLocationViaIP();
      return loc;
    } catch (e3) {
      console.warn('IP geolocation failed:', e3.message);
    }
    throw new Error('All location methods failed');
  };

  // Request location on mount — try silently, show status
  useEffect(() => {
    setLocationError(null);
    getCurrentLocation()
      .then((loc) => {
        setCurrentLocation(loc);
        setLocationError(null);
      })
      .catch((error) => {
        console.error('Location error:', error);
        setLocationError(error.message);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check pending sync count
  useEffect(() => {
    const checkPending = async () => {
      const records = await offlineStore.getItem("pendingRecords") || [];
      setPendingSync(records.length);
    };
    checkPending();
  }, []);

  // Handle attendance action
  const handleAttendance = async (action) => {
    if (action === "login" && !selectedArea) {
      toast.error("Please select your current location first");
      return;
    }
    if (action === "login" && !selectedShift) {
      toast.error("Please select the shift you are reporting for");
      return;
    }

    setActionLoading(true);

    try {
      // Get location
      let coords = currentLocation;
      try {
        coords = await getCurrentLocation();
        setCurrentLocation(coords);
      } catch (error) {
        console.warn("Could not get location:", error);
      }

      const record = {
        action,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        area_of_allocation: selectedArea,
        shift_type: action === "login" ? selectedShift : undefined,
        offline_id: `offline_${Date.now()}`
      };

      if (isOnline) {
        const response = await authFetch(`${API}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record)
        });

        if (response.ok) {
          toast.success(
            action === "login" 
              ? "Successfully reported for duty!" 
              : "Shift ended successfully!"
          );
          if (action === "logout") {
            setSelectedArea("");
            setSelectedShift("");
          }
          fetchStatus();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Failed to record attendance");
        }
      } else {
        // Save offline
        const offlineRecords = await offlineStore.getItem("pendingRecords") || [];
        offlineRecords.push(record);
        await offlineStore.setItem("pendingRecords", offlineRecords);
        setPendingSync(offlineRecords.length);
        
        toast.info(
          action === "login"
            ? "Saved offline. Will sync when online."
            : "Saved offline. Will sync when online."
        );

        // Update local status
        setStatus({
          is_on_duty: action === "login",
          last_action: action,
          last_timestamp: new Date().toISOString()
        });
        if (action === "logout") {
          setSelectedArea("");
          setSelectedShift("");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Attendance error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authFetch(`${API}/auth/logout`, {
        method: "POST"
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("vchron_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isOnDuty = status?.is_on_duty === true;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="offline-banner px-4 py-2 flex items-center justify-center gap-2 text-sm">
          <WifiOff className="w-4 h-4" />
          <span>You're offline. Changes will sync when connected.</span>
          {pendingSync > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pendingSync} pending
            </Badge>
          )}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Logo variant="dark" size="sm" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {/* User dropdown menu */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">
                <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center">
                  {user?.picture
                    ? <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    : <User className="w-4 h-4 text-teal-600" />}
                </div>
                <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => navigate('/about')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <Info className="w-4 h-4 text-teal-600" /> About VChron
                </button>
                <button onClick={() => navigate('/privacy-policy')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <FileText className="w-4 h-4 text-teal-600" /> Privacy Policy
                </button>
                <button onClick={() => navigate('/terms')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <FileText className="w-4 h-4 text-teal-600" /> Terms &amp; Conditions
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button onClick={() => navigate('/request-deletion')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> Request Account Deletion
                </button>
              </div>
            </div>
            {isOnline && (
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              className="text-slate-600"
              onClick={() => navigate("/history")}
              data-testid="history-nav-btn"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button 
              variant="ghost" 
              className="text-slate-600"
              onClick={() => navigate("/my-reports")}
              data-testid="my-reports-nav-btn"
            >
              <FileText className="w-4 h-4 mr-2" />
              My Reports
            </Button>
            {user?.role === "admin" && (
              <Button 
                variant="ghost" 
                className="text-slate-600"
                onClick={() => navigate("/admin")}
                data-testid="admin-nav-btn"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            {user?.role === "superuser" && (
              <>
                <Button 
                  variant="ghost" 
                  className="text-slate-600"
                  onClick={() => navigate("/admin")}
                  data-testid="admin-nav-btn"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-amber-700"
                  onClick={() => navigate("/superuser")}
                  data-testid="superuser-nav-btn"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Super User
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              className="border-slate-200"
              onClick={handleLogout}
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-600"
              onClick={() => { navigate("/history"); setMobileMenuOpen(false); }}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-600"
              onClick={() => { navigate("/my-reports"); setMobileMenuOpen(false); }}
            >
              <FileText className="w-4 h-4 mr-2" />
              My Reports
            </Button>
            {user?.role === "admin" && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-600"
                onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
            {user?.role === "superuser" && (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-600"
                  onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-amber-700"
                  onClick={() => { navigate("/superuser"); setMobileMenuOpen(false); }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Super User Panel
                </Button>
              </>
            )}
            {/* Mobile user menu links */}
            <div className="border-t border-slate-100 pt-2 mt-1 space-y-1">
              <p className="text-xs font-semibold text-slate-400 px-2 pb-1">Account</p>
              <Button variant="ghost" className="w-full justify-start text-slate-600"
                onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>
                <Info className="w-4 h-4 mr-2 text-teal-600" /> About VChron
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600"
                onClick={() => { navigate('/privacy-policy'); setMobileMenuOpen(false); }}>
                <FileText className="w-4 h-4 mr-2 text-teal-600" /> Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600"
                onClick={() => { navigate('/terms'); setMobileMenuOpen(false); }}>
                <FileText className="w-4 h-4 mr-2 text-teal-600" /> Terms &amp; Conditions
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600"
                onClick={() => { navigate('/request-deletion'); setMobileMenuOpen(false); }}>
                <Trash2 className="w-4 h-4 mr-2" /> Request Account Deletion
              </Button>
            </div>
            <div className="border-t border-slate-100 pt-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* User Info Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-teal-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 font-['Manrope']" data-testid="user-name">
                  {user?.name}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span data-testid="user-phone">{user?.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span data-testid="user-position">{user?.position}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span data-testid="user-facility">{user?.facility}</span>
                  </div>
                </div>
              </div>
              <Badge 
                className={isOnDuty ? "status-on-duty" : "status-off-duty"}
                data-testid="status-badge"
              >
                {isOnDuty ? "On Duty" : "Off Duty"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        <div className="flex items-center gap-2 text-sm text-slate-500 px-2 flex-wrap">
          <MapPin className="w-4 h-4 shrink-0" />
          {locationError ? (
            <>
              <span className="text-amber-600 text-xs">Location unavailable — coordinates will be approximate.</span>
              <button
                className="text-xs text-teal-600 underline"
                onClick={() => {
                  setLocationError(null);
                  setCurrentLocation(null);
                  getCurrentLocation()
                    .then((loc) => { setCurrentLocation(loc); setLocationError(null); })
                    .catch((e) => setLocationError(e.message));
                }}
              >Retry</button>
            </>
          ) : currentLocation ? (
            <span className="font-mono text-xs">
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              {currentLocation.source === 'ip' && <span className="text-amber-500 ml-1">(approx.)</span>}
              {currentLocation.source === 'network' && <span className="text-blue-500 ml-1">(network)</span>}
              {currentLocation.source === 'gps' && <span className="text-emerald-500 ml-1">(GPS)</span>}
            </span>
          ) : (
            <span className="text-xs">Detecting location…</span>
          )}
        </div>

        {/* Your Current Location Selection */}
        {!isOnDuty ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-slate-700 font-medium mb-2 block">Your Current Location</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="h-12 border-slate-200" data-testid="current-location-select">
                  <MapPin className="w-5 h-5 text-teal-600 mr-2" />
                  <SelectValue placeholder="Select where you are reporting from" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-teal-200 bg-teal-50/50 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-slate-500 text-sm mb-1 block">Reporting From</Label>
              <p className="font-medium text-teal-800 flex items-center gap-2" data-testid="locked-location">
                <MapPin className="w-4 h-4 text-teal-600" />
                {selectedArea || "—"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Shift Selection - only when NOT on duty and after location selected */}
        {!isOnDuty && selectedArea && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-slate-700 font-medium mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Shift
                {assignedShift && (
                  <Badge className="bg-teal-100 text-teal-700 text-xs border-0 ml-1">Pre-assigned</Badge>
                )}
              </Label>
              {assignedShift ? (
                <div className="text-sm text-slate-600 bg-teal-50 p-3 rounded-lg" data-testid="assigned-shift-display">
                  Your shift has been assigned: <span className="font-semibold text-teal-700 capitalize">{assignedShift.replace("_", " ")}</span>
                  {availableShifts.find(s => s.key === assignedShift) && (
                    <span className="text-slate-500 ml-1">
                      ({availableShifts.find(s => s.key === assignedShift)?.start} - {availableShifts.find(s => s.key === assignedShift)?.end})
                    </span>
                  )}
                </div>
              ) : (
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger className="h-12 border-slate-200" data-testid="shift-select">
                    <Clock className="w-5 h-5 text-teal-600 mr-2" />
                    <SelectValue placeholder="Select your shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableShifts.map((shift) => (
                      <SelectItem key={shift.key} value={shift.key}>
                        {shift.label} ({shift.start} - {shift.end})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        )}

        {/* Locked shift display when on duty */}
        {isOnDuty && selectedShift && (
          <Card className="border-teal-200 bg-teal-50/50 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-slate-500 text-sm mb-1 block">Current Shift</Label>
              <p className="font-medium text-teal-800 flex items-center gap-2" data-testid="locked-shift">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="capitalize">{selectedShift.replace("_", " ")}</span>
                {availableShifts.find(s => s.key === selectedShift) && (
                  <span className="text-sm text-teal-600 font-normal">
                    ({availableShifts.find(s => s.key === selectedShift)?.start} - {availableShifts.find(s => s.key === selectedShift)?.end})
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          {/* Report for Duty Button */}
          <button
            onClick={() => handleAttendance("login")}
            disabled={actionLoading || isOnDuty || !selectedArea || !selectedShift}
            className={`action-button-login h-32 md:h-40 flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isOnDuty || !selectedArea || !selectedShift ? 'opacity-50' : ''}`}
            data-testid="report-duty-btn"
          >
            {actionLoading ? (
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-10 h-10" />
                <span className="text-xl font-bold font-['Manrope']">Report for Duty</span>
                <span className="text-sm opacity-80">{selectedArea ? `Clock in at ${selectedArea}` : 'Select location first'}</span>
              </>
            )}
          </button>

          {/* End Shift Button */}
          <button
            onClick={() => {
              if (!isOnDuty) return;
              setTaskList([]);
              setTaskInput("");
              setShowTaskModal(true);
            }}
            disabled={actionLoading || !isOnDuty}
            className={`action-button-logout h-32 md:h-40 flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${!isOnDuty ? 'opacity-50' : ''}`}
            data-testid="end-shift-btn"
          >
            {actionLoading ? (
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-10 h-10" />
                <span className="text-xl font-bold font-['Manrope']">End Shift</span>
                <span className="text-sm opacity-80">Clock out from your shift</span>
              </>
            )}
          </button>
        </div>

        {/* Last Action Info */}
        {status?.last_action && status?.last_timestamp && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">
                Last action: <span className="font-medium text-slate-700">
                  {status.last_action === "login" ? "Reported for duty" : "Ended shift"}
                </span> at{" "}
                <span className="font-mono text-xs text-slate-600">
                  {new Date(status.last_timestamp).toLocaleString()}
                </span>
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* ─── Task Modal ─────────────────────────────────────────────────────── */}
      <Dialog open={showTaskModal} onOpenChange={(open) => { if (!taskSubmitting) setShowTaskModal(open); }}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <ClipboardList className="w-5 h-5 text-teal-600" />
              What did you accomplish today?
            </DialogTitle>
            <p className="text-sm text-slate-500 mt-1">
              Please log at least one task before ending your shift. This helps track accountability.
            </p>
          </DialogHeader>

          {/* Task input row */}
          <div className="flex gap-2 mt-2">
            <Input
              ref={taskInputRef}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value.slice(0, 200))}
              placeholder="e.g. Conducted morning ward rounds"
              className="flex-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && taskInput.trim()) {
                  e.preventDefault();
                  if (taskList.length >= 20) { toast.warning("Maximum 20 tasks"); return; }
                  setTaskList((prev) => [...prev, taskInput.trim()]);
                  setTaskInput("");
                  setTimeout(() => taskInputRef.current?.focus(), 50);
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-teal-600 text-teal-600 hover:bg-teal-50"
              disabled={!taskInput.trim() || taskList.length >= 20}
              onClick={() => {
                if (!taskInput.trim()) return;
                if (taskList.length >= 20) { toast.warning("Maximum 20 tasks"); return; }
                setTaskList((prev) => [...prev, taskInput.trim()]);
                setTaskInput("");
                setTimeout(() => taskInputRef.current?.focus(), 50);
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400">Press Enter or click + to add. Max 20 tasks, 200 chars each.</p>

          {/* Task list */}
          {taskList.length > 0 && (
            <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {taskList.map((task, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="text-teal-600 font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-sm text-slate-700 flex-1 break-words">{task}</span>
                  <button
                    className="text-slate-400 hover:text-red-500 shrink-0 mt-0.5"
                    onClick={() => setTaskList((prev) => prev.filter((_, j) => j !== i))}
                    title="Remove task"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {taskList.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm">
              No tasks added yet. Add at least one before ending shift.
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={taskSubmitting}
              onClick={() => setShowTaskModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={taskList.length === 0 || taskSubmitting}
              onClick={async () => {
                setTaskSubmitting(true);
                try {
                  // Step 1: Submit logout attendance record
                  let coords = currentLocation;
                  try { coords = await getCurrentLocation(); setCurrentLocation(coords); } catch {}

                  const record = {
                    latitude: coords?.latitude || null,
                    longitude: coords?.longitude || null,
                    area_of_allocation: selectedArea,
                    offline_id: `offline_${Date.now()}`
                  };

                  if (isOnline) {
                    const attRes = await authFetch(`${API}/attendance`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(record)
                    });

                    if (!attRes.ok) {
                      const err = await attRes.json();
                      toast.error(err.detail || "Failed to record attendance");
                      return;
                    }

                    const attData = await attRes.json();

                    // Step 2: Submit tasks linked to the logout attendance_id
                    try {
                      await authFetch(`${API}/attendance/tasks`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ attendance_id: attData.attendance_id, tasks: taskList })
                      });
                    } catch (taskErr) {
                      console.warn("Tasks submission failed (non-blocking):", taskErr);
                    }

                    toast.success("Shift ended and tasks recorded!");
                    setSelectedArea("");
                    setSelectedShift("");
                    setShowTaskModal(false);
                    fetchStatus();
                  } else {
                    // Offline: save with tasks
                    const offlineRecords = await offlineStore.getItem("pendingRecords") || [];
                    offlineRecords.push({ ...record, tasks: taskList });
                    await offlineStore.setItem("pendingRecords", offlineRecords);
                    setPendingSync(offlineRecords.length);
                    toast.info("Saved offline. Will sync when online.");
                    setStatus({ is_on_duty: false, last_action: "logout", last_timestamp: new Date().toISOString() });
                    setSelectedArea("");
                    setSelectedShift("");
                    setShowTaskModal(false);
                  }
                } catch (error) {
                  toast.error("An error occurred. Please try again.");
                  console.error("End shift error:", error);
                } finally {
                  setTaskSubmitting(false);
                }
              }}
            >
              {taskSubmitting ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Ending Shift…</span>
              ) : (
                <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> End Shift</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

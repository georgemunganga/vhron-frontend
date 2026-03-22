import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft, Users, Activity, Download, Search, Shield, Building2,
  Edit, Trash2, KeyRound, UserPlus, Clock, Settings, BarChart3,
  ChevronRight, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Plus,
  Landmark, Network, ChevronDown, User2
} from "lucide-react";
import { API, authFetch } from "@/lib/api";
import Logo from "@/components/Logo";

const SuperUserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Check superuser access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await authFetch(`${API}/auth/me`, { });
        if (res.ok) {
          const user = await res.json();
          if (user.role !== "superuser") {
            toast.error("Super User access required");
            navigate("/dashboard");
            return;
          }
          setCurrentUser(user);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" data-testid="su-back-btn">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Logo variant="light" size="sm" />
              <span className="text-xs text-slate-500 hidden sm:block">{currentUser?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs"
              onClick={() => navigate('/admin-scoping')}
            >
              <Building2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Admin Scope</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs"
              onClick={() => navigate('/audit-trail')}
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Audit Trail</span>
            </Button>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">SUPERUSER</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 grid grid-cols-7 w-full max-w-4xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-overview">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-users">
              <Users className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-facilities">
              <Building2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Facilities</span>
            </TabsTrigger>
            <TabsTrigger value="shifts" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-shifts">
              <Clock className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Shifts</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-reports">
              <Activity className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="ministries" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-ministries">
              <Landmark className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Ministries</span>
            </TabsTrigger>
            <TabsTrigger value="org-tree" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400" data-testid="su-tab-org-tree">
              <Network className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Org Tree</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab currentUser={currentUser} /></TabsContent>
          <TabsContent value="facilities"><FacilitiesTab /></TabsContent>
          <TabsContent value="shifts"><ShiftsTab /></TabsContent>
          <TabsContent value="reports"><ReportsTab /></TabsContent>
          <TabsContent value="ministries"><MinistriesTab /></TabsContent>
          <TabsContent value="org-tree"><OrgTreeTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// ============ OVERVIEW TAB ============
const OverviewTab = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authFetch(`${API}/superuser/stats`, { });
        if (res.ok) setStats(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Admins", value: stats?.total_admins || 0, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Super Users", value: stats?.total_superusers || 0, icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Facilities", value: stats?.total_facilities || 0, icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Today's Logins", value: stats?.today_logins || 0, icon: Activity, color: "text-teal-400", bg: "bg-teal-500/10" },
    { label: "Currently On Duty", value: stats?.currently_on_duty || 0, icon: Clock, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-6" data-testid="su-overview">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-white border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{c.label}</p>
                  <p className={`text-3xl font-bold font-['Manrope'] ${c.color}`}>{c.value}</p>
                </div>
                <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}>
                  <c.icon className={`w-6 h-6 ${c.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============ USERS TAB ============
const UsersTab = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter !== "all") params.append("role", roleFilter);
      params.append("limit", "100");
      const res = await authFetch(`${API}/superuser/users?${params}`, { });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch (e) { console.error(e); }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      const res = await authFetch(`${API}/superuser/users/${userId}`, { method: "DELETE" });
      if (res.ok) { toast.success("User deleted"); fetchUsers(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to delete user"); }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const res = await authFetch(`${API}/superuser/users/${userId}/role`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) { toast.success("Role updated"); fetchUsers(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to update role"); }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      const res = await authFetch(`${API}/superuser/users/${userId}/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword })
      });
      if (res.ok) { toast.success("Password reset"); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to reset password"); }
  };

  return (
    <div className="space-y-4" data-testid="su-users">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-slate-200 text-slate-900" data-testid="su-user-search" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900" data-testid="su-role-filter">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="superuser">Super User</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchUsers} className="border-slate-200 text-slate-600 hover:bg-slate-100" data-testid="su-refresh-users">
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </div>

      <p className="text-sm text-slate-500">{total} user(s) found</p>

      {/* Users Table */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-500">Name</TableHead>
                  <TableHead className="text-slate-500">Email</TableHead>
                  <TableHead className="text-slate-500">Phone</TableHead>
                  <TableHead className="text-slate-500">Position</TableHead>
                  <TableHead className="text-slate-500">Facility</TableHead>
                  <TableHead className="text-slate-500">Role</TableHead>
                  <TableHead className="text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.user_id} className="border-slate-200 hover:bg-slate-50/80">
                    <TableCell className="font-medium text-slate-900">{u.name}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{u.email}</TableCell>
                    <TableCell className="text-slate-500">{u.phone_number || "-"}</TableCell>
                    <TableCell className="text-slate-500">{u.position || "-"}</TableCell>
                    <TableCell className="text-slate-500 text-sm max-w-[150px] truncate">{u.facility || "-"}</TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Role Change */}
                        <RoleChangeDialog user={u} onRoleChange={handleRoleChange} />
                        {/* Reset Password */}
                        <ResetPasswordDialog user={u} onReset={handleResetPassword} />
                        {/* Delete */}
                        {u.user_id !== currentUser?.user_id && (
                          <DeleteUserDialog user={u} onDelete={handleDelete} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-500">No users found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ FACILITIES TAB ============
const FacilitiesTab = () => {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({ name: "", district: "", province: "" });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState({});
  const [adding, setAdding] = useState(false);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");

  const fetchFacilities = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/superuser/facilities`, { });
      if (res.ok) { const data = await res.json(); setFacilities(data.facilities || []); }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchFacilities();
    const fetchLocations = async () => {
      try {
        const [pRes, dRes] = await Promise.all([
          authFetch(`${API}/superuser/provinces`, { }),
          authFetch(`${API}/superuser/districts`, { })
        ]);
        if (pRes.ok) { const d = await pRes.json(); setProvinces(d.provinces || []); }
        if (dRes.ok) { const d = await dRes.json(); setDistricts(d.districts || {}); }
      } catch (e) { console.error(e); }
    };
    fetchLocations();
  }, [fetchFacilities]);

  const handleAddFacility = async () => {
    if (!newFacility.name || !newFacility.district || !newFacility.province) {
      toast.error("All fields are required"); return;
    }
    setAdding(true);
    try {
      const res = await authFetch(`${API}/superuser/facilities`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFacility)
      });
      if (res.ok) { toast.success("Facility added"); setNewFacility({ name: "", district: "", province: "" }); fetchFacilities(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to add facility"); }
    finally { setAdding(false); }
  };

  const handleDeleteFacility = async (facilityId) => {
    try {
      const res = await authFetch(`${API}/superuser/facilities/${facilityId}`, { method: "DELETE" });
      if (res.ok) { toast.success("Facility deleted"); fetchFacilities(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to delete facility"); }
  };

  const selectedProvinceDistricts = districts[newFacility.province] || [];

  // Filter facilities based on search + province/district filters
  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch = !facilitySearch || f.name.toLowerCase().includes(facilitySearch.toLowerCase()) || f.district?.toLowerCase().includes(facilitySearch.toLowerCase());
    const matchesProvince = provinceFilter === "all" || f.province === provinceFilter;
    const matchesDistrict = districtFilter === "all" || f.district === districtFilter;
    return matchesSearch && matchesProvince && matchesDistrict;
  });

  // Get unique districts from facilities for the filter dropdown
  const facilityDistrictsList = [...new Set(facilities.filter(f => provinceFilter === "all" || f.province === provinceFilter).map(f => f.district).filter(Boolean))].sort();

  return (
    <div className="space-y-6" data-testid="su-facilities">
      {/* Add Facility */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-['Manrope'] text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add New Facility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={newFacility.province} onValueChange={(v) => setNewFacility(p => ({ ...p, province: v, district: "" }))}>
              <SelectTrigger className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-fac-province">
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={newFacility.district} onValueChange={(v) => setNewFacility(p => ({ ...p, district: v }))}>
              <SelectTrigger className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-fac-district">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {selectedProvinceDistricts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Facility name" value={newFacility.name} onChange={(e) => setNewFacility(p => ({ ...p, name: e.target.value }))} className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-fac-name" />
            <Button onClick={handleAddFacility} disabled={adding} className="bg-amber-600 hover:bg-amber-700 text-white" data-testid="su-add-facility-btn">
              <Plus className="w-4 h-4 mr-2" />{adding ? "Adding..." : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search facilities by name or district..." value={facilitySearch} onChange={(e) => setFacilitySearch(e.target.value)} className="pl-9 bg-white border-slate-200 text-slate-900" data-testid="su-facility-search" />
        </div>
        <Select value={provinceFilter} onValueChange={(v) => { setProvinceFilter(v); setDistrictFilter("all"); }}>
          <SelectTrigger className="w-48 bg-white border-slate-200 text-slate-900" data-testid="su-fac-filter-province">
            <SelectValue placeholder="Filter province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-48 bg-white border-slate-200 text-slate-900" data-testid="su-fac-filter-district">
            <SelectValue placeholder="Filter district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {facilityDistrictsList.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Facilities List */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-['Manrope'] text-slate-900">{filteredFacilities.length} of {facilities.length} Facilities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-500">Name</TableHead>
                  <TableHead className="text-slate-500">District</TableHead>
                  <TableHead className="text-slate-500">Province</TableHead>
                  <TableHead className="text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacilities.map((f) => (
                  <TableRow key={f.facility_id} className="border-slate-200 hover:bg-slate-50/80">
                    <TableCell className="text-slate-900 font-medium">{f.name}</TableCell>
                    <TableCell className="text-slate-500">{f.district}</TableCell>
                    <TableCell className="text-slate-500">{f.province}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFacility(f.facility_id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" data-testid={`su-del-fac-${f.facility_id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFacilities.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500">{facilities.length === 0 ? "No facilities. Add one above." : "No facilities match your search."}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ SHIFTS TAB ============
const ShiftsTab = () => {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await authFetch(`${API}/superuser/shifts`, { });
        if (res.ok) setConfig(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch(`${API}/superuser/shifts`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) { toast.success("Shift configuration saved"); setConfig(await res.json()); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (!config) return <div className="text-slate-500 text-center py-12">Loading shift config...</div>;

  const shiftFields = [
    { label: "Morning Shift", startKey: "morning_start", endKey: "morning_end", color: "text-yellow-400" },
    { label: "Afternoon Shift", startKey: "afternoon_start", endKey: "afternoon_end", color: "text-orange-400" },
    { label: "Night Shift", startKey: "night_start", endKey: "night_end", color: "text-indigo-400" },
    { label: "4-Off Shift", startKey: "four_off_start", endKey: "four_off_end", color: "text-cyan-400" },
    { label: "On Call", startKey: "on_call_start", endKey: "on_call_end", color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6" data-testid="su-shifts">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-['Manrope'] text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Shift Time Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {shiftFields.map((s) => (
            <div key={s.label} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label className={`font-medium ${s.color}`}>{s.label}</Label>
              <div className="flex items-center gap-2">
                <Label className="text-slate-500 text-sm w-12">Start</Label>
                <Input type="time" value={config[s.startKey] || ""} onChange={(e) => setConfig(p => ({ ...p, [s.startKey]: e.target.value }))} className="bg-slate-100 border-slate-200 text-slate-900" data-testid={`su-shift-${s.startKey}`} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-slate-500 text-sm w-12">End</Label>
                <Input type="time" value={config[s.endKey] || ""} onChange={(e) => setConfig(p => ({ ...p, [s.endKey]: e.target.value }))} className="bg-slate-100 border-slate-200 text-slate-900" data-testid={`su-shift-${s.endKey}`} />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-200">
            <Label className="text-slate-600 font-medium">Grace Period</Label>
            <div className="flex items-center gap-2 md:col-span-2">
              <Input type="number" value={config.grace_period_minutes || 15} onChange={(e) => setConfig(p => ({ ...p, grace_period_minutes: parseInt(e.target.value) || 0 }))} className="bg-slate-100 border-slate-200 text-slate-900 w-24" data-testid="su-shift-grace" />
              <span className="text-slate-500 text-sm">minutes</span>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto" data-testid="su-save-shifts-btn">
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ REPORTS TAB ============
const ReportsTab = () => {
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Location data for dropdowns
  const [provinces, setProvinces] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [facilitiesList, setFacilitiesList] = useState([]);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await authFetch(`${API}/provinces`);
        if (res.ok) { const d = await res.json(); setProvinces(d.provinces || []); }
      } catch (e) { console.error(e); }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!provinceFilter) { setDistrictsList([]); setDistrictFilter(""); setFacilitiesList([]); setFacilityFilter(""); return; }
    const fetchDistricts = async () => {
      try {
        const res = await authFetch(`${API}/districts/${encodeURIComponent(provinceFilter)}`);
        if (res.ok) { const d = await res.json(); setDistrictsList(d.districts || []); }
      } catch (e) { console.error(e); }
    };
    fetchDistricts();
    setDistrictFilter("");
    setFacilityFilter("");
    setFacilitiesList([]);
  }, [provinceFilter]);

  // Fetch facilities when district changes
  useEffect(() => {
    if (!districtFilter) { setFacilitiesList([]); setFacilityFilter(""); return; }
    const fetchFacilities = async () => {
      try {
        const res = await authFetch(`${API}/facilities/${encodeURIComponent(districtFilter)}`);
        if (res.ok) { const d = await res.json(); setFacilitiesList(d.facilities || []); }
      } catch (e) { console.error(e); }
    };
    fetchFacilities();
    setFacilityFilter("");
  }, [districtFilter]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", new Date(date).toISOString());
      if (provinceFilter) params.append("province", provinceFilter);
      if (districtFilter) params.append("district", districtFilter);
      if (facilityFilter) params.append("facility", facilityFilter);
      const res = await authFetch(`${API}/superuser/attendance-report?${params}`, { });
      if (res.ok) setReport(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [date, provinceFilter, districtFilter, facilityFilter]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", new Date(date).toISOString());
      if (provinceFilter) params.append("province", provinceFilter);
      if (districtFilter) params.append("district", districtFilter);
      if (facilityFilter) params.append("facility", facilityFilter);
      params.append("format", format);
      const res = await authFetch(`${API}/superuser/export?${params}`, { });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const mimeType = format === "csv"
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url;
        a.download = `attendance_report_${date || "all"}.${format === "csv" ? "csv" : "xlsx"}`;
        document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); a.remove();
        toast.success(`Exported as ${format.toUpperCase()}`);
      } else {
        toast.error("Export failed");
      }
    } catch { toast.error("Export failed"); }
  };

  const handleClearFilters = () => {
    setProvinceFilter("");
    setDistrictFilter("");
    setFacilityFilter("");
    setSearchQuery("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // Client-side search filter on loaded records
  const filteredRecords = (report?.records || []).filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.user_name?.toLowerCase().includes(q) ||
      r.facility?.toLowerCase().includes(q) ||
      r.position?.toLowerCase().includes(q) ||
      r.area_of_allocation?.toLowerCase().includes(q)
    );
  });

  // Recalc summary from filtered records
  const filteredSummary = {
    total: filteredRecords.filter(r => r.action === "login").length,
    late: filteredRecords.filter(r => r.status === "late").length,
    early: filteredRecords.filter(r => r.status === "early").length,
    on_time: filteredRecords.filter(r => r.status === "on_time").length,
  };

  const activeFilterCount = [provinceFilter, districtFilter, facilityFilter].filter(Boolean).length;

  return (
    <div className="space-y-4" data-testid="su-reports">
      {/* Location Filters Row */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-600">Filter by Location</span>
            {activeFilterCount > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">{activeFilterCount} active</Badge>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Province */}
            <div>
              <Label className="text-slate-500 text-xs mb-1 block">Province</Label>
              <Select value={provinceFilter || "_none"} onValueChange={(v) => setProvinceFilter(v === "_none" ? "" : v)}>
                <SelectTrigger className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-report-province">
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">All Provinces</SelectItem>
                  {provinces.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* District */}
            <div>
              <Label className="text-slate-500 text-xs mb-1 block">District</Label>
              <Select value={districtFilter || "_none"} onValueChange={(v) => setDistrictFilter(v === "_none" ? "" : v)} disabled={!provinceFilter}>
                <SelectTrigger className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-report-district">
                  <SelectValue placeholder={provinceFilter ? "All Districts" : "Select province first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">All Districts</SelectItem>
                  {districtsList.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Facility */}
            <div>
              <Label className="text-slate-500 text-xs mb-1 block">Facility</Label>
              <Select value={facilityFilter || "_none"} onValueChange={(v) => setFacilityFilter(v === "_none" ? "" : v)} disabled={!districtFilter}>
                <SelectTrigger className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-report-facility">
                  <SelectValue placeholder={districtFilter ? "All Facilities" : "Select district first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">All Facilities</SelectItem>
                  {facilitiesList.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Date */}
            <div>
              <Label className="text-slate-500 text-xs mb-1 block">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-100 border-slate-200 text-slate-900" data-testid="su-report-date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + Actions Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search by staff name, facility, position..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white border-slate-200 text-slate-900" data-testid="su-report-search" />
        </div>
        <Button variant="outline" onClick={handleClearFilters} className="border-slate-200 text-slate-600 hover:bg-slate-100" data-testid="su-report-clear">
          <XCircle className="w-4 h-4 mr-2" />Clear
        </Button>
        <Button variant="outline" onClick={fetchReport} className="border-slate-200 text-slate-600 hover:bg-slate-100" data-testid="su-report-refresh">
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")} className="border-slate-200 text-slate-600 hover:bg-slate-100" data-testid="su-export-csv">
            <Download className="w-4 h-4 mr-2" />CSV
          </Button>
          <Button onClick={() => handleExport("xlsx")} className="bg-amber-600 hover:bg-amber-700 text-white" data-testid="su-export-xlsx">
            <Download className="w-4 h-4 mr-2" />Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{filteredSummary.total}</p>
            <p className="text-xs text-slate-500">Total Logins</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-950 border-emerald-900">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{filteredSummary.early}</p>
            <p className="text-xs text-emerald-500">Early</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-950 border-blue-900">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{filteredSummary.on_time}</p>
            <p className="text-xs text-blue-500">On Time</p>
          </CardContent>
        </Card>
        <Card className="bg-red-950 border-red-900">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{filteredSummary.late}</p>
            <p className="text-xs text-red-500">Late</p>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-500 font-normal">
            Showing {filteredRecords.length} of {report?.records?.length || 0} records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-500">Name</TableHead>
                  <TableHead className="text-slate-500">Facility</TableHead>
                  <TableHead className="text-slate-500">Action</TableHead>
                  <TableHead className="text-slate-500">Time</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
                ) : filteredRecords.length ? (
                  filteredRecords.map((r, i) => (
                    <TableRow key={i} className={`border-slate-200 ${r.status === "late" ? "bg-red-950/30" : r.status === "early" ? "bg-emerald-950/30" : ""}`}>
                      <TableCell className="text-slate-900 font-medium">{r.user_name}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{r.facility}</TableCell>
                      <TableCell>
                        <Badge className={r.action === "login" ? "bg-emerald-500/20 text-emerald-400 border-0" : "bg-red-500/20 text-red-400 border-0"}>
                          {r.action.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} minutesLate={r.minutes_late} lateDisplay={r.late_display} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No records for selected filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ SMALL COMPONENTS ============
const RoleBadge = ({ role }) => {
  const styles = {
    superuser: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    admin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    user: "bg-slate-200/50 text-slate-500 border-slate-600"
  };
  return <Badge className={styles[role] || styles.user}>{role}</Badge>;
};

const StatusBadge = ({ status, minutesLate, lateDisplay }) => {
  if (status === "early") return <span className="flex items-center gap-1 text-emerald-400 text-sm"><CheckCircle2 className="w-3.5 h-3.5" />Early</span>;
  if (status === "on_time") return <span className="flex items-center gap-1 text-blue-400 text-sm"><CheckCircle2 className="w-3.5 h-3.5" />On Time</span>;
  if (status === "late") return <span className="flex items-center gap-1 text-red-400 text-sm"><AlertTriangle className="w-3.5 h-3.5" />Late{lateDisplay ? ` (${lateDisplay})` : minutesLate ? ` (${minutesLate}m)` : ""}</span>;
  if (status === "logout") return <span className="text-slate-500 text-sm">Logout</span>;
  return <span className="text-slate-600 text-sm">-</span>;
};

// Dialog: Change Role + Jurisdiction Assignment
const RoleChangeDialog = ({ user, onRoleChange }) => {
  const [role, setRole] = useState(user.role);
  const [jurisdictionType, setJurisdictionType] = useState(user.assigned_jurisdiction?.type || "district");
  const [jurisdictionValue, setJurisdictionValue] = useState(user.assigned_jurisdiction?.value || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      onRoleChange(user.user_id, role);
      // If admin, also assign jurisdiction
      if (role === "admin" && jurisdictionValue) {
        await authFetch(`${API}/superuser/users/${user.user_id}/jurisdiction`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: jurisdictionType, value: jurisdictionValue })
        });
        toast.success("Jurisdiction assigned");
      }
    } finally { setSaving(false); }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" data-testid={`su-role-btn-${user.user_id}`}>
          <Shield className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Change Role: {user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-500">{user.email}</p>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-slate-100 border-slate-200" data-testid={`su-role-select-${user.user_id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superuser">Super User</SelectItem>
            </SelectContent>
          </Select>

          {/* Jurisdiction assignment for admins */}
          {role === "admin" && (
            <div className="space-y-3 border-t border-slate-200 pt-3">
              <Label className="text-slate-500 text-sm">Assign Jurisdiction</Label>
              <Select value={jurisdictionType} onValueChange={setJurisdictionType}>
                <SelectTrigger className="bg-slate-100 border-slate-200" data-testid={`su-juris-type-${user.user_id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="district">District</SelectItem>
                  <SelectItem value="province">Province</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`Enter ${jurisdictionType} name...`}
                value={jurisdictionValue}
                onChange={(e) => setJurisdictionValue(e.target.value)}
                className="bg-slate-100 border-slate-200 text-slate-900"
                data-testid={`su-juris-value-${user.user_id}`}
              />
              {user.assigned_jurisdiction && (
                <p className="text-xs text-slate-500">
                  Current: {user.assigned_jurisdiction.type} → {user.assigned_jurisdiction.value}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-200 text-slate-600">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700" data-testid={`su-role-save-${user.user_id}`}>{saving ? "Saving..." : "Save"}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog: Reset Password
const ResetPasswordDialog = ({ user, onReset }) => {
  const [pwd, setPwd] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10" data-testid={`su-resetpwd-btn-${user.user_id}`}>
          <KeyRound className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Reset Password: {user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-500">{user.email}</p>
          <Input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="bg-slate-100 border-slate-200 text-slate-900" data-testid={`su-newpwd-${user.user_id}`} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-200 text-slate-600">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => { onReset(user.user_id, pwd); setPwd(""); }} className="bg-amber-600 hover:bg-amber-700" data-testid={`su-resetpwd-save-${user.user_id}`}>Reset</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog: Delete User
const DeleteUserDialog = ({ user, onDelete }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" data-testid={`su-delete-btn-${user.user_id}`}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="bg-white border-slate-200 text-slate-900">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" /> Delete User
        </DialogTitle>
      </DialogHeader>
      <p className="text-slate-500 py-4">
        Are you sure you want to delete <span className="text-slate-900 font-medium">{user.name}</span> ({user.email})?
        This action cannot be undone.
      </p>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="border-slate-200 text-slate-600">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={() => onDelete(user.user_id)} className="bg-red-600 hover:bg-red-700" data-testid={`su-confirm-delete-${user.user_id}`}>Delete</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ============ MINISTRIES TAB ============
const MinistriesTab = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: "", unit_term: "Facility", is_active: false });
  const [saving, setSaving] = useState(false);

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API}/superuser/ministries`);
      if (res.ok) { const d = await res.json(); setMinistries(d.ministries || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMinistries(); }, []);

  const openCreate = () => { setEditTarget(null); setForm({ name: "", unit_term: "Facility", is_active: false }); setShowForm(true); };
  const openEdit = (m) => { setEditTarget(m); setForm({ name: m.name, unit_term: m.unit_term, is_active: m.is_active }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Ministry name is required"); return; }
    setSaving(true);
    try {
      let res;
      if (editTarget) {
        res = await authFetch(`${API}/superuser/ministries/${editTarget.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, unit_term: form.unit_term }),
        });
      } else {
        res = await authFetch(`${API}/superuser/ministries`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      if (res.ok) {
        toast.success(editTarget ? "Ministry updated" : "Ministry created");
        setShowForm(false);
        fetchMinistries();
      } else {
        const e = await res.json();
        toast.error(e.detail || "Failed to save");
      }
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (m) => {
    const action = m.is_active ? "deactivate" : "activate";
    try {
      const res = await authFetch(`${API}/superuser/ministries/${m.id}/${action}`, { method: "PATCH" });
      if (res.ok) { toast.success(`Ministry ${action}d`); fetchMinistries(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete "${m.name}"? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`${API}/superuser/ministries/${m.id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Ministry deleted"); fetchMinistries(); }
      else { const e = await res.json(); toast.error(e.detail); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-4" data-testid="su-ministries">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 font-['Manrope']">Government Ministries</h2>
          <p className="text-sm text-slate-500">Manage ministries available for staff registration. Active ministries appear in the signup flow.</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white" data-testid="su-add-ministry-btn">
          <Plus className="w-4 h-4 mr-2" />Add Ministry
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="bg-slate-100 border-amber-500/30">
          <CardHeader><CardTitle className="text-base text-amber-400">{editTarget ? "Edit Ministry" : "New Ministry"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label className="text-slate-500 text-sm mb-1 block">Ministry Name</Label>
                <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Ministry of Health" className="bg-white border-slate-200 text-slate-900" data-testid="su-ministry-name" />
              </div>
              <div>
                <Label className="text-slate-500 text-sm mb-1 block">Unit Term</Label>
                <Input value={form.unit_term} onChange={(e) => setForm(p => ({ ...p, unit_term: e.target.value }))} placeholder="e.g. Facility, School, Office" className="bg-white border-slate-200 text-slate-900" data-testid="su-ministry-unit-term" />
                <p className="text-xs text-slate-500 mt-1">What org units are called in this ministry</p>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm text-slate-600">Active (visible in signup)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700" data-testid="su-ministry-save">{saving ? "Saving..." : "Save"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-200 text-slate-600">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ministries Table */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-500">Ministry Name</TableHead>
                <TableHead className="text-slate-500">Unit Term</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
                <TableHead className="text-slate-500">Created</TableHead>
                <TableHead className="text-slate-500 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
              ) : ministries.length ? (
                ministries.map((m) => (
                  <TableRow key={m.id} className="border-slate-200 hover:bg-slate-50/80">
                    <TableCell className="font-medium text-slate-900">{m.name}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{m.unit_term}</TableCell>
                    <TableCell>
                      <Badge className={m.is_active ? "bg-emerald-500/20 text-emerald-400 border-0" : "bg-slate-200/50 text-slate-500 border-0"}>
                        {m.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" data-testid={`su-edit-ministry-${m.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggle(m)} className={m.is_active ? "text-amber-400 hover:bg-amber-500/10" : "text-emerald-400 hover:bg-emerald-500/10"} data-testid={`su-toggle-ministry-${m.id}`}>
                          {m.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(m)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" data-testid={`su-delete-ministry-${m.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No ministries found. Click "Add Ministry" to create one.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ ORG TREE TAB ============
const OrgTreeTab = () => {
  const [tree, setTree] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [ministryFilter, setMinistryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    authFetch(`${API}/superuser/ministries`)
      .then(r => r.ok ? r.json() : { ministries: [] })
      .then(d => setMinistries(d.ministries || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = ministryFilter ? `?ministry_id=${ministryFilter}` : "";
    authFetch(`${API}/superuser/org-tree${params}`)
      .then(r => r.ok ? r.json() : { tree: [] })
      .then(d => { setTree(d.tree || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ministryFilter]);

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const totalUsers = tree.reduce((s, p) => s + p.user_count, 0);

  return (
    <div className="space-y-4" data-testid="su-org-tree">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 font-['Manrope']">Organisation Structure</h2>
          <p className="text-sm text-slate-500">{totalUsers} staff assigned across {tree.length} provinces</p>
        </div>
        <Select value={ministryFilter || "_all"} onValueChange={(v) => setMinistryFilter(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-56 bg-slate-100 border-slate-200 text-slate-900">
            <SelectValue placeholder="All Ministries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Ministries</SelectItem>
            {ministries.filter(m => m.is_active).map(m => (
              <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading organisation tree...</div>
      ) : tree.length === 0 ? (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-12 text-center text-slate-500">
            <Network className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p>No organisation data found. Seed geography data or assign staff to facilities.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tree.map((prov) => (
            <Card key={prov.id} className="bg-white border-slate-200">
              {/* Province Row */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/80 transition-colors"
                onClick={() => toggle(`prov-${prov.id}`)}
              >
                <div className="flex items-center gap-3">
                  {expanded[`prov-${prov.id}`] ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  <span className="font-semibold text-slate-900">{prov.name}</span>
                  <Badge className="bg-slate-200/50 text-slate-500 border-0 text-xs">{prov.districts.length} districts</Badge>
                </div>
                <Badge className={prov.user_count > 0 ? "bg-teal-500/20 text-teal-400 border-0" : "bg-slate-200/50 text-slate-500 border-0"}>
                  <User2 className="w-3 h-3 mr-1" />{prov.user_count} staff
                </Badge>
              </button>

              {/* Districts */}
              {expanded[`prov-${prov.id}`] && (
                <div className="border-t border-slate-200">
                  {prov.districts.map((dist) => (
                    <div key={dist.id}>
                      <button
                        className="w-full flex items-center justify-between px-8 py-2.5 hover:bg-slate-50/50 transition-colors"
                        onClick={() => toggle(`dist-${dist.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          {expanded[`dist-${dist.id}`] ? <ChevronDown className="w-3.5 h-3.5 text-blue-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                          <span className="text-slate-200 text-sm">{dist.name}</span>
                          <Badge className="bg-slate-100 text-slate-500 border-0 text-xs">{dist.org_units.length} facilities</Badge>
                        </div>
                        <Badge className={dist.user_count > 0 ? "bg-blue-500/20 text-blue-400 border-0 text-xs" : "bg-slate-100 text-slate-600 border-0 text-xs"}>
                          <User2 className="w-3 h-3 mr-1" />{dist.user_count}
                        </Badge>
                      </button>

                      {/* Org Units / Facilities */}
                      {expanded[`dist-${dist.id}`] && (
                        <div className="border-t border-slate-200/50">
                          {dist.org_units.length === 0 ? (
                            <p className="px-16 py-2 text-xs text-slate-600">No facilities</p>
                          ) : dist.org_units.map((unit) => (
                            <div key={unit.id}>
                              <button
                                className="w-full flex items-center justify-between px-14 py-2 hover:bg-slate-100/20 transition-colors"
                                onClick={() => toggle(`unit-${unit.id}`)}
                              >
                                <div className="flex items-center gap-3">
                                  {expanded[`unit-${unit.id}`] ? <ChevronDown className="w-3 h-3 text-teal-400" /> : <ChevronRight className="w-3 h-3 text-slate-700" />}
                                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-slate-600 text-sm">{unit.name}</span>
                                </div>
                                <Badge className={unit.users.length > 0 ? "bg-teal-500/20 text-teal-400 border-0 text-xs" : "bg-slate-100 text-slate-600 border-0 text-xs"}>
                                  <User2 className="w-3 h-3 mr-1" />{unit.users.length}
                                </Badge>
                              </button>

                              {/* Users in this facility */}
                              {expanded[`unit-${unit.id}`] && (
                                <div className="px-20 py-1 space-y-1 border-t border-slate-200/30">
                                  {unit.users.length === 0 ? (
                                    <p className="text-xs text-slate-600 py-1">No staff assigned</p>
                                  ) : unit.users.map((u) => (
                                    <div key={u.user_id} className="flex items-center justify-between py-1">
                                      <div className="flex items-center gap-2">
                                        <User2 className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm text-slate-600">{u.name}</span>
                                        <span className="text-xs text-slate-500">{u.position}</span>
                                      </div>
                                      <Badge className="bg-slate-100 text-slate-500 border-0 text-xs capitalize">{u.assigned_shift?.replace("_", " ") || "—"}</Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperUserDashboard;

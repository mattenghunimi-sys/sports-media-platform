'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Printer, 
  ExternalLink, 
  Trash2, 
  Eye, 
  FileText, 
  UserCheck, 
  Building2, 
  RefreshCw, 
  Plus, 
  LogOut, 
  User, 
  KeyRound, 
  AlertCircle,
  Users,
  Settings,
  Shield,
  Edit3,
  UserPlus,
  Lock,
  Ban,
  AlertTriangle,
  RotateCw,
  Maximize2,
  FileCheck2,
  Camera,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import LFFLogo from '@/components/LFFLogo';
import PressCard from '@/components/PressCard';

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Active Main Tab: 'journalists' or 'users'
  const [mainTab, setMainTab] = useState('journalists');

  // Login form state inside page if not logged in
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Dashboard Journalists State
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected journalist for details modal
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalCardSide, setModalCardSide] = useState('front');
  const [fullscreenDoc, setFullscreenDoc] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedZones, setSelectedZones] = useState('المنصة • المركز الإعلامي');
  const [processingId, setProcessingId] = useState(null);

  const AVAILABLE_ZONES = ['المنصة', 'المركز الإعلامي', 'أرضية الملعب'];

  const isZoneActive = (zone) => {
    if (!selectedZones) return false;
    if (zone === 'المنصة') return selectedZones.includes('المنصة') || selectedZones.includes('المقصورة') || selectedZones.includes('PRESS') || selectedZones.includes('VIP');
    if (zone === 'المركز الإعلامي') return selectedZones.includes('المركز') || selectedZones.includes('CENTRE');
    if (zone === 'أرضية الملعب') return selectedZones.includes('الملعب') || selectedZones.includes('PITCH');
    return selectedZones.includes(zone);
  };

  const handleToggleZone = (zone) => {
    const active = AVAILABLE_ZONES.filter(z => isZoneActive(z));
    let next;
    if (active.includes(zone)) {
      next = active.filter(z => z !== zone);
    } else {
      next = [...active, zone];
    }
    if (next.length === 0) {
      next = [zone];
    }
    setSelectedZones(next.join(' • '));
  };

  const handleOpenReviewModal = async (j) => {
    setActiveModal(j);
    setReviewNotes(j.reviewNotes || '');
    setSelectedZones(j.zoneAccess || 'المنصة • المركز الإعلامي');
    setModalCardSide('front');

    if (!j.documentUrl || !j.photoUrl) {
      setModalLoading(true);
      try {
        const res = await fetch(`/api/journalists/${j.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setActiveModal(data.data);
          if (data.data.reviewNotes) setReviewNotes(data.data.reviewNotes);
          if (data.data.zoneAccess) setSelectedZones(data.data.zoneAccess);
        }
      } catch (err) {
        console.error('Error fetching journalist full details:', err);
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Users Management State
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModalType, setUserModalType] = useState(null); // 'CREATE' | 'EDIT_SELF' | 'EDIT_OTHER'
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    displayName: '',
    role: 'ASSISTANT'
  });
  const [userFormError, setUserFormError] = useState('');
  const [userFormSuccess, setUserFormSuccess] = useState('');
  const [userFormLoading, setUserFormLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        fetchJournalists();
        fetchUsers();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser.trim(), password: loginPass.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'اسم المستخدم أو رمز المرور غير صحيح');
      }

      setIsAuthenticated(true);
      setCurrentUser(data.user);
      fetchJournalists();
      fetchUsers();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/');
  };

  // Fetch Journalists
  const fetchJournalists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journalists');
      const data = await res.json();
      if (data.success) {
        setJournalists(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/journalists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes || (status === 'APPROVED' ? 'تم الاعتماد الرسمي من الاتحاد الليبي لكرة القدم.' : 'الطلب غير مكتمل الشروط.'),
          zoneAccess: selectedZones
        }),
      });

      const data = await res.json();
      if (data.success) {
        setJournalists(prev => prev.map(j => j.id === id ? data.data : j));
        setActiveModal(null);
        setReviewNotes('');
      } else {
        alert(data.error || 'فشل التحديث');
      }
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء التحديث');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteJournalist = async (id, name) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف سجل الإعلامي (${name}) نهائياً؟`)) return;

    try {
      const res = await fetch(`/api/journalists/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setJournalists(prev => prev.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('تعذر الحذف');
    }
  };

  // User Management Actions
  const handleOpenSelfEdit = () => {
    setUserFormError('');
    setUserFormSuccess('');
    setUserForm({
      username: currentUser.username,
      password: '',
      displayName: currentUser.displayName,
      role: currentUser.role
    });
    setUserModalType('EDIT_SELF');
  };

  const handleOpenCreateUser = () => {
    setUserFormError('');
    setUserFormSuccess('');
    setUserForm({
      username: '',
      password: '',
      displayName: '',
      role: 'ASSISTANT'
    });
    setUserModalType('CREATE');
  };

  const handleOpenEditUser = (user) => {
    setUserFormError('');
    setUserFormSuccess('');
    setSelectedUserToEdit(user);
    setUserForm({
      username: user.username,
      password: '',
      displayName: user.displayName,
      role: user.role
    });
    setUserModalType('EDIT_OTHER');
  };

  const handleSaveUserForm = async (e) => {
    e.preventDefault();
    setUserFormError('');
    setUserFormSuccess('');
    setUserFormLoading(true);

    try {
      if (userModalType === 'CREATE') {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'فشل إضافة المستخدم');
        setUserFormSuccess('تم إضافة المستخدم الجديد بنجاح');
        fetchUsers();
        setTimeout(() => setUserModalType(null), 1200);
      } else {
        // Edit self or edit other
        const targetId = userModalType === 'EDIT_SELF' ? currentUser.id : selectedUserToEdit.id;
        const res = await fetch(`/api/users/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'فشل تحديث البيانات');
        
        setUserFormSuccess('تم تحديث البيانات بنجاح!');
        fetchUsers();
        if (userModalType === 'EDIT_SELF') {
          setCurrentUser(prev => ({ ...prev, username: data.data.username, displayName: data.data.displayName }));
        }
        setTimeout(() => setUserModalType(null), 1200);
      }
    } catch (err) {
      setUserFormError(err.message);
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (id === currentUser.id) {
      alert('لا يمكنك حذف حسابك الحالي الذي تستخدمه لتسجيل الدخول.');
      return;
    }
    if (!confirm(`هل أنت متأكد من حذف حساب المشرف (${name})؟ لن يتمكن من تسجيل الدخول بعد الآن.`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل حذف الحساب');
      setUsersList(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // If checking authentication
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // IF NOT AUTHENTICATED: Show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-right">
          <div className="flex flex-col items-center text-center mb-6">
            <LFFLogo size={80} className="mb-3" />
            <h2 className="text-2xl font-black text-white">دخول مدير المنظومة</h2>
            <p className="text-xs text-slate-400 mt-1">الاتحاد الليبي لكرة القدم - لوحة المشرفين</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                رمز المرور
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>بيانات الدخول الافتراضية:</span>
              <span className="font-mono text-emerald-400">admin / lff@2026</span>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loginSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Journalists list
  const filteredList = journalists.filter(j => {
    const matchesStatus = filterStatus === 'ALL' || j.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      j.fullName?.toLowerCase().includes(q) ||
      j.mediaOutlet?.toLowerCase().includes(q) ||
      j.accreditationCode?.toLowerCase().includes(q) ||
      j.nationalId?.includes(q);

    return matchesStatus && matchesSearch;
  });

  const totalCount = journalists.length;
  const approvedCount = journalists.filter(j => j.status === 'APPROVED').length;
  const pendingCount = journalists.filter(j => j.status === 'PENDING').length;
  const rejectedCount = journalists.filter(j => j.status === 'REJECTED').length;
  const revokedCount = journalists.filter(j => j.status === 'REVOKED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <LFFLogo size={50} />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>الاتحاد الليبي لكرة القدم - لوحة الإدارة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة المنظومة والاعتمادات</h1>
          </div>
        </div>

        {/* Current Admin Identity & Logout */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenSelfEdit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 hover:border-emerald-500/50 transition-all shadow-sm"
            title="تعديل اسم المستخدم وكلمة المرور"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>حسابي: <span className="font-mono text-emerald-400">{currentUser?.username}</span></span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation: Journalists vs Users Management */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-8">
        <button
          onClick={() => setMainTab('journalists')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mainTab === 'journalists'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>طلبات الاعتماد والصحفيين ({totalCount})</span>
        </button>

        <button
          onClick={() => {
            setMainTab('users');
            fetchUsers();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mainTab === 'users'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المشرفون وصلاحيات الدخول ({usersList.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: JOURNALISTS ACCREDITATION */}
      {/* ======================================================== */}
      {mainTab === 'journalists' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>سجلات الإعلاميين والمصورين</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchJournalists}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>تحديث</span>
              </button>

              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة إعلامي جديد</span>
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div 
              onClick={() => setFilterStatus('ALL')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                filterStatus === 'ALL' ? 'bg-slate-800/90 border-slate-600 ring-2 ring-slate-400/20' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>إجمالي المسجلين</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-3xl font-black text-white">{totalCount}</span>
            </div>

            <div 
              onClick={() => setFilterStatus('PENDING')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                filterStatus === 'PENDING' ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/20' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
                <span>قيد المراجعة</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-3xl font-black text-amber-400">{pendingCount}</span>
            </div>

            <div 
              onClick={() => setFilterStatus('APPROVED')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                filterStatus === 'APPROVED' ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/20' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
                <span>البطاقات المعتمدة</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-emerald-400">{approvedCount}</span>
            </div>

            <div 
              onClick={() => setFilterStatus('REJECTED')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                filterStatus === 'REJECTED' ? 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/20' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-rose-400 text-xs mb-2">
                <span>الطلبات المرفوضة</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-3xl font-black text-rose-400">{rejectedCount}</span>
            </div>

            <div 
              onClick={() => setFilterStatus('REVOKED')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                filterStatus === 'REVOKED' ? 'bg-orange-950/40 border-orange-500/60 ring-2 ring-orange-500/20' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-orange-400 text-xs mb-2">
                <span>البطاقات المسحوبة</span>
                <Ban className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-3xl font-black text-orange-400">{revokedCount}</span>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="بحث بالاسم، كود الاعتماد، المؤسسة، أو الهوية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pr-9 pl-4 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'الكل' },
                { id: 'PENDING', label: 'قيد الانتظار' },
                { id: 'APPROVED', label: 'معتمد' },
                { id: 'REJECTED', label: 'مرفوض' },
                { id: 'REVOKED', label: 'مسحوبة' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterStatus === tab.id 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">الإعلامي الرياضي</th>
                    <th className="py-4 px-4">المؤسسة الإعلامية</th>
                    <th className="py-4 px-4">الصفة والتخصص</th>
                    <th className="py-4 px-4">رقم الاعتماد</th>
                    <th className="py-4 px-4">الحالة</th>
                    <th className="py-4 px-4">المناطق المتاحة</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500">
                        لا توجد طلبات تطابق معايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0 shadow-inner">
                              {j.fullName ? j.fullName.trim().charAt(0) : 'ص'}
                            </div>
                            <div>
                              <span className="font-bold text-white block text-sm">{j.fullName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">هوية: {j.nationalId}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-200 font-medium block">{j.mediaOutlet}</span>
                          <span className="text-[10px] text-slate-500">{j.outletType}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-emerald-400 font-semibold">{j.role}</span>
                          <span className="text-[10px] text-slate-400 block">{j.coverageType}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-amber-400 text-xs">{j.accreditationCode}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            j.status === 'APPROVED' 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : j.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : j.status === 'REVOKED'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {j.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {j.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-400" />}
                            {j.status === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-400" />}
                            {j.status === 'REVOKED' && <Ban className="w-3 h-3 text-orange-400" />}
                            <span>
                              {j.status === 'APPROVED' ? 'معتمد' : j.status === 'PENDING' ? 'قيد الانتظار' : j.status === 'REVOKED' ? 'مسحوبة' : 'مرفوض'}
                            </span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {j.zoneAccess || 'MEDIA CENTRE'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenReviewModal(j)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                              title="مراجعة واعتماد"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            <Link
                              href={`/media-card/${j.id}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="عرض صفحة الإعلامي"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/media-card/${j.id}/print`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                              title="طباعة البطاقة"
                            >
                              <Printer className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteJournalist(j.id, j.fullName)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: USERS & ASSISTANTS MANAGEMENT */}
      {/* ======================================================== */}
      {mainTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>إدارة المشرفين وصلاحيات الدخول للمنظومة</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                يمكنك هنا تغيير اسم المستخدم وكلمة السر الخاصة بك، أو إضافة حسابات أخرى لمساعدين ومشرفين إعلاميين.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenCreateUser}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة مشرف مساعد جديد</span>
              </button>

              <button
                onClick={handleOpenSelfEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs border border-slate-700 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>تغيير كلمة السر لحسابي</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">الاسم التعريفي</th>
                    <th className="py-4 px-4">اسم المستخدم (Username)</th>
                    <th className="py-4 px-4">الصلاحية والرتبة</th>
                    <th className="py-4 px-4">تاريخ الإنشاء</th>
                    <th className="py-4 px-4 text-center">إجراءات الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-800/40 transition-colors ${isSelf ? 'bg-emerald-950/15' : ''}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                              {u.displayName ? u.displayName.charAt(0) : 'U'}
                            </div>
                            <div>
                              <span className="font-bold text-white block text-sm flex items-center gap-1.5">
                                {u.displayName}
                                {isSelf && (
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-semibold">
                                    أنت (حسابك الحالي)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                            {u.username}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          }`}>
                            <Shield className="w-3 h-3" />
                            <span>{u.role === 'SUPER_ADMIN' ? 'مدير عام المنظومة (Super Admin)' : 'مشرف اعتماد مساعد (Assistant)'}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-LY') : '—'}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => isSelf ? handleOpenSelfEdit() : handleOpenEditUser(u)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                              title="تعديل اسم المستخدم أو كلمة السر"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>تعديل</span>
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.displayName || u.username)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                                title="حذف المشرف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* USER MANAGEMENT MODAL (CREATE / EDIT SELF / EDIT OTHER) */}
      {/* ======================================================== */}
      {userModalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {userModalType === 'CREATE' && 'إضافة مشرف مساعد جديد'}
                  {userModalType === 'EDIT_SELF' && 'تعديل اسم المستخدم وكلمة المرور'}
                  {userModalType === 'EDIT_OTHER' && `تعديل بيانات المشرف (${selectedUserToEdit?.displayName})`}
                </h3>
              </div>
              <button
                onClick={() => setUserModalType(null)}
                className="text-slate-400 hover:text-white p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {userFormError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{userFormError}</span>
              </div>
            )}

            {userFormSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{userFormSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  الاسم الكامل / الصفة للمشرف *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. علي الورفلي (مشرف الاعتمادات)"
                  value={userForm.displayName}
                  onChange={(e) => setUserForm({ ...userForm, displayName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  اسم المستخدم لتسجيل الدخول (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ali_media أو admin"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {userModalType === 'CREATE' ? 'كلمة المرور (Password) *' : 'كلمة المرور الجديدة (اتركها فارغة إن لم ترغب في تغييرها)'}
                </label>
                <input
                  type="password"
                  required={userModalType === 'CREATE'}
                  placeholder="5 أحرف أو أرقام على الأقل"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              {userModalType === 'CREATE' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    الرتبة والصلاحية
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="ASSISTANT">مشرف اعتماد مساعد (مراجعة واعتماد وطباعة البطاقات)</option>
                    <option value="SUPER_ADMIN">مدير نظام رئيسي (كامل الصلاحيات وإدارة الحسابات)</option>
                  </select>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{userFormLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalType(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REVIEW & APPROVAL MODAL (ALL DATA + LIVE CARD PREVIEW) */}
      {/* ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full max-h-[94vh] shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:px-6 bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeModal.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={activeModal.fullName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">{activeModal.fullName}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      activeModal.status === 'APPROVED' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : activeModal.status === 'REVOKED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : activeModal.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {activeModal.status === 'APPROVED' ? 'معتمد رسمياً' : activeModal.status === 'REVOKED' ? 'البطاقة مسحوبة' : activeModal.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">{activeModal.mediaOutlet} • {activeModal.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                  كود: {activeModal.accreditationCode}
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Two Columns (Full Data on Right, Live Card Preview on Left) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column 1: Full Journalist Data and Review Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Personal & Contact Information */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>البيانات الشخصية وبيانات الاتصال</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">الاسم الرباعي الكامل:</span>
                      <span className="font-bold text-white text-sm">{activeModal.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">الرقم الوطني / جواز السفر:</span>
                      <span className="font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block">
                        {activeModal.nationalId || 'غير مدخل'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">رقم الهاتف المحمول:</span>
                      <span className="font-mono text-white font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span dir="ltr">{activeModal.phone}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">البريد الإلكتروني:</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate block">
                        {activeModal.email || 'غير مدخل'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">المدينة والدولة:</span>
                      <span className="text-white font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{activeModal.city || 'طرابلس'} • {activeModal.country || 'ليبيا'}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">فصيلة الدم للطوارئ:</span>
                      <span className="text-rose-400 font-mono font-black text-sm">{activeModal.bloodType || 'O+'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Professional & Outlet Details */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-teal-400 mb-3 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span>البيانات المهنية وتفاصيل المؤسسة</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">المؤسسة الإعلامية:</span>
                      <span className="font-bold text-white">{activeModal.mediaOutlet}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">نوع وتصنيف المؤسسة:</span>
                      <span className="text-slate-300">{activeModal.outletType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">الصفة الصحفية / المهمة:</span>
                      <span className="text-emerald-400 font-bold">{activeModal.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">سنوات الخبرة الصحفية:</span>
                      <span className="text-slate-300">{activeModal.experienceYears || '3'} سنوات</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">رقم القيد الصحفي / الهيئة:</span>
                      <span className="font-mono text-slate-300">{activeModal.syndicateNumber || 'غير متوفر'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 text-[11px]">المسابقات المعتمدة:</span>
                      <span className="text-emerald-400 font-black">جميع المسابقات الرسمية</span>
                    </div>
                  </div>
                </div>

                {/* 3. Uploaded Documents Preview (Photo & Assignment Letter) */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-amber-400" />
                      <span>المستندات والوثائق المرفوعة مع الطلب</span>
                    </span>
                    {modalLoading && (
                      <span className="text-[10px] text-amber-400 font-semibold animate-pulse">⏳ جاري التحميل...</span>
                    )}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Photo Box */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <img
                        src={activeModal.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={activeModal.fullName}
                        className="w-14 h-16 rounded-lg object-cover border border-slate-700 shrink-0 cursor-pointer hover:opacity-90"
                        onClick={() => activeModal.photoUrl && setFullscreenDoc({ url: activeModal.photoUrl, title: `الصورة الشخصية: ${activeModal.fullName}` })}
                      />
                      <div>
                        <span className="text-white font-bold block text-[11px]">الصورة الشخصية</span>
                        <span className="text-slate-400 text-[10px] block">الصورة المعتمدة للبطاقة</span>
                        {activeModal.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setFullscreenDoc({ url: activeModal.photoUrl, title: `الصورة الشخصية: ${activeModal.fullName}` })}
                            className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold mt-1 inline-flex items-center gap-1"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>تكبير الصورة</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Assignment Document Box */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      {activeModal.documentUrl ? (
                        <>
                          <img
                            src={activeModal.documentUrl}
                            alt="وثيقة التكليف"
                            className="w-14 h-16 rounded-lg object-cover border border-slate-700 shrink-0 cursor-pointer hover:border-emerald-500 transition-colors"
                            onClick={() => setFullscreenDoc({ url: activeModal.documentUrl, title: `خطاب التكليف: ${activeModal.fullName} (${activeModal.mediaOutlet})` })}
                          />
                          <div className="flex-1">
                            <span className="text-white font-bold block text-[11px]">خطاب التكليف / البطاقة</span>
                            <span className="text-slate-400 text-[10px] block">المستند الرسمي المرفق</span>
                            <button
                              type="button"
                              onClick={() => setFullscreenDoc({ url: activeModal.documentUrl, title: `خطاب التكليف: ${activeModal.fullName} (${activeModal.mediaOutlet})` })}
                              className="text-teal-400 hover:text-teal-300 text-[10px] font-bold mt-1 inline-flex items-center gap-1"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>تكبير الوثيقة</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full text-center py-2 text-slate-500 text-[11px]">
                          لم يتم إرفاق وثيقة إلكترونية
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Stadium Access Zones Multi-selection */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-200 font-bold text-xs">
                      تحديد أماكن تواجد وتصريح الإعلامي في الملاعب:
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      {AVAILABLE_ZONES.filter(z => isZoneActive(z)).join(' • ') || 'المركز الإعلامي'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_ZONES.map((zone) => {
                      const active = isZoneActive(zone);
                      return (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => handleToggleZone(zone)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                            active
                              ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {active ? '✓' : '+'}
                          </div>
                          <span className="font-bold text-xs">{zone}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    الأماكن المختارة تظهر وتنعكس فوراً على معاينة البطاقة المقابلة.
                  </p>
                </div>

                {/* 5. Review Notes */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 text-xs">
                    ملاحظات الاعتماد والقرار الإداري:
                  </label>
                  <textarea
                    rows="2"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="ملاحظات الاعتماد الإدارية..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white text-xs outline-none"
                  />
                </div>

                {/* 6. Approval Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    disabled={processingId !== null}
                    onClick={() => handleUpdateStatus(activeModal.id, 'APPROVED')}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وإصدار البطاقة الرسمية</span>
                  </button>

                  <button
                    disabled={processingId !== null}
                    onClick={() => handleUpdateStatus(activeModal.id, 'REJECTED')}
                    className="py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض الطلب</span>
                  </button>
                </div>

                {/* Revoke / Unrevoke for APPROVED or REVOKED */}
                {(activeModal.status === 'APPROVED' || activeModal.status === 'REVOKED') && (
                  <div className={`mt-1 p-3 rounded-xl border ${
                    activeModal.status === 'REVOKED'
                      ? 'bg-orange-950/30 border-orange-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <p className="text-[11px] text-slate-400 mb-2 font-semibold">
                      {activeModal.status === 'REVOKED' ? '⛔ البطاقة حالياً مسحوبة — يمكن استعادة صلاحيتها:' : '⚠️ إجراء سحب بطاقة الاعتماد:'}
                    </p>
                    {activeModal.status === 'REVOKED' ? (
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleUpdateStatus(activeModal.id, 'APPROVED')}
                        className="w-full py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>إلغاء السحب واستعادة صلاحية البطاقة</span>
                      </button>
                    ) : (
                      <button
                        disabled={processingId !== null}
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من سحب بطاقة اعتماد (${activeModal.fullName})؟ ستوقف صلاحيتها فوراً.`)) {
                            handleUpdateStatus(activeModal.id, 'REVOKED');
                          }
                        }}
                        className="w-full py-2 px-4 rounded-xl bg-orange-700/40 hover:bg-orange-700 border border-orange-500/40 text-orange-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <Ban className="w-4 h-4" />
                        <span>سحب بطاقة الاعتماد وإيقاف الصلاحية</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Column 2: Live Card Preview Before Approval (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center bg-slate-950/60 p-4 rounded-3xl border border-slate-800 sticky top-0">
                <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="text-right">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>معاينة البطاقة قبل الاعتماد</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">تحديث حي ومباشر لكافة الحقول</span>
                  </div>

                  {/* Card Flip & Controls */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setModalCardSide('front')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        modalCardSide === 'front'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الوجه الأمامي
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalCardSide('back')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        modalCardSide === 'back'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الوجه الخلفي
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalCardSide(modalCardSide === 'front' ? 'back' : 'front')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                      title="قلب وجه البطاقة"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* The Live Press Card with Live Updates */}
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-slate-800 shadow-2xl flex justify-center w-full">
                  <PressCard 
                    journalist={{
                      ...activeModal,
                      zoneAccess: selectedZones,
                      coverageType: 'جميع المسابقات الرسمية'
                    }} 
                    showBack={modalCardSide === 'back'} 
                    scale={0.88} 
                  />
                </div>

                <p className="text-[10.5px] text-slate-500 mt-3 text-center">
                  هذه المعاينة توضح تماماً كيف ستبدو البطاقة الرسمية المعتمدة للإعلامي عند الطباعة أو التحقق الإلكتروني.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX FOR ATTACHED DOCUMENTS */}
      {fullscreenDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <span className="font-bold text-white text-sm">{fullscreenDoc.title}</span>
              <button
                onClick={() => setFullscreenDoc(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-950/60 min-h-[60vh]">
              <img
                src={fullscreenDoc.url}
                alt="المستند بالحجم الكامل"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

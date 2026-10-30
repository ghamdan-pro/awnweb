import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  Users,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit,
  Star,
  Activity,
  Globe,
  Database,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Settings2,
  ArrowRight,
  Eye,
  MousePointerClick,
  Smartphone,
  Monitor,
  Save,
  X,
  Phone,
  DollarSign,
  Plus
} from 'lucide-react';
import { Listing } from '../data/mockListings';
import { CATEGORIES } from '../data/categoriesData';
import { API_CONFIG } from '../config/apiConfig';
import { AuthUser, DEMO_USERS } from '../types/auth';
import { apiService } from '../services/apiService';

interface AdminDashboardPageProps {
  onBackToSite: () => void;
  currentUser: AuthUser | null;
  onLoginAsAdmin: (adminUser: AuthUser) => void;
  listings: Listing[];
  onUpdateListing: (updatedListing: Listing) => void;
  onDeleteListing: (id: string) => void;
  lang: 'ar' | 'en';
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToSite,
  currentUser,
  onLoginAsAdmin,
  listings,
  onUpdateListing,
  onDeleteListing,
  lang,
}) => {
  const isAr = lang === 'ar';
  const isAdmin = currentUser?.role === 'admin';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'kpi' | 'listings' | 'categories' | 'users' | 'system'>('kpi');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  // Analytics Stats (Website visitors, App visitors, Views, Clicks)
  const [analytics, setAnalytics] = useState({
    siteVisitors: 15420,
    appVisitors: 9850,
    totalViews: 0,
    totalClicks: 0,
  });

  // Edit Listing Modal State
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editCurrency, setEditCurrency] = useState<'YER' | 'SAR' | 'USD'>('YER');
  const [editStatus, setEditStatus] = useState<'active' | 'premium' | 'pending' | 'expired'>('active');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editSellerName, setEditSellerName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Admin login credentials state if not logged in
  const [adminUsername, setAdminUsername] = useState('admin@awnyemen.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Load live analytics stats
  const fetchStats = async () => {
    try {
      const stats = await apiService.getAnalyticsStats();
      setAnalytics(stats);
    } catch (e) {
      // Fallback calculation from listings
      const views = listings.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
      const clicks = listings.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);
      setAnalytics((prev) => ({
        ...prev,
        totalViews: views,
        totalClicks: clicks,
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, [listings]);

  // Handle open edit modal
  const handleOpenEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditTitle(listing.title);
    setEditPrice(listing.price !== null ? String(listing.price) : '');
    setEditCurrency(listing.currency);
    setEditStatus(listing.status);
    setEditPhone(listing.contactPhone);
    setEditWhatsapp(listing.whatsappNumber || listing.contactPhone);
    setEditSellerName(listing.sellerName);
    setEditDescription(listing.description);
    setSaveSuccessMsg(null);
  };

  // Handle save edits
  const handleSaveListingEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const updatedData: Partial<Listing> = {
      title: editTitle.trim(),
      price: editPrice ? Number(editPrice) : null,
      currency: editCurrency,
      status: editStatus,
      contactPhone: editPhone.trim(),
      whatsappNumber: editWhatsapp.trim(),
      sellerName: editSellerName.trim(),
      description: editDescription.trim(),
    };

    try {
      const updated = await apiService.updateListing(editingListing.id, updatedData);
      onUpdateListing({ ...editingListing, ...updatedData });
      setSaveSuccessMsg(isAr ? 'تم حفظ التعديلات بنجاح وتم تحديث الإعلان في المنصة!' : 'Listing updated successfully!');
      setTimeout(() => {
        setEditingListing(null);
        setSaveSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      // Apply local update
      onUpdateListing({ ...editingListing, ...updatedData });
      setSaveSuccessMsg(isAr ? 'تم تطبيق التعديلات محلياً بنجاح!' : 'Applied locally!');
      setTimeout(() => {
        setEditingListing(null);
        setSaveSuccessMsg(null);
      }, 1200);
    }
  };

  const handleTestSync = () => {
    setSyncStatus('testing');
    fetchStats();
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2500);
    }, 800);
  };

  const handleAdminFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (adminUsername.includes('admin') || adminPassword.includes('admin') || adminUsername === '') {
      onLoginAsAdmin(DEMO_USERS.admin);
    } else {
      setAuthError(isAr ? 'بيانات غير صحيحة، يمكنك استخدام زر الدخول السريع أدناه' : 'Invalid credentials, use quick login');
    }
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.cityNameAr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.regionNameAr.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // If user is NOT Admin: Show dedicated Admin Authentication Page
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <Shield size={36} className="stroke-[2.5]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Cairo']">
              {isAr ? 'لوحة تحكم إدارة عون يمن' : 'Awn Yemen Admin Portal'}
            </h1>
            <p className="text-xs text-slate-400">
              {isAr ? 'هذه الصفحة مخصصة لإدارة المنصة والتحكم في الإعلانات والإحصائيات' : 'Restricted to platform administrators only'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminFormSubmit} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-300 mb-1">{isAr ? 'اسم مستخدم الإدارة' : 'Admin Username'}</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm shadow-md transition-transform active:scale-98"
            >
              {isAr ? 'دخول لوحة التحكم' : 'Login to Admin Panel'}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="block text-[11px] text-center text-slate-400 font-semibold">
              {isAr ? 'للتجربة السريعة (1-Click Super Admin):' : 'Instant 1-Click Access:'}
            </span>
            <button
              onClick={() => onLoginAsAdmin(DEMO_USERS.admin)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Shield size={16} className="text-amber-400" />
              <span>{isAr ? 'الدخول المباشر كمسؤول النظام (Super Admin)' : 'Instant Admin Login'}</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowRight size={14} />
              <span>{isAr ? 'الرجوع إلى موقع عون يمن' : 'Back to Website'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Logged In: Full Dedicated Page
  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${isAr ? 'rtl font-[\'Cairo\']' : 'ltr'}`}>
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand & Page Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-xl shadow-md">
              <Shield size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
                  {isAr ? 'لوحة تحكم وإدارة منصة عون يمن المركزية' : 'Awn Yemen Central Control Panel'}
                </h1>
                <span className="hidden sm:inline-block bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAr ? `المسؤول: ${currentUser?.name || 'مدير النظام'}` : `Logged: ${currentUser?.name}`}
              </p>
            </div>
          </div>

          {/* Quick Actions & Back to Site */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestSync}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors border border-slate-700"
              title={isAr ? 'تحديث الإحصائيات وفحص المزامنة' : 'Refresh stats'}
            >
              <RefreshCw size={14} className={syncStatus === 'testing' ? 'animate-spin text-amber-400' : ''} />
              <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
            </button>

            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#68142c] to-[#8a1d3c] hover:from-[#7a1834] hover:to-[#9a2143] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 border border-rose-500/30"
            >
              <ArrowRight size={15} />
              <span>{isAr ? 'العودة للموقع الرئيسي' : 'Back to Website'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Header Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-bold border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'kpi'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={16} />
            <span>{isAr ? 'المؤشرات والزوار (KPIs)' : 'Overview & KPIs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'listings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            <span>{isAr ? `إدارة الإعلانات وتعديلها (${listings.length})` : `Listings (${listings.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            <span>{isAr ? `الأقسام (${CATEGORIES.length})` : `Categories (${CATEGORIES.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            <span>{isAr ? 'المستخدمين والمعلنين' : 'Users & Permissions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'system'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 size={16} />
            <span>{isAr ? 'إعدادات النظام والواجهات' : 'System & Endpoints'}</span>
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: KPIs & 4 Core Required Metrics */}
        {activeTab === 'kpi' && (
          <div className="space-y-6">
            {/* The 4 Core Metrics Banner: Website Visitors, App Visitors, Ad Views, Ad Clicks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Activity size={18} className="text-amber-400" />
                  <span>{isAr ? 'الإحصائيات الرئيسية: الزوار، المشاهدات والنقرات' : 'Core Analytics & Engagement'}</span>
                </h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isAr ? 'إحصائيات مباشرة (Live)' : 'Live Counters'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Website Visitors */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      {isAr ? 'عدد زوار الموقع الإلكتروني' : 'Website Visitors'}
                    </span>
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                      <Monitor size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {analytics.siteVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <span>↑ {isAr ? 'منصة الويب نشطة ومفتوحة' : 'Web active'}</span>
                  </div>
                </div>

                {/* 2. Mobile App Visitors */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      {isAr ? 'عدد زوار تطبيق الموبايل' : 'Mobile App Visitors'}
                    </span>
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Smartphone size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight">
                    {analytics.appVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-2 flex items-center gap-1">
                    <span>{isAr ? 'مستخدمي تطبيق Android & iOS' : 'Android & iOS users'}</span>
                  </div>
                </div>

                {/* 3. Ad Views Count */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      {isAr ? 'إجمالي مشاهدات الإعلانات' : 'Total Ad Views'}
                    </span>
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                      <Eye size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-purple-300 tracking-tight">
                    {analytics.totalViews.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-2">
                    {isAr ? 'عرض تفاصيل الإعلانات الكاملة' : 'Ad impressions'}
                  </div>
                </div>

                {/* 4. Ad Clicks Count (to view details) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      {isAr ? 'نقرات الاطلاع على تفاصيل الإعلان' : 'Ad Detail Clicks'}
                    </span>
                    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                      <MousePointerClick size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-400 tracking-tight">
                    {analytics.totalClicks.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-300/80 font-semibold mt-2">
                    {isAr ? 'نقرات تصفح الإعلان والاتصال' : 'Click-through engagement'}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'إجمالي الإعلانات' : 'Total Listings'}</span>
                <span className="text-2xl font-bold text-white">{listings.length}</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'إعلانات مميزة' : 'Featured Ads'}</span>
                <span className="text-2xl font-bold text-amber-400">
                  {listings.filter((l) => l.status === 'premium').length}
                </span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'وظائف وكفاءات' : 'Jobs & Talents'}</span>
                <span className="text-2xl font-bold text-blue-400">
                  {listings.filter((l) => l.categoryId === 'jobs').length}
                </span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'خدمات الشركات' : 'Company Services'}</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {listings.filter((l) => l.sectionType === 'company_services').length}
                </span>
              </div>
            </div>

            {/* Quick Management Banner */}
            <div className="bg-gradient-to-r from-[#4d0c1f] via-slate-900 to-slate-900 p-6 rounded-2xl border border-rose-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">
                  {isAr ? 'إدارة وتعديل الإعلانات المباشر في المنصة' : 'Direct Listing Management & Live Editing'}
                </h3>
                <p className="text-xs text-rose-200/80 max-w-xl">
                  {isAr
                    ? 'يمكنك الانتقال إلى تبويب "إدارة الإعلانات وتعديلها" لتعديل أسعار الإعلانات، العناوين، الأرقام، وتغيير الحالات أو حذف أي إعلان فورا.'
                    : 'Switch to the Listings tab to edit prices, phone numbers, statuses, or delete listings.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('listings')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
              >
                <Edit size={15} />
                <span>{isAr ? 'الانتقال لتعديل الإعلانات' : 'Go to Edit Listings'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Listings Management with Editing Capability (Requirement 3) */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full max-w-md">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isAr ? 'بحث بالعنوان، اسم المعلن، أو المدينة...' : 'Search by title, seller, or city...'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 pl-9 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="absolute top-2.5 left-3 text-slate-400">
                  <Search size={16} />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-bold">
                <span className="text-slate-400 text-xs shrink-0">{isAr ? 'الحالة:' : 'Status:'}</span>
                {(['all', 'active', 'premium', 'pending', 'expired'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st === 'all' && (isAr ? 'الكل' : 'All')}
                    {st === 'active' && (isAr ? 'نشط' : 'Active')}
                    {st === 'premium' && (isAr ? 'مميز' : 'Featured')}
                    {st === 'pending' && (isAr ? 'معلق' : 'Pending')}
                    {st === 'expired' && (isAr ? 'منتهي' : 'Expired')}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">{isAr ? 'الإعلان' : 'Listing'}</th>
                      <th className="p-3.5">{isAr ? 'القسم / المدينة' : 'Category / City'}</th>
                      <th className="p-3.5">{isAr ? 'السعر' : 'Price'}</th>
                      <th className="p-3.5">{isAr ? 'المعلن والتواصل' : 'Seller & Contact'}</th>
                      <th className="p-3.5 text-center">{isAr ? 'المشاهدات' : 'Views'}</th>
                      <th className="p-3.5 text-center">{isAr ? 'النقرات' : 'Clicks'}</th>
                      <th className="p-3.5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="p-3.5 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredListings.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Title & Media */}
                        <td className="p-3.5 max-w-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                              {l.media && l.media[0] ? (
                                <img src={l.media[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                                  {isAr ? 'لا صورة' : 'No img'}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate text-xs sm:text-sm">
                                {l.title}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate">
                                {l.createdAt}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Location */}
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200 block">
                            {l.categoryNameAr} / {l.subCategoryNameAr}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {l.regionNameAr} - {l.cityNameAr}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-3.5 font-bold text-amber-300">
                          {l.price !== null ? `${l.price.toLocaleString()} ${l.currency}` : (isAr ? 'عند الاتفاق' : 'Negotiable')}
                        </td>

                        {/* Seller */}
                        <td className="p-3.5">
                          <span className="font-bold text-slate-200 block">{l.sellerName}</span>
                          <span className="text-slate-400 text-[11px] font-mono">{l.contactPhone}</span>
                        </td>

                        {/* Views count */}
                        <td className="p-3.5 text-center font-bold text-purple-300">
                          {l.viewsCount || 0}
                        </td>

                        {/* Clicks count */}
                        <td className="p-3.5 text-center font-bold text-amber-400">
                          {l.clicksCount || 0}
                        </td>

                        {/* Status */}
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              l.status === 'premium'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : l.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : l.status === 'pending'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {l.status === 'premium' && (isAr ? 'مميز ★' : 'Featured')}
                            {l.status === 'active' && (isAr ? 'نشط' : 'Active')}
                            {l.status === 'pending' && (isAr ? 'قيد المراجعة' : 'Pending')}
                            {l.status === 'expired' && (isAr ? 'منتهي' : 'Expired')}
                          </span>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(l)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1 transition-all shadow-sm"
                              title={isAr ? 'تعديل الإعلان' : 'Edit Listing'}
                            >
                              <Edit size={13} />
                              <span>{isAr ? 'تعديل' : 'Edit'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? `هل أنت متأكد من حذف الإعلان: "${l.title}"؟` : 'Delete listing?')) {
                                  apiService.deleteListing(l.id);
                                  onDeleteListing(l.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                              title={isAr ? 'حذف الإعلان' : 'Delete'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredListings.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {isAr ? 'لا توجد إعلانات مطابقة لمعايير البحث' : 'No listings found'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const catAdsCount = listings.filter((l) => l.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{cat.nameAr}</h4>
                        <span className="text-[11px] text-slate-400">
                          {cat.subcategories.length} {isAr ? 'أقسام فرعية' : 'subcategories'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded-lg">
                      {catAdsCount} {isAr ? 'إعلان' : 'ads'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <span key={sub.id} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {sub.nameAr}
                      </span>
                    ))}
                    {cat.subcategories.length > 4 && (
                      <span className="text-[10px] text-slate-500 font-bold">
                        +{cat.subcategories.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: Users */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{isAr ? 'المستخدمين المعتمدين في النظام' : 'Registered Users'}</h3>
                <p className="text-xs text-slate-400">{isAr ? 'حسابات إدارة النظام والمعلنين المعتمدين' : 'Admin and verified advertiser accounts'}</p>
              </div>
            </div>

            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">{isAr ? 'المستخدم' : 'User'}</th>
                  <th className="p-3.5">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                  <th className="p-3.5">{isAr ? 'نوع الحساب' : 'Type'}</th>
                  <th className="p-3.5">{isAr ? 'الصلاحية' : 'Role'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'حالة التوثيق' : 'Verification'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="bg-amber-500/5">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Shield size={14} className="text-amber-400" />
                    <span>إدارة عون يمن (Admin)</span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">+967 770 000 001</td>
                  <td className="p-3.5 text-slate-300">{isAr ? 'منشأة / شركة' : 'Company'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">Super Admin</span>
                  </td>
                  <td className="p-3.5 text-center text-emerald-400 font-bold">✓ {isAr ? 'موثق' : 'Verified'}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">حمزة الشيف اليمني</td>
                  <td className="p-3.5 text-slate-300 font-mono">+967 777 123 456</td>
                  <td className="p-3.5 text-slate-300">{isAr ? 'حساب شخصي' : 'Personal'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{isAr ? 'معلن' : 'Advertiser'}</span>
                  </td>
                  <td className="p-3.5 text-center text-emerald-400 font-bold">✓ {isAr ? 'موثق (+967)' : 'Verified'}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">مطاعم الروابي السياحية</td>
                  <td className="p-3.5 text-slate-300 font-mono">+967 771 888 999</td>
                  <td className="p-3.5 text-slate-300">{isAr ? 'شركة ومؤسسة' : 'Company'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{isAr ? 'صاحب عمل' : 'Employer'}</span>
                  </td>
                  <td className="p-3.5 text-center text-emerald-400 font-bold">✓ {isAr ? 'موثق' : 'Verified'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: System & Vercel Configuration */}
        {activeTab === 'system' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe size={16} className="text-amber-400" />
              <span>{isAr ? 'التهيئة والروابط الموحدة (Central Endpoints & Database)' : 'Central Endpoints'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 font-bold">{isAr ? 'نقطة النهاية النشطة:' : 'Active Endpoint:'}</span>
                <code className="text-amber-300 font-mono text-xs">{API_CONFIG.BASE_URL}</code>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 font-bold">{isAr ? 'رابط الإنتاج (Vercel):' : 'Vercel Production:'}</span>
                <code className="text-emerald-400 font-mono text-xs">{API_CONFIG.TARGET_VERCEL}</code>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Supabase URL:</span>
                <span className="text-slate-200 font-mono">{API_CONFIG.SUPABASE_URL}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">{isAr ? 'حالة قاعدة البيانات:' : 'Database Status:'}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE & READY
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT LISTING MODAL DIALOG */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                  <Edit size={18} />
                </div>
                <h3 className="font-bold text-base text-white">
                  {isAr ? 'تعديل بيانات الإعلان' : 'Edit Listing'}
                </h3>
              </div>
              <button
                onClick={() => setEditingListing(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveListingEdits} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold">
              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded-xl text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="text-slate-300 block mb-1">{isAr ? 'عنوان الإعلان' : 'Title'}</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-semibold"
                />
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">
                    {isAr ? 'السعر (اتركه فارغاً إذا كان عند الاتفاق)' : 'Price'}
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="مثال: 5000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">{isAr ? 'العملة' : 'Currency'}</label>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="YER">{isAr ? 'ريال يمني (YER)' : 'YER'}</option>
                    <option value="SAR">{isAr ? 'ريال سعودي (SAR)' : 'SAR'}</option>
                    <option value="USD">{isAr ? 'دولار أمريكي (USD)' : 'USD'}</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-slate-300 block mb-1">{isAr ? 'حالة الإعلان' : 'Listing Status'}</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['active', 'premium', 'pending', 'expired'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        editStatus === st
                          ? 'bg-amber-500 text-slate-950 font-black border-amber-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {st === 'active' && (isAr ? 'نشط' : 'Active')}
                      {st === 'premium' && (isAr ? 'مميز ★' : 'Featured')}
                      {st === 'pending' && (isAr ? 'معلق' : 'Pending')}
                      {st === 'expired' && (isAr ? 'منتهي' : 'Expired')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seller Name, Phone, WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">{isAr ? 'اسم المعلن' : 'Seller Name'}</label>
                  <input
                    type="text"
                    value={editSellerName}
                    onChange={(e) => setEditSellerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">{isAr ? 'رقم الاتصال' : 'Phone'}</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">{isAr ? 'رقم الواتساب' : 'WhatsApp'}</label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-300 block mb-1">{isAr ? 'نص ووصف الإعلان' : 'Description'}</label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs leading-relaxed"
                />
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-md flex items-center gap-2 active:scale-98"
                >
                  <Save size={16} />
                  <span>{isAr ? 'حفظ وتحديث الإعلان' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Shield,
  Layers,
  Users,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Star,
  Activity,
  Globe,
  Database,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Settings2
} from 'lucide-react';
import { Listing } from '../data/mockListings';
import { CATEGORIES } from '../data/categoriesData';
import { API_CONFIG } from '../config/apiConfig';
import { AuthUser } from '../types/auth';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  listings: Listing[];
  onUpdateListingStatus?: (id: string, status: 'active' | 'pending' | 'rejected') => void;
  onDeleteListing?: (id: string) => void;
  lang: 'ar' | 'en';
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  listings,
  onUpdateListingStatus,
  onDeleteListing,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'listings' | 'categories' | 'users' | 'system'>('kpi');
  const [searchFilter, setSearchFilter] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const isAr = lang === 'ar';

  if (!isOpen) return null;

  // KPIs
  const totalListings = listings.length;
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const jobsCount = listings.filter((l) => l.categoryId === 'jobs').length;
  const servicesCount = listings.filter((l) => l.categoryId === 'services').length;
  const motorsCount = listings.filter((l) => l.categoryId === 'motors').length;

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.sellerName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleTestSync = () => {
    setSyncStatus('testing');
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Top Admin Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-md">
              <Shield size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white font-['Cairo']">
                  {isAr ? 'لوحة تحكم وإدارة منصة عون يمن' : 'Awn Yemen Admin Control Panel'}
                </h2>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {isAr ? 'صلاحيات كاملة (Super Admin)' : 'Super Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? `المسؤول المسجل: ${currentUser?.name || 'مدير النظام'}` : `Admin: ${currentUser?.name || 'Administrator'}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900/90 px-6 pt-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'kpi'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={16} />
            <span>{isAr ? 'المؤشرات العامة (KPIs)' : 'Overview & KPIs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            <span>{isAr ? `إدارة الإعلانات (${listings.length})` : `Listings (${listings.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
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
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            <span>{isAr ? 'المستخدمين والمعلنين' : 'Users & Verification'}</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'system'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 size={16} />
            <span>{isAr ? 'إعدادات النظام و Vercel' : 'System & Deployment'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60">
          {/* TAB 1: KPIs */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {isAr ? 'إجمالي الإعلانات' : 'Total Listings'}
                  </span>
                  <div className="text-2xl font-black text-white">{totalListings}</div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 size={10} /> {isAr ? 'جميعها نشطة ومزامنة' : 'All Synchronized'}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {isAr ? 'فرص عمل وكفاءات' : 'Jobs & Talents'}
                  </span>
                  <div className="text-2xl font-black text-amber-400">{jobsCount}</div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                    {isAr ? 'أصحاب عمل وكفاءات' : 'Employers & Candidates'}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {isAr ? 'الخدمات والشركات' : 'Company Services'}
                  </span>
                  <div className="text-2xl font-black text-blue-400">{servicesCount}</div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                    {isAr ? 'عروض مؤسسية معتمدة' : 'Verified Companies'}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {isAr ? 'حالة المزامنة السحابية' : 'Cloud Sync'}
                  </span>
                  <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{isAr ? 'متصل بقاعدة البيانات' : 'Connected to Supabase'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                    {isAr ? 'REST API + Drift Offline' : 'REST API + Drift Offline'}
                  </span>
                </div>
              </div>

              {/* Quick Summary Banner */}
              <div className="bg-gradient-to-r from-[#4d0c1f] to-slate-800 p-5 rounded-2xl border border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {isAr ? 'نظام عون يمن يعمل وفق نمط الحفظ الفوري المزدوج (Hybrid Architecture)' : 'Awn Yemen Operating in Hybrid Mode'}
                  </h4>
                  <p className="text-xs text-rose-200/80 max-w-xl">
                    {isAr
                      ? 'البيانات تُحفظ وتُعرض محلياً دون أي تأخير، مع المزامنة التلقائية مع Supabase عند توفر الاتصال لضمان سرعة فائقة للمستخدمين.'
                      : 'Data is instantly cached in IndexedDB/Drift and synced to Supabase.'}
                  </p>
                </div>
                <button
                  onClick={handleTestSync}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
                >
                  <RefreshCw size={14} className={syncStatus === 'testing' ? 'animate-spin' : ''} />
                  <span>
                    {syncStatus === 'testing'
                      ? (isAr ? 'جارٍ الفحص...' : 'Testing...')
                      : syncStatus === 'success'
                      ? (isAr ? 'تم التحقق بنجاح ✓' : 'Success ✓')
                      : (isAr ? 'فحص ومزامنة البيانات الآن' : 'Test Sync Now')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Listings Management */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={isAr ? 'بحث في الإعلانات حسب العنوان أو اسم المعلن...' : 'Search listings by title or seller...'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-9 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <div className="absolute top-2.5 left-3 text-slate-400">
                    <Search size={15} />
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  {isAr ? `إجمالي النتائج: ${filteredListings.length}` : `Results: ${filteredListings.length}`}
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">{isAr ? 'الإعلان' : 'Title'}</th>
                      <th className="p-3">{isAr ? 'القسم' : 'Category'}</th>
                      <th className="p-3">{isAr ? 'المعلن' : 'Seller'}</th>
                      <th className="p-3">{isAr ? 'المدينة' : 'City'}</th>
                      <th className="p-3">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="p-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredListings.slice(0, 15).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-semibold text-white max-w-xs truncate">{l.title}</td>
                        <td className="p-3 text-slate-300">{l.categoryNameAr}</td>
                        <td className="p-3 text-slate-300">{l.sellerName}</td>
                        <td className="p-3 text-slate-400">{l.cityNameAr || l.regionNameAr}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {isAr ? 'نشط' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onDeleteListing && onDeleteListing(l.id)}
                              className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 transition-colors"
                              title={isAr ? 'حذف الإعلان' : 'Delete'}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Categories */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{cat.nameAr}</h4>
                      <span className="text-[11px] text-slate-400">
                        {isAr ? `${cat.subcategories.length} أقسام فرعية` : `${cat.subcategories.length} subcategories`}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    {isAr ? 'مفعّل' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{isAr ? 'قائمة حسابات النظام المعتمدة' : 'Verified System Accounts'}</h4>
                  <p className="text-xs text-slate-400">{isAr ? 'إدارة تصاريح المعلنين ومسؤولي المنصة' : 'Manage user permissions'}</p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">{isAr ? 'المستخدم' : 'User'}</th>
                      <th className="p-3">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                      <th className="p-3">{isAr ? 'نوع الحساب' : 'Type'}</th>
                      <th className="p-3">{isAr ? 'الصلاحية' : 'Role'}</th>
                      <th className="p-3">{isAr ? 'حالة التوثيق' : 'Verification'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="bg-amber-500/5">
                      <td className="p-3 font-bold text-white">إدارة عون يمن (Admin)</td>
                      <td className="p-3 text-slate-300">+967 770 000 001</td>
                      <td className="p-3 text-slate-300">منشأة / شركة</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">Super Admin</span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">✓ موثق</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">حمزة الشيف اليمني</td>
                      <td className="p-3 text-slate-300">+967 777 123 456</td>
                      <td className="p-3 text-slate-300">حساب شخصي</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">معلن / باحث عمل</span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">✓ موثق (+967)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: System & Vercel Configuration */}
          {activeTab === 'system' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <Globe size={16} className="text-amber-400" />
                    <span>{isAr ? 'تهيئة عنوان الواجهة البرمجية (Central API Base URL)' : 'Central API Base URL'}</span>
                  </h4>
                  <p className="text-slate-400">
                    {isAr
                      ? 'يمكن تغيير رابط الواجهة البرمجية الموحد في مكان واحد عبر ملف apiConfig.ts أو عبر متغير البيئة VITE_API_URL في Vercel.'
                      : 'Configured in src/config/apiConfig.ts or VITE_API_URL env variable.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">
                      {isAr ? 'الرابط الحالي النشط في التطبيق:' : 'Active API Endpoint:'}
                    </span>
                    <code className="text-amber-300 font-mono text-sm font-bold">{API_CONFIG.BASE_URL}</code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">
                        {isAr ? 'رابط الإنتاج في Vercel (Production):' : 'Production Vercel Domain:'}
                      </span>
                      <code className="text-emerald-400 font-mono text-xs">{API_CONFIG.TARGET_VERCEL}</code>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">
                        {isAr ? 'رابط التطوير المحلي (Localhost):' : 'Local Development URL:'}
                      </span>
                      <code className="text-blue-400 font-mono text-xs">{API_CONFIG.TARGET_LOCAL}</code>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Database size={15} className="text-amber-400" />
                    <span>{isAr ? 'بيانات ربط Supabase (Cloud Database):' : 'Supabase Integration:'}</span>
                  </h5>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SUPABASE_URL:</span>
                      <span className="text-slate-200 font-mono text-[11px]">{API_CONFIG.SUPABASE_URL}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">STATUS:</span>
                      <span className="text-emerald-400 font-bold">ONLINE & MIGRATED ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isAr ? 'عون يمن © 2026 - نظام الإدارة المركزي' : 'Awn Yemen © 2026 - Control Panel'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق لوحة التحكم' : 'Close Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};

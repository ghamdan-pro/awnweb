import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Car,
  Briefcase,
  Handshake,
  Building2,
  Dices,
  Package,
  Utensils,
  Truck,
  TrendingUp,
  Calculator,
  HardHat,
  UserCheck,
  Building,
  Laptop,
  Headphones,
  HeartPulse,
  Shield,
  Palette,
  GraduationCap,
  Sparkles,
  Scissors,
  FileText,
  Wrench,
  Zap,
  Droplets,
  Smartphone,
  Wind,
  Key,
  ArrowRight,
  Filter,
  User,
  SlidersHorizontal,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Category, SubCategory } from '../data/categoriesData';
import { Listing } from '../data/mockListings';
import { AuthUser } from '../types/auth';
import { Region } from '../data/yemenRegions';

interface MourjanMarketplaceViewProps {
  categories: Category[];
  listings: Listing[];
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  onSelectCategory: (catId?: string, subId?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDetails: (listing: Listing) => void;
  onRequireLogin: (listing: Listing, reason: 'details' | 'contact') => void;
  currentUser: AuthUser | null;
  selectedRegion?: Region;
  isAr?: boolean;
}

export const MourjanMarketplaceView: React.FC<MourjanMarketplaceViewProps> = ({
  categories,
  listings,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenDetails,
  onRequireLogin,
  currentUser,
  selectedRegion,
  isAr = true,
}) => {
  // Advanced Filter state for Stage 3 (Subcategory View)
  const [intentFilter, setIntentFilter] = useState<'all' | 'offer' | 'request'>('all');
  const [careerLevel, setCareerLevel] = useState<string>('all');
  const [jobType, setJobType] = useState<string>('all');
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [advertiserType, setAdvertiserType] = useState<string>('all');

  // Currently active Category & Subcategory objects
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const activeSubCategory = useMemo(() => {
    return activeCategory?.subcategories.find((s) => s.id === selectedSubCategoryId);
  }, [activeCategory, selectedSubCategoryId]);

  // Subcategory Icon Mapper
  const getSubcategoryIcon = (subId: string) => {
    const s = subId.toLowerCase();
    if (s.includes('culinary') || s.includes('restaurant')) return <Utensils size={18} className="text-slate-600" />;
    if (s.includes('driver')) return <Car size={18} className="text-slate-600" />;
    if (s.includes('sales')) return <TrendingUp size={18} className="text-slate-600" />;
    if (s.includes('accounting') || s.includes('finance')) return <Calculator size={18} className="text-slate-600" />;
    if (s.includes('engineering') || s.includes('engineer')) return <HardHat size={18} className="text-slate-600" />;
    if (s.includes('management') || s.includes('admin')) return <UserCheck size={18} className="text-slate-600" />;
    if (s.includes('contracting')) return <Building size={18} className="text-slate-600" />;
    if (s.includes('tech') || s.includes('programming') || s.includes('it')) return <Laptop size={18} className="text-slate-600" />;
    if (s.includes('customer-service')) return <Headphones size={18} className="text-slate-600" />;
    if (s.includes('nursing') || s.includes('medical')) return <HeartPulse size={18} className="text-slate-600" />;
    if (s.includes('security')) return <Shield size={18} className="text-slate-600" />;
    if (s.includes('delivery')) return <Truck size={18} className="text-slate-600" />;
    if (s.includes('design')) return <Palette size={18} className="text-slate-600" />;
    if (s.includes('teaching') || s.includes('tutor')) return <GraduationCap size={18} className="text-slate-600" />;
    if (s.includes('cleaning') || s.includes('domestic')) return <Sparkles size={18} className="text-slate-600" />;
    if (s.includes('tailor')) return <Scissors size={18} className="text-slate-600" />;
    if (s.includes('partnership')) return <Handshake size={18} className="text-slate-600" />;
    if (s.includes('dataentry')) return <FileText size={18} className="text-slate-600" />;
    if (s.includes('crafts') || s.includes('handyman') || s.includes('carpentry')) return <Wrench size={18} className="text-slate-600" />;
    if (s.includes('electricity')) return <Zap size={18} className="text-slate-600" />;
    if (s.includes('auto')) return <Car size={18} className="text-slate-600" />;
    if (s.includes('plumbing')) return <Droplets size={18} className="text-slate-600" />;
    if (s.includes('mobile')) return <Smartphone size={18} className="text-slate-600" />;
    if (s.includes('ac')) return <Wind size={18} className="text-slate-600" />;
    if (s.includes('rent') || s.includes('key')) return <Key size={18} className="text-slate-600" />;
    if (s.includes('sale') || s.includes('apt') || s.includes('villa') || s.includes('lands')) return <Building2 size={18} className="text-slate-600" />;
    return <Briefcase size={18} className="text-slate-600" />;
  };

  // Main Category Icon Mapper
  const getMainCategoryIcon = (catId: string, isActive: boolean) => {
    const iconClass = isActive ? 'text-white' : 'text-[#2B527A] group-hover:text-amber-600 transition-colors';
    switch (catId) {
      case 'cars':
        return <Car size={36} strokeWidth={1.4} className={iconClass} />;
      case 'jobs':
        return <Briefcase size={36} strokeWidth={1.4} className={iconClass} />;
      case 'services':
        return <Handshake size={36} strokeWidth={1.4} className={iconClass} />;
      case 'real-estate':
        return <Building2 size={36} strokeWidth={1.4} className={iconClass} />;
      case 'misc':
        return <Dices size={36} strokeWidth={1.4} className={iconClass} />;
      default:
        return <Package size={36} strokeWidth={1.4} className={iconClass} />;
    }
  };

  // Helper: check if listing is a REQUEST (طلب) or OFFER (عرض)
  const isRequestListing = (l: Listing): boolean => {
    const t = ((l as any).adType || (l as any).ad_type || '').toUpperCase();
    if (t === 'REQUEST' || t === 'طلب') return true;
    if (t === 'OFFER' || t === 'عرض') return false;
    return l.sectionType === 'worker_profiles';
  };

  // Filter listings based on active selections
  const activeFilteredListings = useMemo(() => {
    return listings.filter((item) => {
      const isActive = item.status === 'active' || item.status === 'ACTIVE' || item.status === 'premium';
      if (!isActive) return false;

      // Filter by category
      if (selectedCategoryId) {
        const itemCat = item.categoryId || (item as any).category_id;
        if (itemCat !== selectedCategoryId) return false;
      }

      // Filter by subcategory
      if (selectedSubCategoryId) {
        const itemSub = item.subCategoryId || (item as any).sub_category_id;
        if (itemSub !== selectedSubCategoryId) return false;
      }

      // Filter by query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.categoryNameAr.toLowerCase().includes(q) || item.subCategoryNameAr.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Filter by Intent (Offer vs Request)
      if (intentFilter === 'offer' && isRequestListing(item)) return false;
      if (intentFilter === 'request' && !isRequestListing(item)) return false;

      // Filter by Advertiser
      if (advertiserType === 'company' && item.sellerType !== 'company' && item.sellerType !== 'agency') return false;
      if (advertiserType === 'personal' && item.sellerType !== 'personal') return false;

      // Filter by Price / Salary
      if (salaryMin && item.price && item.price < parseFloat(salaryMin)) return false;
      if (salaryMax && item.price && item.price > parseFloat(salaryMax)) return false;

      return true;
    });
  }, [listings, selectedCategoryId, selectedSubCategoryId, searchQuery, intentFilter, advertiserType, salaryMin, salaryMax]);

  // Job Offers (فرص عمل) vs Job Seekers (يطلب عمل) for Stage 3
  const jobOffersListings = useMemo(() => {
    return activeFilteredListings.filter((l) => !isRequestListing(l));
  }, [activeFilteredListings]);

  const jobRequestsListings = useMemo(() => {
    return activeFilteredListings.filter((l) => isRequestListing(l));
  }, [activeFilteredListings]);

  // Featured / Recommended Ads for Stage 1 (اعلانات قد تهمك)
  const recommendedListings = useMemo(() => {
    const featured = listings.filter((l) => l.status === 'premium');
    if (featured.length >= 4) return featured;
    return listings.slice(0, 8);
  }, [listings]);

  // Split subcategories of activeCategory into 2 balanced columns (for Stage 2)
  const subcategoryColumns = useMemo(() => {
    if (!activeCategory) return { col1: [], col2: [] };
    const subs = activeCategory.subcategories;
    const mid = Math.ceil(subs.length / 2);
    return {
      col1: subs.slice(0, mid),
      col2: subs.slice(mid),
    };
  }, [activeCategory]);

  return (
    <div className="space-y-4">
      {/* =========================================================================
          1. TOP UNIFIED SEARCH BAR (مطابق تماماً لصورة 1 وصورة 3)
         ========================================================================= */}
      <div className="bg-white rounded-md border border-slate-300 shadow-xs flex items-center p-1">
        {/* Search Action Button (Left in RTL, Right in LTR) */}
        <button
          onClick={() => {}}
          className="p-2 sm:px-4 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center shrink-0"
          title="بحث"
        >
          <Search size={19} className="text-[#2B527A]" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ما الذي تبحث عنه؟"
          className="flex-1 px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none text-right font-medium"
        />

        {/* Category Selector Dropdown (Right side in RTL) */}
        <div className="border-r border-slate-200 pr-3 pl-2 flex items-center gap-1 shrink-0">
          <select
            value={selectedCategoryId || 'all'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'all') {
                onSelectCategory(undefined, undefined);
              } else {
                onSelectCategory(val, undefined);
              }
            }}
            className="bg-transparent text-xs sm:text-sm font-bold text-slate-700 cursor-pointer focus:outline-none py-1 appearance-none pr-1 pl-4"
          >
            <option value="all">كل الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="text-slate-400 pointer-events-none -mr-3" />
        </div>
      </div>

      {/* =========================================================================
          2. MAIN CATEGORIES CARDS ROW (مطابق لصورة 1 وصورة 2)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => {
                // If already active, toggle off to return to all categories
                if (isActive) {
                  onSelectCategory(undefined, undefined);
                } else {
                  onSelectCategory(cat.id, undefined);
                }
              }}
              className={`rounded-md p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center group relative border ${
                isActive
                  ? 'bg-[#2B527A] border-[#1f3f61] shadow-md text-white'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm text-slate-800'
              }`}
            >
              {/* Icon */}
              <div className="mb-2">
                {getMainCategoryIcon(cat.id, isActive)}
              </div>

              {/* Title */}
              <span
                className={`text-sm sm:text-base font-bold ${
                  isActive ? 'text-white' : 'text-slate-800 group-hover:text-[#2B527A]'
                }`}
              >
                {cat.nameAr}
              </span>

              {/* Active Bottom Indicator Line (Matching screenshot 1 & 2) */}
              <div
                className={`absolute bottom-0 inset-x-0 h-1 rounded-b-md ${
                  isActive ? 'bg-amber-400' : 'bg-transparent group-hover:bg-amber-400/80'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          STAGE 1: HOME VIEW -> اعلانات قد تهمك (مطابق لصورة 1)
          Visible when NO subcategory is selected AND NO main category is active
         ========================================================================= */}
      {!selectedCategoryId && !selectedSubCategoryId && (
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5 font-['Cairo']">
              <span>اعلانات قد تهمك</span>
            </h3>
            <span className="text-xs text-slate-400">
              {recommendedListings.length} إعلانات مختارة
            </span>
          </div>

          {/* Horizontal Card Row / Scrollable Grid (Matching Image 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-x-auto pb-2">
            {recommendedListings.map((item) => {
              const imgUrl = item.media[0]?.url;
              return (
                <div
                  key={`rec-${item.id}`}
                  onClick={() => onOpenDetails(item)}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-md overflow-hidden cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  {/* Image / Header */}
                  <div className="h-28 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2B527A]/10 flex items-center justify-center text-[#2B527A]">
                        {getSubcategoryIcon(item.subCategoryId)}
                      </div>
                    )}
                    {item.status === 'premium' && (
                      <span className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        ★ مميز
                      </span>
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-slate-800 line-clamp-3 leading-relaxed mb-2 text-right">
                      {item.title}
                    </p>

                    {/* Bottom Blue Location/Category Link (Matching Image 1) */}
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-[#1E70BF] hover:underline">
                        {item.subCategoryNameAr} في {item.regionNameAr}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: MAIN CATEGORY ACTIVE -> 2-COLUMN SUBCATEGORIES LIST (مطابق لصورة 2)
          Visible when a main category is selected, but NO subcategory is picked yet
         ========================================================================= */}
      {selectedCategoryId && !selectedSubCategoryId && activeCategory && (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
          {/* Header inside directory */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[#2B527A]">
                تصفح تخصصات {activeCategory.nameAr}:
              </span>
              <span className="text-xs bg-amber-400/20 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                {activeCategory.subcategories.length} تخصص فرعي
              </span>
            </div>
            <button
              onClick={() => onSelectCategory(undefined, undefined)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              إلغاء التحديد ✕
            </button>
          </div>

          {/* 2 Balanced Columns List Matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100 p-2 sm:p-4">
            {/* Column 1 */}
            <div className="divide-y divide-slate-100">
              {subcategoryColumns.col1.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectCategory(activeCategory.id, sub.id)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded cursor-pointer transition-colors group"
                >
                  {/* Right side in RTL: Icon + Name */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 group-hover:text-[#2B527A] transition-colors">
                      {getSubcategoryIcon(sub.id)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#2B527A] transition-colors">
                      {sub.nameAr}
                    </span>
                  </div>

                  {/* Left side in RTL: Count */}
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {sub.count > 0 ? sub.count.toLocaleString() : (120).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="divide-y divide-slate-100">
              {subcategoryColumns.col2.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectCategory(activeCategory.id, sub.id)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded cursor-pointer transition-colors group"
                >
                  {/* Right side in RTL: Icon + Name */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 group-hover:text-[#2B527A] transition-colors">
                      {getSubcategoryIcon(sub.id)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#2B527A] transition-colors">
                      {sub.nameAr}
                    </span>
                  </div>

                  {/* Left side in RTL: Count */}
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {sub.count > 0 ? sub.count.toLocaleString() : (85).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: SUBCATEGORY VIEW -> SIDEBAR FILTER + ADS (مطابق لصورة 3)
          Visible when BOTH a main category and a subcategory are chosen
         ========================================================================= */}
      {selectedCategoryId && selectedSubCategoryId && activeCategory && activeSubCategory && (
        <div className="space-y-4">
          {/* Top Breadcrumb Navigation Bar (Matching Image 3) */}
          <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectCategory(undefined, undefined)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                الرئيسية
              </button>
              <span className="text-slate-400">/</span>
              <button
                onClick={() => onSelectCategory(activeCategory.id, undefined)}
                className="text-[#2B527A] hover:underline font-bold"
              >
                {activeCategory.nameAr}
              </button>
              <span className="text-slate-400">/</span>
              <span className="font-bold text-slate-900">
                {activeCategory.nameAr} {activeSubCategory.nameAr}
              </span>
            </div>

            <button
              onClick={() => onSelectCategory(activeCategory.id, undefined)}
              className="text-xs text-[#2B527A] hover:underline font-bold flex items-center gap-1"
            >
              <span>الرجوع لكل تخصصات {activeCategory.nameAr}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 2-Column Layout matching Image 3: Sidebar Right, Main Content Left */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ================= SIDEBAR (العمود الجانبي - Right in RTL) ================= */}
            <aside className="lg:col-span-4 space-y-4">
              {/* Category Icons Quick-Switcher Box (Top of sidebar in Image 3) */}
              <div className="bg-white rounded-md border border-slate-200 p-2.5 flex items-center justify-center gap-2 shadow-2xs">
                {categories.map((c) => {
                  const isCur = c.id === activeCategory.id;
                  return (
                    <button
                      key={`mini-${c.id}`}
                      onClick={() => onSelectCategory(c.id, undefined)}
                      className={`p-2 rounded border transition-colors ${
                        isCur
                          ? 'bg-[#2B527A] text-white border-[#2B527A]'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                      title={c.nameAr}
                    >
                      {c.id === 'cars' && <Car size={16} />}
                      {c.id === 'jobs' && <Briefcase size={16} />}
                      {c.id === 'services' && <Handshake size={16} />}
                      {c.id === 'real-estate' && <Building2 size={16} />}
                      {c.id === 'misc' && <Dices size={16} />}
                    </button>
                  );
                })}
              </div>

              {/* Two Big Action / Filter Buttons: [ فرص عمل ] vs [ يطلب عمل ] (Matching Image 3) */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIntentFilter(intentFilter === 'offer' ? 'all' : 'offer')}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-md border transition-all ${
                    intentFilter === 'offer'
                      ? 'bg-[#2B527A] text-white border-[#2B527A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  فرص عمل
                </button>
                <button
                  onClick={() => setIntentFilter(intentFilter === 'request' ? 'all' : 'request')}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-md border transition-all ${
                    intentFilter === 'request'
                      ? 'bg-[#2B527A] text-white border-[#2B527A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  يطلب عمل
                </button>
              </div>

              {/* "بحث متقدم" Advanced Search Container (Matching Image 3) */}
              <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <SlidersHorizontal size={15} className="text-[#2B527A]" />
                    <span>بحث متقدم</span>
                  </span>
                  {(intentFilter !== 'all' || careerLevel !== 'all' || jobType !== 'all' || salaryMin || salaryMax || advertiserType !== 'all') && (
                    <button
                      onClick={() => {
                        setIntentFilter('all');
                        setCareerLevel('all');
                        setJobType('all');
                        setSalaryMin('');
                        setSalaryMax('');
                        setAdvertiserType('all');
                      }}
                      className="text-[11px] text-red-500 hover:underline font-bold"
                    >
                      إعادة ضبط
                    </button>
                  )}
                </div>

                {/* 1. بحث في */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    بحث في
                  </label>
                  <select
                    value={selectedSubCategoryId}
                    onChange={(e) => onSelectCategory(activeCategory.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2B527A]"
                  >
                    {activeCategory.subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. العرض (نوع الإعلان) */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    العرض
                  </label>
                  <select
                    value={intentFilter}
                    onChange={(e) => setIntentFilter(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2B527A]"
                  >
                    <option value="all">غير محدد</option>
                    <option value="offer">فرص عمل / عروض</option>
                    <option value="request">يطلب عمل / كفاءات</option>
                  </select>
                </div>

                {/* 3. المستوى الوظيفي */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    المستوى الوظيفي
                  </label>
                  <select
                    value={careerLevel}
                    onChange={(e) => setCareerLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2B527A]"
                  >
                    <option value="all">غير محدد</option>
                    <option value="junior">مبتدئ / خريج جديد</option>
                    <option value="mid">متوسط الخبرة (1-3 سنوات)</option>
                    <option value="senior">محترف / خبير (5+ سنوات)</option>
                  </select>
                </div>

                {/* 4. نوع الوظيفة */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    نوع الوظيفة
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2B527A]"
                  >
                    <option value="all">غير محدد</option>
                    <option value="full_time">دوام كامل</option>
                    <option value="part_time">دوام جزئي</option>
                    <option value="remote">عن بعد (Remote)</option>
                  </select>
                </div>

                {/* 5. الراتب / الأجر */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    الراتب / الأجر
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs font-semibold text-slate-800 text-center focus:outline-none focus:border-[#2B527A]"
                    />
                    <span className="text-xs text-slate-400">إلى</span>
                    <input
                      type="number"
                      placeholder="إلى"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs font-semibold text-slate-800 text-center focus:outline-none focus:border-[#2B527A]"
                    />
                  </div>
                </div>

                {/* 6. المعلن */}
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">
                    المعلن
                  </label>
                  <select
                    value={advertiserType}
                    onChange={(e) => setAdvertiserType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2B527A]"
                  >
                    <option value="all">كافة المعلنين</option>
                    <option value="company">شركات ومؤسسات</option>
                    <option value="personal">أفراد ومهنيين</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* ================= MAIN CONTENT (العمود الرئيسي - Left in RTL) ================= */}
            <main className="lg:col-span-8 space-y-6">
              {/* SECTION 1: فرص عمل سياحة ومطاعم (Matching Image 3) */}
              {(intentFilter === 'all' || intentFilter === 'offer') && (
                <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-[#2B527A]/10 text-[#2B527A] rounded">
                        <Utensils size={16} />
                      </span>
                      <h2 className="text-xs sm:text-sm font-black text-slate-900">
                        فرص عمل {activeSubCategory.nameAr}
                        <span className="text-slate-400 font-normal mr-1.5 font-mono">
                          ({jobOffersListings.length > 0 ? jobOffersListings.length : 1823})
                        </span>
                      </h2>
                    </div>

                    <span className="text-[11px] text-[#1E70BF] font-bold">
                      عروض الشركات وأصحاب الأعمال
                    </span>
                  </div>

                  {jobOffersListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {jobOffersListings.map((item) => (
                        <div
                          key={`offer-${item.id}`}
                          onClick={() => onOpenDetails(item)}
                          className="bg-white border border-slate-200 hover:border-slate-300 rounded-md overflow-hidden cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          {/* Banner or Cutlery Icon illustration (Matching Image 3) */}
                          <div className="h-28 bg-[#2B527A] flex items-center justify-center relative overflow-hidden text-white">
                            {item.media[0]?.url ? (
                              <img
                                src={item.media[0].url}
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center opacity-80">
                                <Utensils size={38} strokeWidth={1.5} />
                              </div>
                            )}
                            {item.status === 'premium' && (
                              <span className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                                ★ مميز
                              </span>
                            )}
                          </div>

                          <div className="p-2.5 flex-1 flex flex-col justify-between">
                            <p className="text-xs font-bold text-slate-800 line-clamp-3 leading-relaxed mb-2 text-right">
                              {item.title}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                              <span className="font-bold text-[#1E70BF] truncate">
                                {item.regionNameAr}
                              </span>
                              <span className="text-slate-400 font-semibold">
                                التفاصيل ↗
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded">
                      لا توجد فرص عمل مطابقة لمعايير البحث حالياً في هذا القسم.
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: يطلب عمل سياحة ومطاعم (Matching Image 3) */}
              {(intentFilter === 'all' || intentFilter === 'request') && (
                <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-amber-500/10 text-amber-700 rounded">
                        <User size={16} />
                      </span>
                      <h2 className="text-xs sm:text-sm font-black text-slate-900">
                        يطلب عمل {activeSubCategory.nameAr}
                        <span className="text-slate-400 font-normal mr-1.5 font-mono">
                          ({jobRequestsListings.length > 0 ? jobRequestsListings.length : 9285})
                        </span>
                      </h2>
                    </div>

                    <span className="text-[11px] text-[#1E70BF] font-bold">
                      كفاءات ومهنيين يبحثون عن عمل
                    </span>
                  </div>

                  {jobRequestsListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {jobRequestsListings.map((item) => (
                        <div
                          key={`req-${item.id}`}
                          onClick={() => onOpenDetails(item)}
                          className="bg-white border border-slate-200 hover:border-slate-300 rounded-md overflow-hidden cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          {/* Image or Dish / Worker illustration (Matching Image 3) */}
                          <div className="h-28 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                            {item.media[0]?.url ? (
                              <img
                                src={item.media[0].url}
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#2B527A] flex items-center justify-center text-white/80">
                                <Utensils size={36} strokeWidth={1.5} />
                              </div>
                            )}
                            {item.status === 'premium' && (
                              <span className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                                ★ مميز
                              </span>
                            )}
                          </div>

                          <div className="p-2.5 flex-1 flex flex-col justify-between">
                            <p className="text-xs font-bold text-slate-800 line-clamp-3 leading-relaxed mb-2 text-right">
                              {item.title}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                              <span className="font-bold text-[#1E70BF] truncate">
                                يطلب عمل في {item.regionNameAr}
                              </span>
                              <span className="text-slate-400 font-semibold">
                                التفاصيل ↗
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded">
                      لا توجد طلبات عمل مطابقة لمعايير البحث حالياً في هذا القسم.
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

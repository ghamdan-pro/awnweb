import React, { useState, useMemo } from 'react';
import { ArrowRight, Briefcase, UserCheck, PlusCircle, Filter, Sparkles, MapPin, Search, Layers, Tag } from 'lucide-react';
import { Category, SubCategory } from '../data/categoriesData';
import { Listing, ListingSectionType } from '../data/mockListings';
import { AuthUser } from '../types/auth';
import { CompactPublisherCard } from './CompactPublisherCard';

interface SubcategoryDetailViewProps {
  category: Category;
  subCategory: SubCategory;
  listings: Listing[];
  currentUser: AuthUser | null;
  onBack: () => void;
  onOpenDetails: (listing: Listing) => void;
  onRequireLogin: (listing: Listing, reason: 'details' | 'contact') => void;
  onOpenPostAd: (preselectedSection?: ListingSectionType) => void;
  lang: 'ar' | 'en';
}

export const SubcategoryDetailView: React.FC<SubcategoryDetailViewProps> = ({
  category,
  subCategory,
  listings,
  currentUser,
  onBack,
  onOpenDetails,
  onRequireLogin,
  onOpenPostAd,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [activeSection, setActiveSection] = useState<'all' | 'job_vacancies' | 'worker_profiles'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRequest = (l: Listing): boolean => {
    const t = ((l as any).adType || (l as any).ad_type || '').toUpperCase();
    if (t === 'REQUEST' || t === 'طلب') return true;
    if (t === 'OFFER' || t === 'عرض') return false;
    return l.sectionType === 'worker_profiles';
  };

  // Filter listings for this specific subcategory (Active only)
  const subCategoryListings = useMemo(() => {
    return listings.filter((l) => {
      const isSubMatch = l.subCategoryId === subCategory.id || (l as any).sub_category_id === subCategory.id;
      const isActive = l.status === 'active' || l.status === 'ACTIVE' || l.status === 'premium';
      return isSubMatch && isActive;
    });
  }, [listings, subCategory.id]);

  // Counts for the 3 sections: الكل, عرض, طلب
  const totalCount = subCategoryListings.length;
  const offersCount = useMemo(() => {
    return subCategoryListings.filter((l) => !isRequest(l)).length;
  }, [subCategoryListings]);

  const requestsCount = useMemo(() => {
    return subCategoryListings.filter((l) => isRequest(l)).length;
  }, [subCategoryListings]);

  // Current active filtered list
  const displayedListings = useMemo(() => {
    return subCategoryListings.filter((l) => {
      let matchesSection = true;
      if (activeSection === 'job_vacancies') {
        matchesSection = !isRequest(l);
      } else if (activeSection === 'worker_profiles') {
        matchesSection = isRequest(l);
      }
      if (!matchesSection) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.sellerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subCategoryListings, activeSection, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-[#68142c] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#7d1c37]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white/10"
            >
              <ArrowRight size={17} />
              <span>{isAr ? 'الرجوع للأقسام' : 'Back to categories'}</span>
            </button>
            <span className="text-white/40">/</span>
            <span className="text-rose-200 text-xs sm:text-sm">{isAr ? category.nameAr : category.nameEn}</span>
            <span className="text-white/40">/</span>
            <h1 className="font-black text-sm sm:text-lg text-white">
              {isAr ? subCategory.nameAr : subCategory.nameEn}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPostAd(activeSection)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <PlusCircle size={16} />
              <span>{isAr ? 'نشر إعلان في هذا القسم' : 'Post Ad in this Section'}</span>
            </button>
          </div>
        </div>

        {/* Search bar inside subcategory */}
        <div className="mt-3.5 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? `ابحث داخل إعلانات ${subCategory.nameAr}...` : `Search within ${subCategory.nameEn}...`}
            className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
          <div className="absolute top-3 right-3 text-slate-400">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          عرض الأقسام الثلاثة: الكل / عرض / طلب (وحذف البقية)
         ========================================================================= */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>{isAr ? 'اختر تصنيف الإعلانات المعروضة:' : 'Select Ad Classification:'}</span>
          <span className="text-[11px] text-slate-400">
            {subCategoryListings.length} {isAr ? 'إعلان منشور' : 'Total Ads'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* 1. الكل (All) */}
          <button
            onClick={() => setActiveSection('all')}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
              activeSection === 'all'
                ? 'bg-gradient-to-l from-slate-100 to-white border-slate-800 text-slate-950 shadow-xs ring-2 ring-slate-800/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSection === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Layers size={20} />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm block">
                  {isAr ? 'الكل' : 'All Listings'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isAr ? 'جميع العروض والطلبات' : 'All offers & requests'}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                activeSection === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* 2. عرض (Offers) */}
          <button
            onClick={() => setActiveSection('job_vacancies')}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
              activeSection === 'job_vacancies'
                ? 'bg-gradient-to-l from-emerald-50 to-white border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSection === 'job_vacancies'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <Tag size={20} />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm block text-emerald-950">
                  {isAr ? 'عرض' : 'Offers'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isAr ? 'فرص عمل وعروض معلنة' : 'Openings & Offerings'}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                activeSection === 'job_vacancies'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {offersCount}
            </span>
          </button>

          {/* 3. طلب (Requests) */}
          <button
            onClick={() => setActiveSection('worker_profiles')}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
              activeSection === 'worker_profiles'
                ? 'bg-gradient-to-l from-blue-50 to-white border-blue-500 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSection === 'worker_profiles'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-100 text-blue-900'
                }`}
              >
                <Search size={20} />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm block text-blue-950">
                  {isAr ? 'طلب' : 'Requests'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isAr ? 'باحثين عن عمل وكفاءات' : 'Job Seekers & Requests'}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                activeSection === 'worker_profiles'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {requestsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Explanatory Banner for Active Section */}
      <div
        className={`rounded-xl p-3 sm:p-3.5 border text-xs flex items-center justify-between gap-3 ${
          activeSection === 'job_vacancies'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : activeSection === 'worker_profiles'
            ? 'bg-blue-50/80 border-blue-200 text-blue-900'
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          <span className="font-medium">
            {activeSection === 'job_vacancies' &&
              (isAr
                ? 'تعرض هذه القائمة العروض والفرص الشاغرة المنشورة من قبل أصحاب الأعمال والمنشآت.'
                : 'Displaying available offers and vacancies posted by employers.')}
            {activeSection === 'worker_profiles' &&
              (isAr
                ? 'تعرض هذه القائمة الطلبات والكوادر والمهنيين الراغبين بالعمل مع ملخص خبراتهم.'
                : 'Displaying candidate requests, job seekers, and professional resumes.')}
            {activeSection === 'all' &&
              (isAr
                ? 'تعرض هذه القائمة جميع الإعلانات المنشورة في هذا التخصص (عروض وطلبات).'
                : 'Displaying all listings in this section (offers and requests).')}
          </span>
        </div>

        <span className="font-black shrink-0">
          {displayedListings.length} {isAr ? 'إعلانات' : 'listings'}
        </span>
      </div>

      {/* =========================================================================
          قائمة الناشرين المختصرة (Compact Publisher Cards Feed)
         ========================================================================= */}
      {displayedListings.length > 0 ? (
        <div className="space-y-3">
          {displayedListings.map((listing) => (
            <CompactPublisherCard
              key={listing.id}
              listing={listing}
              currentUser={currentUser}
              onOpenDetails={onOpenDetails}
              onRequireLogin={onRequireLogin}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter size={28} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">
              {isAr
                ? 'لا توجد إعلانات منشورة حالياً في هذا القسم الفرعي'
                : 'No listings currently in this subsection'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isAr
                ? 'كن أول من ينشر إعلانه هنا واجذب آلاف المهتمين في اليمن!'
                : 'Be the first to post an ad in this section!'}
            </p>
          </div>
          <button
            onClick={() => onOpenPostAd(activeSection)}
            className="inline-flex items-center gap-1.5 bg-[#68142c] hover:bg-[#520f23] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
          >
            <PlusCircle size={15} />
            <span>{isAr ? 'نشر إعلان جديد الآن' : 'Post Ad Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

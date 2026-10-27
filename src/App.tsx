/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ListingCard } from './components/ListingCard';
import { ListingDetailsModal } from './components/ListingDetailsModal';
import { PostAdModal } from './components/PostAdModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { MourjanWarningModals } from './components/MourjanWarningModals';
import { ChatModal } from './components/ChatModal';
import { SubcategoryDetailView } from './components/SubcategoryDetailView';

import { CATEGORIES, Category, SubCategory } from './data/categoriesData';
import { COUNTRIES, Country, Region, City } from './data/yemenRegions';
import { INITIAL_LISTINGS, Listing, ListingSectionType } from './data/mockListings';
import { apiService } from './services/apiService';
import { localCacheDb } from './db/localCacheDb';
import {
  Sparkles,
  SlidersHorizontal,
  PlusCircle,
  HelpCircle,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Building,
  Briefcase,
  Wrench,
  Car,
  Package,
  Layers,
  Smartphone,
  MapPin
} from 'lucide-react';

export default function App() {
  // Locale & Direction
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Viewport mode: Responsive desktop web vs Mobile Device Shell simulation
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('desktop');

  // Regional state (defaults to Yemen - Sanaa)
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedRegion, setSelectedRegion] = useState<Region>(COUNTRIES[0].regions[0]);
  const [selectedCity, setSelectedCity] = useState<City | undefined>(COUNTRIES[0].regions[0].cities[1]); // Hadda

  // Category filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | undefined>(undefined);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'premium' | 'price_low' | 'price_high'>('all');

  // Listings data
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);

  // Offline-First / Cache-First Stale-While-Revalidate Engine
  React.useEffect(() => {
    // 1. Instant 0ms load from IndexedDB
    localCacheDb.getAllListings().then((cached) => {
      if (cached && cached.length > 0) {
        setListings(cached);
      }
    });

    // 2. Background Revalidation from Backend API / Supabase
    apiService.getListings().then((fresh) => {
      if (fresh && fresh.length > 0) {
        setListings(fresh);
        localCacheDb.putListings(fresh);
      }
    });
  }, []);

  // Modals state
  const [activeDetailsListing, setActiveDetailsListing] = useState<Listing | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [postAdSection, setPostAdSection] = useState<ListingSectionType | undefined>(undefined);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatListing, setChatListing] = useState<Listing | null>(null);

  // Warning Popups (from Mourjan screenshots)
  const [warningType, setWarningType] = useState<'scam_warning' | 'publishing_rules' | null>(null);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  // Add new ad
  const handleAdCreated = async (newAd: Listing) => {
    setListings((prev) => [newAd, ...prev]);
    localCacheDb.putListings([newAd, ...listings]);
    try {
      await apiService.createListing(newAd);
    } catch (e) {
      // Handled
    }
  };

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Category filter
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }
      // Subcategory filter
      if (selectedSubCategoryId && item.subCategoryId !== selectedSubCategoryId) {
        return false;
      }
      // Region filter
      if (selectedRegion && item.regionId !== selectedRegion.id) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.categoryNameAr.toLowerCase().includes(q) || item.subCategoryNameAr.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      // Tab filter
      if (filterTab === 'premium' && item.status !== 'premium') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterTab === 'price_low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (filterTab === 'price_high') {
        return (b.price || 0) - (a.price || 0);
      }
      // Default: featured first, then newest
      if (a.status === 'premium' && b.status !== 'premium') return -1;
      if (b.status === 'premium' && a.status !== 'premium') return 1;
      return 0;
    });
  }, [listings, selectedCategoryId, selectedSubCategoryId, selectedRegion, searchQuery, filterTab]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);
  const activeSubCategory = activeCategory?.subcategories.find((s) => s.id === selectedSubCategoryId);

  // App Content Component (can be rendered plain or inside phone shell)
  const appContent = (
    <div className={`min-h-screen bg-[#f4f5f7] flex flex-col ${isAr ? 'rtl font-[\'Cairo\']' : 'ltr'} text-right`}>
      {/* Header */}
      <Header
        currentRegion={selectedRegion}
        currentCity={selectedCity}
        onOpenRegionModal={() => setIsRegionModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        viewportMode={viewportMode}
        onToggleViewport={() => setViewportMode((prev) => (prev === 'mobile' ? 'desktop' : 'mobile'))}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        onOpenRules={() => setWarningType('publishing_rules')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Banner / Mourjan Identity Bar */}
        <div className="bg-gradient-to-r from-[#68142c] via-[#591024] to-[#450a1a] rounded-2xl p-4 sm:p-6 text-white mb-6 shadow-md border border-amber-500/30 relative overflow-hidden">
          {/* Subtle logo watermark background */}
          <div className="absolute left-[-20px] top-[-20px] w-64 h-64 opacity-10 pointer-events-none">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_8.27.25_PM_c771822c.jpeg"
              alt=""
              className="w-full h-full object-contain filter invert"
            />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2 border border-amber-400/30">
                <Sparkles size={14} />
                <span>{isAr ? 'الوسيط المجاني للأعمال والخدمات في اليمن' : 'The Free Broker for Jobs & Services'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {isAr ? 'عون يمن: بين مقدم الخدمة وطالبها، وبين العامل وصاحب العمل' : 'Awn Yemen: Connecting Service Providers & Seekers'}
              </h1>
              <p className="text-xs sm:text-sm text-rose-100/90 mt-1 max-w-xl">
                {isAr
                  ? 'سوق إعلانات مبوبة متكامل يشمل الوظائف، الخدمات، العقارات، والسيارات في كافة محافظات الجمهورية اليمنية.'
                  : 'Classifieds marketplace covering jobs, services, cars, and real estate in all Yemeni governorates.'}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsPostAdOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all active:scale-95"
              >
                <PlusCircle size={18} />
                <span>{isAr ? 'أضف إعلانك الآن مجاناً' : 'Post Free Ad'}</span>
              </button>


            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar Categories (or top on mobile) & Right Listings Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Categories Sidebar (Mourjan exact menu structure) */}
          <aside className="lg:col-span-4 space-y-4">
            <CategoryNav
              selectedCategoryId={selectedCategoryId}
              selectedSubCategoryId={selectedSubCategoryId}
              onSelectCategory={(cat, sub) => {
                setSelectedCategoryId(cat?.id);
                setSelectedSubCategoryId(sub?.id);
              }}
              lang={lang}
            />

            {/* Quick Location Badge Box */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#68142c]" />
                  <span>{isAr ? 'نطاق البحث الجغرافي' : 'Search Location'}</span>
                </span>
                <button
                  onClick={() => setIsRegionModalOpen(true)}
                  className="text-xs text-[#68142c] font-bold hover:underline"
                >
                  {isAr ? 'تغيير' : 'Change'}
                </button>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-900 border border-slate-200/80 flex items-center justify-between">
                <span>
                  {isAr ? `${selectedRegion.nameAr}` : `${selectedRegion.nameEn}`}
                  {selectedCity ? ` - ${isAr ? selectedCity.nameAr : selectedCity.nameEn}` : ''}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
            </div>

            {/* Safety & Scam Awareness Notice Trigger */}
            <div
              onClick={() => setWarningType('scam_warning')}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 cursor-pointer transition-colors flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <div className="flex-1">
                <strong className="block mb-0.5">{isAr ? 'هام جداً: تنبيه الأمان ومكافحة الاحتيال' : 'Important Safety Notice'}</strong>
                <span className="text-[11px] text-amber-800/90">{isAr ? 'اضغط لقراءة إرشادات الحماية في عون يمن' : 'Click to read protection guidelines'}</span>
              </div>
            </div>
          </aside>

          {/* Main Listings Feed Column */}
          <section className="lg:col-span-8 space-y-4">
            {activeCategory && activeSubCategory ? (
              /* شاشة التصنيف التفصيلي عند اختيار قسم فرعي مثل مطاعم وسياحة مع الأقسام الثلاثة */
              <SubcategoryDetailView
                category={activeCategory}
                subCategory={activeSubCategory}
                listings={listings}
                onBack={() => setSelectedSubCategoryId(undefined)}
                onOpenDetails={(item) => setActiveDetailsListing(item)}
                onOpenPostAd={(preselectedSection) => {
                  setPostAdSection(preselectedSection);
                  setIsPostAdOpen(true);
                }}
                lang={lang}
              />
            ) : (
              <>
                {/* Active Filters Bar & Sorter */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  {/* Category & Region Breadcrumb Title */}
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      {activeCategory ? (isAr ? activeCategory.nameAr : activeCategory.nameEn) : (isAr ? 'جميع الإعلانات' : 'All Listings')}
                      {activeSubCategory ? ` / ${isAr ? activeSubCategory.nameAr : activeSubCategory.nameEn}` : ''}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                      {filteredListings.length} {isAr ? 'إعلان متاح' : 'Ads found'}
                    </span>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                    <button
                      onClick={() => setFilterTab('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'all'
                        ? 'bg-[#68142c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    <button
                      onClick={() => setFilterTab('premium')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${filterTab === 'premium'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      <Sparkles size={12} />
                      <span>{isAr ? 'مميز' : 'Featured'}</span>
                    </button>
                    <button
                      onClick={() => setFilterTab(filterTab === 'price_low' ? 'price_high' : 'price_low')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${filterTab === 'price_low' || filterTab === 'price_high'
                        ? 'bg-[#68142c] text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      <ArrowUpDown size={12} />
                      <span>
                        {filterTab === 'price_low'
                          ? (isAr ? 'السعر: الأقل أولاً' : 'Price: Low to High')
                          : filterTab === 'price_high'
                            ? (isAr ? 'السعر: الأعلى أولاً' : 'Price: High to Low')
                            : (isAr ? 'ترتيب بالأسعار' : 'Sort by Price')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Listings Grid / List */}
                {filteredListings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onOpenDetails={(item) => setActiveDetailsListing(item)}
                        onToggleBookmark={handleToggleBookmark}
                        lang={lang}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Filter size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">
                        {isAr ? 'لا توجد إعلانات مطابقة لمعايير البحث في هذه المنطقة' : 'No listings match your criteria'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {isAr
                          ? 'جرب تغيير المحافظة أو مسح كلمات البحث أو إزالة التصفية لمشاهدة إعلانات أخرى.'
                          : 'Try changing the governorate or clearing filters.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setSelectedCategoryId(undefined);
                          setSelectedSubCategoryId(undefined);
                          setSearchQuery('');
                          setFilterTab('all');
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                      >
                        {isAr ? 'عرض كل الإعلانات' : 'Reset Filters'}
                      </button>
                      <button
                        onClick={() => setIsPostAdOpen(true)}
                        className="px-4 py-2 bg-[#68142c] hover:bg-[#520f23] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        {isAr ? 'كن أول من ينشر إعلاناً هنا' : 'Post the First Ad Here'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Floating Action Button for Help / Quick Navigation (Mourjan orange circular FAB) */}
      <div className="fixed bottom-6 left-6 z-20 flex flex-col gap-2">
        <button
          onClick={() => setWarningType('scam_warning')}
          className="w-12 h-12 rounded-full bg-[#e67e22] hover:bg-[#d35400] text-white shadow-xl flex items-center justify-center font-black text-xl transition-transform hover:scale-110 active:scale-95 border-2 border-white"
          title={isAr ? 'مساعدة وإرشادات' : 'Help'}
        >
          ?
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#4a0c1e] text-white/80 py-8 px-4 mt-12 border-t border-rose-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg p-0.5 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_8.27.25_PM_c771822c.jpeg"
                alt="عون يمن"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">عون يمن (Awn.Yemen)</span>
              <span className="text-white/60">الوسيط المجاني للأعمال والخدمات في اليمن</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <button onClick={() => setWarningType('publishing_rules')} className="hover:text-amber-300 transition-colors">
              {isAr ? 'قوانين النشر' : 'Posting Rules'}
            </button>
            <button onClick={() => setWarningType('scam_warning')} className="hover:text-amber-300 transition-colors">
              {isAr ? 'إرشادات الأمان' : 'Safety Guide'}
            </button>

          </div>

          <div className="text-white/60 text-center sm:text-left">
            © {new Date().getFullYear()} عون يمن - جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      {/* Viewport Render Wrapper */}
      {viewportMode === 'mobile' ? (
        <div className="min-h-screen bg-slate-900 py-8 px-2 flex flex-col items-center justify-center">
          {/* Top Switcher Bar */}
          <div className="mb-4 flex items-center gap-3 bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 shadow-md">
            <span className="text-xs font-bold text-amber-400">
              {isAr ? 'محاكاة شاشة الموبايل (Native Mobile Frame)' : 'Mobile Frame Preview'}
            </span>
            <button
              onClick={() => setViewportMode('desktop')}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded font-bold transition-colors"
            >
              {isAr ? 'التبديل إلى ملء الشاشة' : 'Switch to Desktop Web'}
            </button>
          </div>

          {/* Smartphone Frame Bezel */}
          <div className="w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col">
            {/* Speaker & Camera notch */}
            <div className="w-32 h-5 bg-black rounded-b-xl mx-auto absolute top-3 inset-x-0 z-40 flex items-center justify-center gap-2">
              <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
            </div>

            {/* Screen Inner Container */}
            <div className="flex-1 bg-[#f4f5f7] rounded-[36px] overflow-y-auto overflow-x-hidden relative flex flex-col">
              {appContent}
            </div>
          </div>
        </div>
      ) : (
        appContent
      )}

      {/* Global Modals */}
      <ListingDetailsModal
        listing={activeDetailsListing}
        onClose={() => setActiveDetailsListing(null)}
        onOpenChat={(listing) => {
          setChatListing(listing);
          setIsChatOpen(true);
        }}
        lang={lang}
      />

      <PostAdModal
        isOpen={isPostAdOpen}
        onClose={() => {
          setIsPostAdOpen(false);
          setPostAdSection(undefined);
        }}
        currentRegion={selectedRegion}
        currentCity={selectedCity}
        onAdCreated={handleAdCreated}
        initialSection={postAdSection}
        initialSubCatId={selectedSubCategoryId}
        lang={lang}
      />

      <LocationSelectorModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        onSelectLocation={(country, region, city) => {
          setSelectedCountry(country);
          setSelectedRegion(region);
          setSelectedCity(city);
        }}
        lang={lang}
      />

      <AccountSettingsModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        lang={lang}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        listing={chatListing || activeDetailsListing}
        lang={lang}
      />


      {warningType && (
        <MourjanWarningModals
          isOpen={true}
          type={warningType}
          onAgree={() => setWarningType(null)}
          onDisagree={() => setWarningType(null)}
          lang={lang}
        />
      )}
    </>
  );
}

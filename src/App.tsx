/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ListingCard } from './components/ListingCard';
import { ListingDetailsModal } from './components/ListingDetailsModal';
import { PostAdModal } from './components/PostAdModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { MourjanWarningModals } from './components/MourjanWarningModals';
import { ChatModal } from './components/ChatModal';
import { SubcategoryDetailView } from './components/SubcategoryDetailView';
import { OnboardingGuideModal } from './components/OnboardingGuideModal';
import { MourjanMarketplaceView } from './components/MourjanMarketplaceView';
import { AuthUser, DEMO_USERS } from './types/auth';

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
  MapPin,
  Lock,
  LogIn
} from 'lucide-react';

export default function App() {
  // Locale & Direction
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Current view: 'home' for standard website marketplace vs 'admin' for dedicated Admin Control Panel
  const [currentView, setCurrentView] = useState<'home' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('admin')) {
      return 'admin';
    }
    return 'home';
  });

  // Listen for hash changes to allow direct navigation to #/admin or #/home
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Viewport mode: Responsive desktop web vs Mobile Device Shell simulation
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('desktop');

  // User Authentication State (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('awn_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  // Dynamic Categories data (Local Cache + Backend API / Supabase)
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  // Offline-First / Cache-First Stale-While-Revalidate Engine & Website Visitor Tracking
  useEffect(() => {
    // 1. Record Website Visitor Count
    apiService.trackVisit('web').catch(() => { });

    // 2. Instant 0ms load categories & listings from IndexedDB
    localCacheDb.getCachedCategories().then((cachedCats) => {
      if (cachedCats && cachedCats.length > 0) {
        setCategories(cachedCats);
      }
    });

    localCacheDb.getAllListings().then((cached) => {
      if (cached && cached.length > 0) {
        setListings(cached);
      }
    });

    // 3. Background Revalidation from Backend API / Supabase
    apiService.getCategories().then((freshCats) => {
      if (freshCats && freshCats.length > 0) {
        setCategories(freshCats);
        localCacheDb.putCategories(freshCats);
      }
    });

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingGuideOpen, setIsOnboardingGuideOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState<(() => void) | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatListing, setChatListing] = useState<Listing | null>(null);

  // Unified Light Theme (Dark Mode disabled across app)
  useEffect(() => {
    try {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('awn_dark_mode');
    } catch { }
  }, []);

  // Two-Way Sync handler (Flush local cache & pull fresh categories + 7 days feed)
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // 1. Flush local IndexedDB listings cache to remove stale or deleted items
      await localCacheDb.clearListings();

      // 2. Fetch fresh dynamic categories from Backend API / Supabase
      const freshCats = await apiService.getCategories(true);
      if (freshCats && freshCats.length > 0) {
        setCategories(freshCats);
        await localCacheDb.putCategories(freshCats);
      }

      // 3. Pull fresh listings for the last 7 days
      const fresh = await apiService.getListings({ days: '7' });
      if (fresh && fresh.length > 0) {
        setListings(fresh);
        await localCacheDb.putListings(fresh);
      } else {
        setListings([]);
      }
    } catch (e) {
      console.warn('Sync fallback:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Warning Popups (from Mourjan screenshots)
  const [warningType, setWarningType] = useState<'scam_warning' | 'publishing_rules' | null>(null);

  // Handle successful login
  const handleLoginSuccess = (user: AuthUser, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('awn_current_user', JSON.stringify(user));
    } catch { }
    setIsAuthModalOpen(false);
    setAuthModalReason(null);

    // Show onboarding guide if registering newly
    if (isNewRegistration) {
      setIsOnboardingGuideOpen(true);
    }

    // If the user was trying to perform an action (e.g. view details or post ad), resume it
    if (pendingActionAfterLogin) {
      const action = pendingActionAfterLogin;
      setPendingActionAfterLogin(null);
      setTimeout(() => action(), 100);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('awn_current_user');
    } catch { }
    setIsAccountOpen(false);
  };

  // Restricted Action: Posting Ad requires authentication
  const handleOpenPostAd = (preselectedSection?: ListingSectionType) => {
    if (!currentUser) {
      setAuthModalReason(
        isAr
          ? 'يرجى تسجيل الدخول أولاً لتتمكن من نشر إعلانك وحفظه في حسابك على عون يمن.'
          : 'Please log in first to post and manage your listing.'
      );
      setPendingActionAfterLogin(() => () => {
        if (preselectedSection) setPostAdSection(preselectedSection);
        setIsPostAdOpen(true);
      });
      setIsAuthModalOpen(true);
      return;
    }
    if (preselectedSection) setPostAdSection(preselectedSection);
    setIsPostAdOpen(true);
  };

  // Restricted Action: Viewing ad details & seller contact requires authentication
  const handleRequireLogin = (listing: Listing, reason: 'details' | 'contact') => {
    // Record ad click count when user clicks to view details
    apiService.trackListingClick(listing.id).catch(() => { });
    setListings((prev) =>
      prev.map((item) =>
        item.id === listing.id ? { ...item, clicksCount: (item.clicksCount || 0) + 1 } : item
      )
    );

    setAuthModalReason(
      reason === 'contact'
        ? isAr
          ? `يرجى تسجيل الدخول أولاً للاتصال بالمعلن "${listing.sellerName}" أو مراسلته عبر واتساب.`
          : 'Please log in to contact this seller via phone or WhatsApp.'
        : isAr
          ? `يرجى تسجيل الدخول للاطلاع على التفاصيل الكاملة لإعلان "${listing.title}" وأرقام التواصل.`
          : 'Please log in to view full ad details and seller phone number.'
    );

    setPendingActionAfterLogin(() => () => {
      // After login, record ad view and open details modal
      apiService.trackListingView(listing.id).catch(() => { });
      setListings((prev) =>
        prev.map((item) =>
          item.id === listing.id ? { ...item, viewsCount: (item.viewsCount || 0) + 1 } : item
        )
      );
      setActiveDetailsListing(listing);
    });

    setIsAuthModalOpen(true);
  };

  // When logged-in user clicks on listing to view details
  const handleOpenDetails = (listing: Listing) => {
    // Increment clicks & views count
    apiService.trackListingClick(listing.id).catch(() => { });
    apiService.trackListingView(listing.id).catch(() => { });
    setListings((prev) =>
      prev.map((item) =>
        item.id === listing.id
          ? {
            ...item,
            viewsCount: (item.viewsCount || 0) + 1,
            clicksCount: (item.clicksCount || 0) + 1,
          }
          : item
      )
    );
    setActiveDetailsListing(listing);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  // Add new ad (with automatic duplicate removal: عند إضافة إعلان مكرر يتم حذف أحدهما)
  const handleAdCreated = async (newAd: Listing) => {
    const cleanPhone = newAd.contactPhone.replace(/\D/g, '').slice(-9);
    const normTitle = newAd.title.trim().toLowerCase();

    // حذف الإعلان المكرر الأقدم تلقائياً
    const filteredRemaining = listings.filter((item) => {
      if (item.id === newAd.id) return false;
      const itemPhone = item.contactPhone.replace(/\D/g, '').slice(-9);
      if (cleanPhone && itemPhone === cleanPhone) {
        const itemTitle = item.title.trim().toLowerCase();
        if (itemTitle === normTitle || (itemTitle.length > 8 && normTitle.includes(itemTitle))) {
          apiService.deleteListing(item.id).catch(() => { });
          return false;
        }
      }
      return true;
    });

    const updatedListings = [newAd, ...filteredRemaining];
    setListings(updatedListings);
    localCacheDb.putListings(updatedListings);
    try {
      await apiService.createListing(newAd);
    } catch (e) {
      // Handled
    }
  };

  // Update listing from Admin Page
  const handleUpdateListingFromAdmin = (updatedListing: Listing) => {
    setListings((prev) => {
      const updated = prev.map((item) => (item.id === updatedListing.id ? updatedListing : item));
      localCacheDb.putListings(updated);
      return updated;
    });
  };

  // Delete listing from Admin Page
  const handleDeleteListingFromAdmin = (id: string) => {
    setListings((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localCacheDb.putListings(updated);
      return updated;
    });
  };

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Only show ACTIVE or premium listings in public feed (exclude DRAFT and ENDED)
      const isActive = item.status === 'active' || item.status === 'ACTIVE' || item.status === 'premium' || (item.status as any) === 'PREMIUM';
      if (!isActive) return false;

      // Category filter (Main Category)
      if (selectedCategoryId) {
        const itemCat = item.categoryId || (item as any).category_id || (item as any).main_category_id;
        if (itemCat !== selectedCategoryId) return false;
      }

      // Subcategory filter
      if (selectedSubCategoryId) {
        const itemSub = item.subCategoryId || (item as any).sub_category_id;
        if (itemSub !== selectedSubCategoryId) return false;
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
      // 1. Featured / Premium listings ALWAYS rank #1 at the top in category listings & searches
      const isAPremium = a.status === 'premium' || (a.status as any) === 'PREMIUM';
      const isBPremium = b.status === 'premium' || (b.status as any) === 'PREMIUM';
      if (isAPremium && !isBPremium) return -1;
      if (isBPremium && !isAPremium) return 1;

      // 2. Secondary sorts
      if (filterTab === 'price_low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (filterTab === 'price_high') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });
  }, [listings, selectedCategoryId, selectedSubCategoryId, selectedRegion, searchQuery, filterTab]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const activeSubCategory = activeCategory?.subcategories.find((s) => s.id === selectedSubCategoryId);

  // If currently in Admin view, render dedicated Admin Dashboard Page!
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboardPage
          onBackToSite={() => {
            setCurrentView('home');
            window.location.hash = '';
          }}
          currentUser={currentUser}
          onLoginAsAdmin={(adminUser) => {
            setCurrentUser(adminUser);
            try {
              localStorage.setItem('awn_current_user', JSON.stringify(adminUser));
            } catch { }
          }}
          listings={listings}
          onUpdateListing={handleUpdateListingFromAdmin}
          onDeleteListing={handleDeleteListingFromAdmin}
          lang={lang}
        />
      </>
    );
  }

  // App Content Component (can be rendered plain or inside phone shell)
  const appContent = (
    <div className={`min-h-screen flex flex-col bg-[#f4f5f7] text-[#1e1e24] ${isAr ? 'rtl' : 'ltr'} text-right`}>
      {/* Header */}
      <Header
        currentRegion={selectedRegion}
        currentCity={selectedCity}
        onOpenRegionModal={() => setIsRegionModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPostAd={() => handleOpenPostAd()}
        onOpenAccount={() => setIsAccountOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => {
          setAuthModalReason(null);
          setIsAuthModalOpen(true);
        }}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '#/admin';
        }}
        viewportMode={viewportMode}
        onToggleViewport={() => setViewportMode((prev) => (prev === 'mobile' ? 'desktop' : 'mobile'))}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        onOpenRules={() => setWarningType('publishing_rules')}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Core Marketplace Directory Layout (Matching Images 1, 2, and 3) */}
        <MourjanMarketplaceView
          categories={categories}
          listings={listings}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          onSelectCategory={(catId, subId) => {
            setSelectedCategoryId(catId);
            setSelectedSubCategoryId(subId);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDetails={handleOpenDetails}
          onRequireLogin={handleRequireLogin}
          currentUser={currentUser}
          selectedRegion={selectedRegion}
          isAr={isAr}
        />

        {/* If in Stage 1 (Home - no category and no subcategory selected):
            Show the full feed / latest listings below the featured section */}
        {!selectedCategoryId && !selectedSubCategoryId && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* Active Filters Bar & Sorter */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">
                  {isAr ? 'أحدث الإعلانات في اليمن' : 'All Listings'}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  {filteredListings.length} {isAr ? 'إعلان متاح' : 'Ads found'}
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    filterTab === 'all'
                      ? 'bg-[#68142c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setFilterTab('premium')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    filterTab === 'premium'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles size={12} />
                  <span>{isAr ? 'مميز' : 'Featured'}</span>
                </button>
                <button
                  onClick={() => setFilterTab(filterTab === 'price_low' ? 'price_high' : 'price_low')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    filterTab === 'price_low' || filterTab === 'price_high'
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

            {/* Listings Feed Cards */}
            {filteredListings.length > 0 ? (
              <div className="space-y-3">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    currentUser={currentUser}
                    onOpenDetails={handleOpenDetails}
                    onRequireLogin={handleRequireLogin}
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
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Help / Quick Navigation */}
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalReason(null);
          setPendingActionAfterLogin(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Listing Details Modal (with contact lock if not logged in) */}
      <ListingDetailsModal
        listing={activeDetailsListing}
        currentUser={currentUser}
        onClose={() => setActiveDetailsListing(null)}
        onOpenLogin={() => {
          setAuthModalReason(isAr ? 'يرجى تسجيل الدخول لعرض رقم الناشر والتواصل معه.' : 'Please log in to view publisher contact.');
          setIsAuthModalOpen(true);
        }}
        onOpenChat={(listing) => {
          if (!currentUser) {
            handleRequireLogin(listing, 'contact');
            return;
          }
          setChatListing(listing);
          setIsChatOpen(true);
        }}
        lang={lang}
      />

      {/* Post Ad Modal */}
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
        initialCategoryId={selectedCategoryId}
        initialSubCatId={selectedSubCategoryId}
        categories={categories}
        lang={lang}
        existingListings={listings}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          try {
            localStorage.setItem('awn_current_user', JSON.stringify(updated));
          } catch { }
        }}
      />

      {/* Location Selector Modal */}
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

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setIsAccountOpen(false);
          setAuthModalReason(null);
          setIsAuthModalOpen(true);
        }}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          try {
            localStorage.setItem('awn_current_user', JSON.stringify(updated));
          } catch { }
        }}
        lang={lang}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        listing={chatListing || activeDetailsListing}
        lang={lang}
      />

      {/* Safety & Posting Rules Modals */}
      {warningType && (
        <MourjanWarningModals
          isOpen={true}
          type={warningType}
          onAgree={() => setWarningType(null)}
          onDisagree={() => setWarningType(null)}
          lang={lang}
        />
      )}

      {/* Onboarding Visual Splash Guide */}
      <OnboardingGuideModal
        isOpen={isOnboardingGuideOpen}
        onClose={() => setIsOnboardingGuideOpen(false)}
        currentUser={currentUser}
        onOpenEditProfile={() => {
          setIsOnboardingGuideOpen(false);
          setIsAccountOpen(true);
        }}
        lang={lang}
      />
    </>
  );
}

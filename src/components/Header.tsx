import React from 'react';
import { Search, Settings, Smartphone, Monitor, PlusCircle, Wallet, Globe, MapPin, User, Shield, LogIn } from 'lucide-react';
import { Region, City } from '../data/yemenRegions';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  currentRegion: Region;
  currentCity?: City;
  onOpenRegionModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPostAd: () => void;
  onOpenAccount: () => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  viewportMode: 'mobile' | 'desktop';
  onToggleViewport: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRegion,
  currentCity,
  onOpenRegionModal,
  searchQuery,
  onSearchChange,
  onOpenPostAd,
  onOpenAccount,
  currentUser,
  onOpenLogin,
  onOpenAdmin,
  viewportMode,
  onToggleViewport,
  lang,
  onToggleLang,
  onOpenRules,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-30 bg-[#68142c] text-white shadow-md">
      {/* Top Utility Ribbon */}
      <div className="bg-[#4d0c1f] text-xs text-amber-200/90 px-4 py-1.5 flex items-center justify-between border-b border-[#7d1c37]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">
            {isAr ? 'عون يمن: الوسيط المجاني للأعمال والخدمات في اليمن' : 'Awn Yemen: Free classifieds & service broker for Yemen'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin shortcut in ribbon */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-100 font-bold transition-colors"
            title={isAr ? 'دخول لوحة تحكم الإدارة' : 'Admin Control Panel'}
          >
            <Shield size={13} className="text-amber-400" />
            <span>{isAr ? 'لوحة التحكم' : 'Admin Panel'}</span>
          </button>

          {/* Device viewport toggle */}
          <button
            onClick={onToggleViewport}
            className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            title={viewportMode === 'mobile' ? 'التبديل إلى عرض الويب' : 'التبديل إلى عرض شاشة الموبايل'}
          >
            {viewportMode === 'mobile' ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span className="hidden sm:inline">
              {viewportMode === 'mobile' ? (isAr ? 'عرض كمبيوتر' : 'Desktop View') : (isAr ? 'عرض هاتف' : 'Mobile View')}
            </span>
          </button>

          {/* Lang toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 hover:text-white transition-colors font-medium"
          >
            <Globe size={13} />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 bg-white rounded-lg p-0.5 shadow-sm overflow-hidden flex items-center justify-center shrink-0 border border-amber-400/40">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_8.27.25_PM_c771822c.jpeg"
              alt="شعار عون يمن"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wide text-white font-['Cairo']">عون يمن</span>
              <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">Awn.Yemen</span>
            </div>
            <p className="text-[11px] text-rose-100/80 font-normal hidden sm:block">
              {isAr ? 'الوسيط المجاني بين مقدم الخدمة وطالبها' : 'Free marketplace between workers and employers'}
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isAr ? 'ما الذي تبحث عنه؟ (وظائف، سيارات، خدمات...)' : 'What are you looking for?'}
              className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <div className={`absolute top-2.5 ${isAr ? 'left-3' : 'right-3'} text-slate-400 pointer-events-none`}>
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* Action icons right side */}
        <div className="flex items-center gap-2">
          {/* Post Ad Button */}
          <button
            onClick={onOpenPostAd}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle size={16} className="text-slate-950" />
            <span>{isAr ? 'نشر إعلان' : 'Post Ad'}</span>
          </button>

          {/* Authentication & User Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                  title={isAr ? 'لوحة تحكم الإدارة' : 'Admin Panel'}
                >
                  <Shield size={14} />
                  <span>{isAr ? 'الإدارة' : 'Admin'}</span>
                </button>
              )}

              <button
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10"
                title={isAr ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                <Settings size={14} className="text-slate-300" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
              title={isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}
            >
              <LogIn size={15} />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mourjan Sub-Header Navigation Bar: Location Selector & Quick Links */}
      <div className="bg-[#591024] px-4 py-1.5 text-xs border-t border-[#791b34]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Region selector pill */}
          <button
            onClick={onOpenRegionModal}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-amber-200 transition-colors"
          >
            {/* Yemen flag SVG */}
            <div className="w-4 h-3 rounded-xs overflow-hidden border border-white/20 flex flex-col shrink-0">
              <div className="h-1 bg-[#ce1126]"></div>
              <div className="h-1 bg-white"></div>
              <div className="h-1 bg-black"></div>
            </div>
            <span className="font-bold text-white">
              {isAr ? `اليَمَن - ${currentRegion.nameAr}` : `Yemen - ${currentRegion.nameEn}`}
              {currentCity ? ` (${isAr ? currentCity.nameAr : currentCity.nameEn})` : ''}
            </span>
            <MapPin size={12} className="text-amber-400" />
            <span className="text-[10px] text-amber-300/80 font-normal underline">
              {isAr ? 'تغيير' : 'Change'}
            </span>
          </button>

          {/* Quick Mourjan Shortcuts */}
          <div className="flex items-center gap-3">
            <button
              onClick={currentUser ? onOpenAccount : onOpenLogin}
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Wallet size={13} className="text-amber-400" />
              <span>
                {currentUser
                  ? `${isAr ? 'الرصيد:' : 'Balance:'} ${currentUser.walletBalanceYer.toLocaleString()} ر.ي`
                  : (isAr ? 'رصيد الحساب' : 'Account Balance')}
              </span>
            </button>

            <button
              onClick={onOpenRules}
              className="hidden sm:inline-block text-rose-200 hover:text-white transition-colors text-[11px]"
            >
              {isAr ? 'قوانين النشر' : 'Posting Rules'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

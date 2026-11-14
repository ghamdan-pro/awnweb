import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronLeft, Eye, Tag, Search, Smartphone } from 'lucide-react';
import { Listing } from '../data/mockListings';
import { AuthUser } from '../types/auth';

interface CompactPublisherCardProps {
  listing: Listing;
  currentUser: AuthUser | null;
  onOpenDetails: (listing: Listing) => void;
  onRequireLogin: (listing: Listing, reason: 'details' | 'contact') => void;
  lang: 'ar' | 'en';
}

export const CompactPublisherCard: React.FC<CompactPublisherCardProps> = ({
  listing,
  onOpenDetails,
  lang,
}) => {
  const isAr = lang === 'ar';
  const primaryMedia = listing.media.find((m) => m.isPrimary) || listing.media[0];

  const handleCardClick = () => {
    onOpenDetails(listing);
  };

  // تمييز نوع الإعلان: عرض (أخضر زمردي) أو طلب (بنفسجي متميز)
  const isRequest =
    (listing as any).adType === 'REQUEST' ||
    listing.sectionType === 'worker_profiles' ||
    (listing as any).sectionType === 'طلب' ||
    (listing as any).isRequest === true;

  const isFeatured =
    listing.status === 'premium' ||
    (listing as any).isFeatured === true ||
    (listing as any).is_featured === true;

  const getBadgeInfo = () => {
    if (isRequest) {
      return {
        text: isAr ? 'طلب' : 'Request',
        color: 'bg-purple-50 text-purple-700 border-purple-300 font-bold',
        cardBorder: 'border-r-4 border-r-purple-500 hover:border-purple-500/60',
        icon: <Search size={12} className="text-purple-600" />,
      };
    } else {
      return {
        text: isAr ? 'عرض' : 'Offer',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        cardBorder: 'border-r-4 border-r-emerald-500 hover:border-emerald-500/60',
        icon: <Tag size={12} className="text-emerald-600" />,
      };
    }
  };

  const badge = getBadgeInfo();

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 p-3 sm:p-4 cursor-pointer flex flex-col sm:flex-row gap-3 sm:gap-4 group relative ${badge.cardBorder}`}
    >
      {/* Compact Image */}
      <div className="relative w-full sm:w-44 h-36 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-slate-100">
        {primaryMedia ? (
          <img
            src={primaryMedia.url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 text-xs">
            {isAr ? 'لا توجد صورة' : 'No photo'}
          </div>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
            <Star size={10} className="fill-slate-950" />
            <span>{isAr ? 'إعلان مميز ★' : 'Featured ★'}</span>
          </div>
        )}

        {/* Category Pill Over Image */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {isAr ? listing.subCategoryNameAr : listing.subCategoryId}
        </div>
      </div>

      {/* Details Body */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Row: Offer/Request Badge, Region, Status */}
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${badge.color}`}
              >
                {badge.icon}
                <span>{badge.text}</span>
              </span>

              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <MapPin size={12} className="text-slate-400" />
                <span className="font-medium">
                  {listing.regionNameAr} - {listing.cityNameAr}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400">{listing.createdAt}</span>
          </div>

          {/* Ad Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#68142c] transition-colors">
            {listing.title}
          </h3>

          {/* Snippet / Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
            {listing.description}
          </p>
        </div>

        {/* Footer: Seller name, Price, Contact Button */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          {/* Seller Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#68142c] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {listing.sellerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate block">
                {listing.sellerName}
              </span>
            </div>
            {listing.sellerVerified && (
              <span title={isAr ? 'معلن موثق' : 'Verified'}>
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              </span>
            )}
          </div>

          {/* Price / Salary or on agreement */}
          <div className="text-left shrink-0">
            {listing.price ? (
              <div className="text-xs sm:text-sm font-black text-[#68142c]">
                {listing.price.toLocaleString()}{' '}
                <span className="text-[10px] font-bold text-slate-500">
                  {listing.currency === 'YER' ? (isAr ? 'ريال' : 'YER') : listing.currency === 'SAR' ? (isAr ? 'ر.س' : 'SAR') : '$'}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                {isAr ? 'عند الاتفاق' : 'Negotiable'}
              </span>
            )}
          </div>

          {/* Quick Contact Actions - بدون إظهار أرقام الهواتف على الويب */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(listing);
              }}
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-[#68142c] border border-amber-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1 text-xs font-bold px-2.5"
              title={isAr ? 'التواصل متاح حصرياً عبر تطبيق الجوال' : 'Contact on Mobile App'}
            >
              <Smartphone size={13} />
              <span>{isAr ? 'تواصل عبر التطبيق' : 'App Contact'}</span>
            </button>

            <button
              onClick={() => onOpenDetails(listing)}
              className="p-1.5 bg-slate-100 hover:bg-[#68142c] hover:text-white text-slate-700 rounded-lg transition-colors flex items-center gap-0.5 text-xs font-bold px-2"
            >
              <span>{isAr ? 'التفاصيل' : 'Details'}</span>
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

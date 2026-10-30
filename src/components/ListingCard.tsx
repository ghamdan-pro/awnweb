import React from 'react';
import { MapPin, Phone, MessageCircle, Bookmark, Star, ShieldCheck, Clock, Lock } from 'lucide-react';
import { Listing } from '../data/mockListings';
import { AuthUser } from '../types/auth';

interface ListingCardProps {
  listing: Listing;
  currentUser: AuthUser | null;
  onOpenDetails: (listing: Listing) => void;
  onRequireLogin: (listing: Listing, reason: 'details' | 'contact') => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  lang: 'ar' | 'en';
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  currentUser,
  onOpenDetails,
  onRequireLogin,
  onToggleBookmark,
  lang,
}) => {
  const isAr = lang === 'ar';
  const primaryMedia = listing.media.find((m) => m.isPrimary) || listing.media[0];

  const handleCardClick = () => {
    if (!currentUser) {
      onRequireLogin(listing, 'details');
    } else {
      onOpenDetails(listing);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireLogin(listing, 'contact');
      return;
    }
    window.location.href = `tel:${listing.contactPhone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireLogin(listing, 'contact');
      return;
    }
    if (!listing.whatsappNumber) return;
    const cleanNumber = listing.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`مرحباً، بخصوص إعلانك على عون يمن: "${listing.title}"`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col sm:flex-row group"
    >

      {/* Thumbnail */}
      <div className="relative sm:w-52 h-44 sm:h-auto bg-slate-100 shrink-0 overflow-hidden">
        {primaryMedia ? (
          <img
            src={primaryMedia.url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
            <span className="text-xs">{isAr ? 'لا توجد صورة' : 'No photo'}</span>
          </div>
        )}

        {/* Status badges */}
        {listing.status === 'premium' && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <Star size={11} className="fill-slate-950" />
            <span>{isAr ? 'إعلان مميز' : 'Featured'}</span>
          </div>
        )}

        {/* Media count pill */}
        {listing.media.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {listing.media.length} {isAr ? 'صور' : 'Photos'}
          </div>
        )}

        {/* Bookmark button */}
        <button
          onClick={(e) => onToggleBookmark(listing.id, e)}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-amber-500 shadow-sm transition-colors"
          title={isAr ? 'حفظ في المفضلة' : 'Bookmark'}
        >
          <Bookmark size={15} className={listing.isBookmarked ? 'fill-amber-500 text-amber-500' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Top category & location line */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#68142c] bg-[#68142c]/10 px-2 py-0.5 rounded-sm">
              {isAr ? listing.subCategoryNameAr : listing.subCategoryId}
            </span>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              <span>{isAr ? `${listing.regionNameAr} - ${listing.cityNameAr}` : listing.cityNameAr}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#68142c] transition-colors">
            {listing.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>

          {/* Attributes tags (if any) */}
          {listing.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {listing.attributes.slice(0, 3).map((attr, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                >
                  <strong className="text-slate-500">{isAr ? attr.labelAr : attr.labelEn}: </strong>
                  {isAr ? attr.valueAr : attr.valueEn}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row: Price, Seller info, Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            {listing.price !== null ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#68142c]">
                  {listing.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {listing.currency === 'YER'
                    ? (isAr ? 'ريال يمني' : 'YER')
                    : listing.currency === 'SAR'
                    ? (isAr ? 'ريال سعودي' : 'SAR')
                    : (isAr ? 'دولار' : 'USD')}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded">
                {isAr ? 'السعر عند الاتفاق' : 'Price on Agreement'}
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-0.5">
              <Clock size={11} />
              <span>{listing.createdAt}</span>
            </div>
          </div>

          {/* Interactive Fast Actions (Call / WhatsApp) */}
          <div className="flex items-center gap-1.5">
            {listing.whatsappNumber && (
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                title={isAr ? 'مراسلة عبر واتساب' : 'WhatsApp'}
              >
                <MessageCircle size={16} />
              </button>
            )}

            <button
              onClick={handleCall}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors ${
                !currentUser
                  ? 'bg-slate-800 hover:bg-slate-900 text-amber-300 border border-slate-700'
                  : 'bg-[#2e7d32] hover:bg-[#256828] text-white'
              }`}
              title={!currentUser ? (isAr ? 'سجل الدخول للاتصال بالمعلن' : 'Login to call seller') : (isAr ? 'اتصال بالمعلن' : 'Call Seller')}
            >
              {!currentUser ? <Lock size={12} className="text-amber-400" /> : <Phone size={13} />}
              <span>{!currentUser ? (isAr ? 'عرض الرقم' : 'Show Phone') : (isAr ? 'اتصال' : 'Call')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

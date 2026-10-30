import React from 'react';
import { MapPin, Phone, MessageCircle, Star, ShieldCheck, Briefcase, UserCheck, Building2, ChevronLeft, Lock } from 'lucide-react';
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
  currentUser,
  onOpenDetails,
  onRequireLogin,
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
    const text = encodeURIComponent(`مرحباً أخي الكريم، أتواصل معك بخصوص إعلانك على عون يمن: "${listing.title}"`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };


  // Badge styling based on sectionType
  const getBadgeInfo = () => {
    switch (listing.sectionType) {
      case 'job_vacancies':
        return {
          text: isAr ? 'فرصة عمل (صاحب عمل)' : 'Job Vacancy',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <Briefcase size={12} className="text-emerald-700" />,
        };
      case 'worker_profiles':
        return {
          text: isAr ? 'كفاءة مهنية (طالب عمل)' : 'Worker Profile',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: <UserCheck size={12} className="text-amber-800" />,
        };
      case 'company_services':
        return {
          text: isAr ? 'خدمات شركات ومؤسسات' : 'Company Services',
          color: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          icon: <Building2 size={12} className="text-indigo-800" />,
        };
      default:
        return {
          text: isAr ? 'إعلان منشور' : 'Published Ad',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <ShieldCheck size={12} className="text-slate-600" />,
        };
    }
  };

  const badge = getBadgeInfo();

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#68142c]/40 transition-all duration-200 p-3 sm:p-4 cursor-pointer flex flex-col sm:flex-row gap-3 sm:gap-4 group relative"
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

        {/* Featured Tag */}
        {listing.status === 'premium' && (
          <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
            <Star size={10} className="fill-slate-950" />
            <span>{isAr ? 'مميز' : 'Featured'}</span>
          </div>
        )}

        {/* Media count */}
        {listing.media.length > 1 && (
          <div className="absolute bottom-1.5 left-1.5 bg-black/65 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {listing.media.length} {isAr ? 'صور' : 'Photos'}
          </div>
        )}
      </div>

      {/* Content & Publisher Summary */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top Line: Badge & Location */}
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
              {badge.icon}
              <span>{badge.text}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              <span className="truncate max-w-[150px]">
                {isAr ? `${listing.regionNameAr} - ${listing.cityNameAr}` : listing.cityNameAr}
              </span>
            </div>
          </div>

          {/* Ad Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#68142c] transition-colors mb-1.5">
            {listing.title}
          </h3>

          {/* Ad Text Snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
            {listing.description}
          </p>

          {/* Specific Highlights (Skills or Corporate CR or Job Benefits) */}
          {listing.workerSkills && listing.workerSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {listing.workerSkills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-[10px] bg-amber-100/70 text-amber-900 font-medium px-1.5 py-0.5 rounded">
                  ✓ {skill}
                </span>
              ))}
            </div>
          )}

          {listing.companyServicesList && listing.companyServicesList.length > 0 && (
            <div className="text-[11px] text-indigo-900 font-medium bg-indigo-50/70 px-2 py-1 rounded border border-indigo-100 mb-2 flex items-center justify-between">
              <span className="truncate">📋 {listing.companyServicesList[0].nameAr}</span>
              <span className="text-[10px] font-bold text-indigo-700 shrink-0">
                +{listing.companyServicesList.length} {isAr ? 'خدمات معتمدة' : 'services'}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Bar: Publisher Identity, Price/Salary & Quick Contact */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
          {/* Publisher Identity */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#68142c] text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
              {listing.sellerName.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-800 block truncate">{listing.sellerName}</span>
              <span className="text-[10px] text-slate-400">{listing.createdAt}</span>
            </div>
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

          {/* Quick Contact Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCall}
              className="p-1.5 bg-[#2e7d32] hover:bg-[#256828] text-white rounded-lg shadow-xs transition-colors flex items-center gap-1 text-xs font-bold px-2.5"
              title={isAr ? 'اتصال مباشر' : 'Call'}
            >
              <Phone size={13} />
              <span className="hidden sm:inline">{isAr ? 'اتصال' : 'Call'}</span>
            </button>

            {listing.whatsappNumber && (
              <button
                onClick={handleWhatsApp}
                className="p-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg shadow-xs transition-colors flex items-center justify-center"
                title={isAr ? 'واتساب' : 'WhatsApp'}
              >
                <MessageCircle size={15} />
              </button>
            )}

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

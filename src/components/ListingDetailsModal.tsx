import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Share2,
  Bookmark,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Building2,
  UserCheck,
  Briefcase,
  FileCheck2,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Lock,
  LogIn,
} from 'lucide-react';
import { Listing } from '../data/mockListings';
import { AuthUser } from '../types/auth';

interface ListingDetailsModalProps {
  listing: Listing | null;
  currentUser: AuthUser | null;
  onClose: () => void;
  onOpenChat: (listing: Listing) => void;
  onOpenLogin: () => void;
  lang: 'ar' | 'en';
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  listing,
  currentUser,
  onClose,
  onOpenChat,
  onOpenLogin,
  lang,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const isAr = lang === 'ar';
  const images =
    listing.media.length > 0
      ? listing.media
      : [
          {
            id: 'placeholder',
            url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
            orderWeight: 0,
          },
        ];

  const handleCall = () => {
    window.location.href = `tel:${listing.contactPhone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    if (!listing.whatsappNumber) return;
    const cleanNumber = listing.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحباً أخي الكريم، أتواصل معك بخصوص إعلانك على عون يمن: "${listing.title}"`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCompanyService = listing.sectionType === 'company_services' || !!listing.companyServicesList;
  const isWorkerProfile = listing.sectionType === 'worker_profiles' || !!listing.workerSkills;
  const isJobVacancy = listing.sectionType === 'job_vacancies';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 relative my-auto">
        {/* Top Header Bar */}
        <div className="bg-[#68142c] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded">
              {isAr ? listing.categoryNameAr : listing.categoryId}
            </span>
            <span className="text-white/40">/</span>
            <span className="text-xs text-rose-100 font-semibold truncate max-w-[200px] sm:max-w-md">
              {isAr ? listing.subCategoryNameAr : listing.subCategoryId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
              title={isAr ? 'مشاركة الإعلان' : 'Share'}
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Desktop Split Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Image Carousel / Slider */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video sm:aspect-16/10 flex items-center justify-center shadow-inner group">
                <img
                  src={images[activeImgIndex]?.url}
                  alt={listing.title}
                  className="w-full h-full object-contain sm:object-cover"
                />

                {/* Slider navigation buttons if > 1 image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  </>
                )}

                {/* Indicator dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === activeImgIndex ? 'bg-amber-400 w-4' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title, Badge & Price Banner */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {listing.sectionType === 'job_vacancies' && (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1">
                      <Briefcase size={13} />
                      <span>{isAr ? 'فرصة عمل شاغرة (صاحب عمل)' : 'Job Vacancy'}</span>
                    </span>
                  )}
                  {listing.sectionType === 'worker_profiles' && (
                    <span className="text-xs font-bold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-md border border-amber-300 flex items-center gap-1">
                      <UserCheck size={13} />
                      <span>{isAr ? 'كفاءة مهنية (طالب عمل)' : 'Worker Profile'}</span>
                    </span>
                  )}
                  {listing.sectionType === 'company_services' && (
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-950 px-2.5 py-1 rounded-md border border-indigo-300 flex items-center gap-1">
                      <Building2 size={13} />
                      <span>{isAr ? 'خدمات شركات ومؤسسات معتمدة' : 'Verified Company'}</span>
                    </span>
                  )}
                  {listing.status === 'premium' && (
                    <span className="text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star size={12} className="fill-slate-950" />
                      <span>{isAr ? 'إعلان مميز' : 'Featured'}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {listing.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {listing.price ? (
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-[#68142c]">
                          {listing.price.toLocaleString()}{' '}
                          <span className="text-sm font-bold text-slate-600">
                            {listing.currency === 'YER'
                              ? isAr
                                ? 'ريال يمني'
                                : 'YER'
                              : listing.currency === 'SAR'
                              ? isAr
                                ? 'ريال سعودي'
                                : 'SAR'
                              : 'دولار أمريكي'}
                          </span>
                        </span>
                        {listing.priceNegotiable && (
                          <span className="text-xs text-emerald-700 font-bold block">
                            ({isAr ? 'السعر قابل للتفاوض' : 'Negotiable'})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-base font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                        {isAr ? 'السعر أو الراتب عند الاتفاق' : 'Price on Agreement'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <MapPin size={14} className="text-[#68142c]" />
                    <span className="font-bold text-slate-800">
                      {isAr
                        ? `${listing.regionNameAr} - ${listing.cityNameAr}`
                        : `${listing.regionId} - ${listing.cityId}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  بطاقة متكاملة خاصة بخدمات الشركات (CRITICAL: Company Services & Portfolio)
                 ========================================================================= */}
              {isCompanyService && (
                <div className="space-y-4">
                  {/* Accreditation Bar */}
                  <div className="bg-gradient-to-r from-indigo-900 to-[#4d0c1f] text-white p-4 rounded-xl shadow-sm border border-indigo-700/60 flex items-start gap-3">
                    <Building2 className="w-8 h-8 text-amber-300 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-sm text-amber-300">
                          {isAr ? 'اعتماد وترخيص المنشأة التجارية' : 'Company Accreditation'}
                        </h4>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>{isAr ? 'موثق رسمياً' : 'Verified'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-indigo-100 font-medium">
                        {listing.companyCrNumber || (isAr ? 'سجل تجاري نظامي ساري المفعول' : 'Commercial Record')}
                      </p>
                      {listing.companyCoverageAreas && (
                        <div className="text-[11px] text-amber-200/90 pt-1 flex items-center gap-1 flex-wrap">
                          <span className="font-bold">{isAr ? 'نطاق التغطية:' : 'Coverage:'}</span>
                          <span>{listing.companyCoverageAreas.join(' • ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1. قائمة الخدمات المنشورة (Published Services) */}
                  {listing.companyServicesList && listing.companyServicesList.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                        <h3 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                          <Layers size={16} className="text-indigo-600" />
                          <span>{isAr ? 'قائمة الخدمات المنشورة والمعتمدة' : 'Published Services'}</span>
                        </h3>
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full">
                          {listing.companyServicesList.length} {isAr ? 'خدمات' : 'services'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {listing.companyServicesList.map((srv) => (
                          <div
                            key={srv.id}
                            className="bg-indigo-50/40 p-3 rounded-lg border border-indigo-100/80 hover:bg-indigo-50 transition-colors"
                          >
                            <h4 className="font-bold text-xs sm:text-sm text-indigo-950 mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                              <span>{srv.nameAr}</span>
                            </h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed mb-1.5">
                              {srv.descriptionAr}
                            </p>
                            {srv.priceEstimate && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                                💰 {srv.priceEstimate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. سجل الأعمال والمشاريع السابقة (Portfolio & Track Record) */}
                  {listing.companyPortfolio && listing.companyPortfolio.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Award size={16} className="text-amber-600" />
                          <span>{isAr ? 'سجل الأعمال والمشاريع السابقة (Portfolio)' : 'Track Record'}</span>
                        </h3>
                        <span className="text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full">
                          {listing.companyPortfolio.length} {isAr ? 'مشاريع منفذة' : 'projects'}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {listing.companyPortfolio.map((proj) => (
                          <div
                            key={proj.id}
                            className="bg-amber-50/30 p-3 rounded-lg border border-amber-100 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                {proj.titleAr}
                              </h4>
                              <p className="text-[11px] text-slate-600">
                                <strong className="text-slate-700">{isAr ? 'العميل / الجهة:' : 'Client:'}</strong>{' '}
                                {proj.clientOrProject}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                {proj.scopeAr}
                              </p>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded shrink-0 flex items-center gap-1">
                              <Calendar size={11} />
                              <span>{proj.year}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Worker Profile Specifics */}
              {isWorkerProfile && listing.workerSkills && listing.workerSkills.length > 0 && (
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200 space-y-3">
                  <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                    <UserCheck size={16} className="text-amber-700" />
                    <span>{isAr ? 'المهارات والخبرات المهنية للمعلن' : 'Professional Skills'}</span>
                  </h3>

                  {listing.workerExperienceYears && (
                    <div className="text-xs text-slate-700">
                      <strong>{isAr ? 'الخبرة العملية:' : 'Experience:'}</strong>{' '}
                      <span className="font-bold text-slate-900">{listing.workerExperienceYears}</span>
                    </div>
                  )}

                  {listing.travelReadiness && (
                    <div className="text-xs text-slate-700">
                      <strong>{isAr ? 'الاستعداد للعمل / السفر:' : 'Availability:'}</strong>{' '}
                      <span className="font-bold text-emerald-800">{listing.travelReadiness}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      {isAr ? 'قائمة المهارات التخصصية:' : 'Skills:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.workerSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="bg-white text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200 shadow-xs"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Attributes Specifications Grid */}
              {listing.attributes.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#68142c]"></span>
                    <span>{isAr ? 'المواصفات والتفاصيل الأساسية' : 'Specifications'}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.attributes.map((attr, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs"
                      >
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          {isAr ? attr.labelAr : attr.labelEn}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {isAr ? attr.valueAr : attr.valueEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#68142c]"></span>
                  <span>{isAr ? 'نص الإعلان والوصف التفصيلي' : 'Description'}</span>
                </h3>
                <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Safety notice */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-normal">
                  <strong>{isAr ? 'تنويه أمان عون يمن:' : 'Safety Notice:'}</strong>{' '}
                  {isAr
                    ? 'يرجى الحذر وعدم تحويل أي أموال مسبقاً قبل معاينة السلعة أو استلام الخدمة على أرض الواقع. عون يمن وسيط مجاني ولا يطلب أي بيانات بنكية أو تحويلات مجهولة.'
                    : 'Please inspect the product or service in person before transferring funds. Awn Yemen is a free broker and never asks for bank credentials.'}
                </div>
              </div>
            </div>

            {/* Desktop Persistent Sidebar */}
            <div className="hidden lg:block lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 sticky top-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#68142c] text-white flex items-center justify-center font-black text-xl border-2 border-amber-400">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{listing.sellerName}</h4>
                    <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold mt-0.5">
                      <ShieldCheck size={14} />
                      <span>{isAr ? 'معلن موثق في عون يمن' : 'Verified Seller'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>{isAr ? 'نوع الحساب:' : 'Account Type:'}</span>
                    <strong className="text-slate-800">
                      {listing.sellerType === 'personal'
                        ? isAr
                          ? 'حساب شخصي'
                          : 'Personal'
                        : listing.sellerType === 'company'
                        ? isAr
                          ? 'شركة ومؤسسة'
                          : 'Company'
                        : isAr
                        ? 'وكالة'
                        : 'Agency'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'تاريخ النشر:' : 'Posted:'}</span>
                    <strong className="text-slate-800">{listing.createdAt}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'المشاهدات:' : 'Views:'}</span>
                    <strong className="text-slate-800">{listing.viewsCount}</strong>
                  </div>
                </div>

                {/* Primary Direct Contact Buttons */}
                {currentUser ? (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCall}
                      className="w-full flex items-center justify-center gap-2 bg-[#2e7d32] hover:bg-[#256828] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-sm active:scale-95"
                    >
                      <Phone size={18} />
                      <span>{isAr ? `اتصال هاتفي: ${listing.contactPhone}` : `Call: ${listing.contactPhone}`}</span>
                    </button>

                    {listing.whatsappNumber && (
                      <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-sm active:scale-95"
                      >
                        <MessageCircle size={18} />
                        <span>{isAr ? 'مراسلة عبر واتساب' : 'Chat via WhatsApp'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenChat(listing)}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#68142c] font-bold py-2.5 px-4 rounded-xl border-2 border-[#68142c] transition-colors text-sm"
                    >
                      <MessageSquare size={17} />
                      <span>{isAr ? 'محادثة داخلية في التطبيق' : 'Chat in App'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-3 pt-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-amber-950">
                        {isAr ? 'بيانات التواصل مع الناشر مقفلة' : 'Publisher contact details locked'}
                      </h5>
                      <p className="text-[11px] text-amber-900/80 mt-1 leading-normal">
                        {isAr
                          ? 'أرقام الهاتف والواتساب والمحادثة تظهر فقط بعد تسجيل الدخول لحماية خصوصية المعلنين.'
                          : 'Phone & WhatsApp are hidden until you log in.'}
                      </p>
                    </div>
                    <button
                      onClick={onOpenLogin}
                      className="w-full py-2.5 bg-[#68142c] hover:bg-[#520f23] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <LogIn size={15} />
                      <span>{isAr ? 'تسجيل الدخول لعرض أرقام التواصل' : 'Log In to View Contact Info'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Viewport: Fixed Bottom Contact Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                onClick={handleCall}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2e7d32] active:bg-[#256828] text-white font-black py-3 px-3 rounded-xl shadow-md text-sm transition-transform active:scale-95"
              >
                <Phone size={18} />
                <span>{isAr ? 'اتصال هاتفي' : 'Call'}</span>
              </button>

              {listing.whatsappNumber && (
                <button
                  onClick={handleWhatsApp}
                  className="p-3 bg-[#25d366] text-white rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center"
                  title={isAr ? 'واتساب' : 'WhatsApp'}
                >
                  <MessageCircle size={20} />
                </button>
              )}

              <button
                onClick={() => onOpenChat(listing)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-[#68142c] text-[#68142c] font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-transform active:scale-95"
              >
                <MessageSquare size={17} />
                <span>{isAr ? 'محادثة داخلية' : 'Chat in App'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#68142c] hover:bg-[#520f23] text-white font-black py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm active:scale-98"
            >
              <Lock size={16} className="text-amber-300" />
              <span>{isAr ? 'سجل الدخول لعرض رقم الناشر والتواصل' : 'Log In to View Phone & Contact'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

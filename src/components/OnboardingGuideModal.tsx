import React, { useState } from 'react';
import {
  X,
  Sparkles,
  PhoneCall,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { AuthUser } from '../types/auth';

interface OnboardingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onOpenEditProfile: () => void;
  lang: 'ar' | 'en';
}

export const OnboardingGuideModal: React.FC<OnboardingGuideModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenEditProfile,
  lang,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const slides = [
    {
      icon: <Sparkles size={36} className="text-amber-500" />,
      badge: isAr ? 'مرحباً بك في عون يمن 🇾🇪' : 'Welcome to Awn Yemen',
      title: isAr
        ? 'عون يمن... منصتك للوظائف والخدمات والتسويق في مكان واحد'
        : 'Awn Yemen... Your One-Stop Platform for Jobs, Services & Marketing',
      description: isAr
        ? 'وظائف: اكتشف الفرص الوظيفية وفرص العمل المتنوعة . \nخدمات: ابحث عن الخدمات أو اعرض خدماتك. \nتسويق: أعلن عن منتجاتك وسوّقها بسهولة.'
        : 'Jobs: Explore job vacancies and diverse opportunities | Services: Find services or offer yours | Marketing: Promote and sell your products easily.',
      highlight: isAr ? 'كل ما تحتاجه ... في عون يمن' : 'Everything you need ... in Awn Yemen',
    },
    {
      icon: <Briefcase size={36} className="text-amber-500" />,
      badge: isAr ? 'المهنيين وأصحاب الأعمال' : 'Professionals & Employers',
      title: isAr
        ? currentUser?.accountType === 'company'
          ? 'أنشئ إعلاناتك واستقطب أمهر الكوادر اليمنية'
          : 'أبرز مهنتك وخبراتك واستقبل عروض العمل'
        : 'Connect with verified job vacancies & skilled talents',
      description: isAr
        ? 'سواء كنت شيفاً، مهندساً، حرفياً، أو صاحب منشأة تبحث عن كوادر، تتيح لك المنصة تحديد مهاراتك وموقعك بالمحافظة والمديرية.'
        : 'Highlight your professional skills, work experience, readiness to travel, and connect with direct employers.',
      highlight: isAr ? 'إعلانات مخصصة للمهنيين وللشركات بمرونة عالية' : 'Tailored forms for skilled workers and corporate listings',
    },
    {
      icon: <PhoneCall size={36} className="text-emerald-500" />,
      badge: isAr ? 'التواصل المباشر والآمن' : 'Direct & Safe Contact',
      title: isAr ? 'أرقام الهاتف والواتساب مفتوحة لك الآن' : 'Direct Phone & WhatsApp Access',
      description: isAr
        ? 'بصفتك مستخدماً مسجلاً، يمكنك الآن الاتصال المباشر بأي معلن أو مراسلته عبر واتساب بدون وسطاء أو رسوم خفية.'
        : 'As a verified registered user, you can now directly call publishers or chat via WhatsApp without intermediaries.',
      highlight: isAr ? 'اتصال مباشر وسريع بنقرة زر واحدة' : 'Instant 1-click calling and WhatsApp chat',
    },
    {
      icon: <ShieldCheck size={36} className="text-blue-500" />,
      badge: isAr ? 'حماية وأمان الخصوصية' : 'Privacy Protection',
      title: isAr ? 'رقم هاتفك محمي ولا يُنشر إلا بموافقتك' : 'Your Phone Privacy is Respected',
      description: isAr
        ? 'عند نشر أي إعلان، نطلب منك موافقة صريحة لإظهار رقمك. كما أن أرقامك محجوبة عن الزوار العابرين لحمايتك من الاتصالات العشوائية.'
        : 'Your contact details are strictly hidden from unauthenticated bots and guests to prevent spam.',
      highlight: isAr ? 'بياناتك الشخصية في أمان تام ومحفوظة بحسابك' : 'Full control over your public profile & phone number',
    },
  ];

  const currentSlideData = slides[activeSlide];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('awn_has_seen_guide', 'true');
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="p-4 bg-[#68142c] text-white flex items-center justify-between">
          <span className="text-[11px] font-bold px-3 py-1 bg-amber-400 text-slate-900 rounded-full shadow-xs">
            {currentSlideData.badge}
          </span>
          <button
            onClick={handleFinish}
            className="p-1 rounded-full text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Animated Icon Glow */}
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center shadow-md relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-500/10 animate-pulse"></div>
            {currentSlideData.icon}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-[#68142c] font-['Cairo']">
              {currentSlideData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto whitespace-pre-line">
              {currentSlideData.description}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-[#68142c] font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
            <span>{currentSlideData.highlight}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-8 bg-[#68142c]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              handleFinish();
              onOpenEditProfile();
            }}
            className="text-xs font-bold text-slate-600 hover:text-[#68142c] flex items-center gap-1.5 transition-colors order-2 sm:order-1"
          >
            <Edit3 size={14} />
            <span>{isAr ? 'تعديل اسمي وبياناتي الشخصية' : 'Edit My Profile'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            {activeSlide > 0 && (
              <button
                type="button"
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#68142c] to-[#8b203e] hover:from-[#560f23] hover:to-[#68142c] text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>{activeSlide === slides.length - 1 ? (isAr ? 'ابدأ الاستخدام الآن 🚀' : 'Start Now') : (isAr ? 'التالي' : 'Next')}</span>
              {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      icon: <Sparkles size={36} className="text-amber-400" />,
      badge: isAr ? 'مرحباً بك في عون يمن' : 'Welcome to Awn Yemen',
      title: isAr
        ? `أهلاً بك يا ${currentUser?.name || 'صديقنا'} في منصتك الموحدة`
        : `Welcome ${currentUser?.name || 'Friend'} to Awn Yemen`,
      description: isAr
        ? 'المنصة الأولى الموحدة في اليمن للوظائف، الكوادر والمهنيين، الخدمات، السيارات، والعقارات بكل شفافية وسرعة.'
        : 'The leading classifieds & jobs marketplace in Yemen connecting talents, companies, and direct sellers.',
      highlight: isAr ? 'تصفح الآلاف من الإعلانات في محافظات الجمهورية' : 'Browse thousands of verified listings across all governorates',
    },
    {
      icon: <Briefcase size={36} className="text-amber-400" />,
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
      icon: <PhoneCall size={36} className="text-emerald-400" />,
      badge: isAr ? 'التواصل المباشر والآمن' : 'Direct & Safe Contact',
      title: isAr ? 'أرقام الهاتف والواتساب مفتوحة لك الآن' : 'Direct Phone & WhatsApp Access',
      description: isAr
        ? 'بصفتك مستخدماً مسجلاً، يمكنك الآن الاتصال المباشر بأي معلن أو مراسلته عبر واتساب بدون وسطاء أو رسوم خفية.'
        : 'As a verified registered user, you can now directly call publishers or chat via WhatsApp without intermediaries.',
      highlight: isAr ? 'اتصال مباشر وسريع بنقرة زر واحدة' : 'Instant 1-click calling and WhatsApp chat',
    },
    {
      icon: <ShieldCheck size={36} className="text-blue-400" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-bold px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
            {currentSlideData.badge}
          </span>
          <button
            onClick={handleFinish}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Animated Icon Glow */}
          <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center shadow-lg relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-500/10 animate-pulse"></div>
            {currentSlideData.icon}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white font-['Cairo']">
              {currentSlideData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {currentSlideData.description}
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-amber-300 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
            <span>{currentSlideData.highlight}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              handleFinish();
              onOpenEditProfile();
            }}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors order-2 sm:order-1"
          >
            <Edit3 size={14} />
            <span>{isAr ? 'تعديل اسمي وبياناتي الشخصية' : 'Edit My Profile'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            {activeSlide > 0 && (
              <button
                type="button"
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
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

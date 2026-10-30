import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Trash2,
  BookmarkCheck,
  Sparkles,
  Building2,
  UserCheck,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { CATEGORIES, Category, SubCategory } from '../data/categoriesData';
import { Region, City } from '../data/yemenRegions';
import { Listing, ListingSectionType } from '../data/mockListings';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: Region;
  currentCity?: City;
  onAdCreated: (newAd: Listing) => void;
  initialSection?: ListingSectionType;
  initialSubCatId?: string;
  lang: 'ar' | 'en';
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  currentCity,
  onAdCreated,
  initialSection,
  initialSubCatId,
  lang,
}) => {
  const isAr = lang === 'ar';

  // Form State
  const [selectedCatId, setSelectedCatId] = useState<string>('jobs');
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>(initialSubCatId || 'jobs-culinary');
  const [sectionType, setSectionType] = useState<ListingSectionType>(initialSection || 'job_vacancies');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<'YER' | 'SAR' | 'USD'>('YER');
  const [purpose, setPurpose] = useState<'call_me' | 'message_me' | 'both'>('both');
  const [phone, setPhone] = useState('+967 7');
  const [email, setEmail] = useState('');
  const [sellerName, setSellerName] = useState('معلن في عون');

  // Corporate Services inputs
  const [companyCr, setCompanyCr] = useState('');
  const [companyServicesText, setCompanyServicesText] = useState('');
  const [companyPortfolioText, setCompanyPortfolioText] = useState('');

  // Worker Profile inputs
  const [workerSkillsText, setWorkerSkillsText] = useState('');
  const [workerExpYears, setWorkerExpYears] = useState('');
  const [travelReadiness, setTravelReadiness] = useState('مستعد للعمل فوراً');

  // Dynamic Specs Map
  const [specs, setSpecs] = useState<Record<string, string>>({});

  // Image Slots
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    '/assets/aistudio/WhatsApp_Image_2026-10-26_at_10.38.17_PM_f6350e73.jpeg',
  ]);

  // Validation errors & Phone consent
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialSection) setSectionType(initialSection);
    if (initialSubCatId) setSelectedSubCatId(initialSubCatId);
  }, [initialSection, initialSubCatId]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  const currentSub =
    currentCategory.subcategories.find((s) => s.id === selectedSubCatId) ||
    currentCategory.subcategories[0];

  const handleAddImagePlaceholder = () => {
    if (uploadedImages.length >= 10) return;
    const sampleUrls = [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    ];
    const nextUrl = sampleUrls[uploadedImages.length % sampleUrls.length];
    setUploadedImages([...uploadedImages, nextUrl]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = isAr ? 'يرجى إدخال عنوان الإعلان' : 'Title is required';
    if (!description.trim()) errs.description = isAr ? 'يرجى كتابة وصف تفصيلي للإعلان' : 'Description is required';
    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone = isAr ? 'يرجى كتابة رقم الهاتف للتواصل' : 'Valid phone is required';
    }
    if (!phoneConsent) {
      errs.phoneConsent = isAr
        ? 'يجب الموافقة على مشاركة رقم هاتفك مع هذا الإعلان للتواصل قبل النشر'
        : 'Consent to share phone number with listing is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = (status: 'active' | 'premium' | 'draft') => {
    if (status !== 'draft' && !validate()) {
      return;
    }

    const dynamicAttrsList = Object.entries(specs).map(([k, v]) => ({
      key: k,
      labelAr: k,
      valueAr: String(v ?? ''),
      labelEn: k,
      valueEn: String(v ?? ''),
    }));

    // Parse corporate services if provided
    const servicesList = companyServicesText.trim()
      ? companyServicesText
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((srv, idx) => ({
            id: `srv-${Date.now()}-${idx}`,
            nameAr: srv.trim(),
            descriptionAr: isAr ? 'خدمة معتمدة ومتكاملة مقدمة للشركات والجهات' : 'Certified Service',
            priceEstimate: isAr ? 'حسب الاتفاق ونطاق العمل' : 'Negotiable',
          }))
      : undefined;

    // Parse portfolio if provided
    const portfolioList = companyPortfolioText.trim()
      ? companyPortfolioText
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((proj, idx) => ({
            id: `proj-${Date.now()}-${idx}`,
            titleAr: proj.trim(),
            clientOrProject: isAr ? 'عملاء ومؤسسات سابقة' : 'Corporate Clients',
            year: '2024 - 2026',
            scopeAr: isAr ? 'تنفيذ وتسليم متكامل وفق المعايير' : 'Fully delivered',
          }))
      : undefined;

    // Parse worker skills if provided
    const skillsList = workerSkillsText.trim()
      ? workerSkillsText.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean)
      : undefined;

    const newAd: Listing = {
      id: `listing-${Date.now()}`,
      title: title || (isAr ? 'إعلان جديد بدون عنوان' : 'Untitled Draft'),
      description: description || (isAr ? 'مسودة إعلان' : 'Draft listing'),
      categoryId: selectedCatId,
      categoryNameAr: currentCategory.nameAr,
      subCategoryId: selectedSubCatId,
      subCategoryNameAr: currentSub.nameAr,
      sectionType,

      // Corporate Services
      companyCrNumber: companyCr ? `س.ت: ${companyCr}` : undefined,
      companyLicenseBadge: companyCr ? (isAr ? 'منشأة معتمدة رسمياً' : 'Verified Company') : undefined,
      companyServicesList: servicesList,
      companyPortfolio: portfolioList,
      companyCoverageAreas: [currentRegion.nameAr],

      // Worker profile
      workerTitle: title,
      workerExperienceYears: workerExpYears || undefined,
      workerSkills: skillsList,
      travelReadiness,

      price: price ? parseFloat(price) : null,
      currency,
      priceNegotiable: true,
      countryId: 'ye',
      regionId: currentRegion.id,
      regionNameAr: currentRegion.nameAr,
      cityId: currentCity?.id || 'city-default',
      cityNameAr: currentCity?.nameAr || (isAr ? 'المركز' : 'Center'),
      status: status === 'draft' ? 'pending' : status,
      purpose,
      contactPhone: phone,
      contactEmail: email || undefined,
      whatsappNumber: phone,
      sellerName: sellerName || (isAr ? 'معلن في عون' : 'Awn Seller'),
      sellerType: sectionType === 'company_services' ? 'company' : 'personal',
      sellerVerified: true,
      sellerRating: 5.0,
      createdAt: isAr ? 'الآن' : 'Just now',
      viewsCount: 1,
      attributes: dynamicAttrsList,
      media: uploadedImages.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url,
        isPrimary: idx === 0,
        orderWeight: idx,
      })),
    };

    onAdCreated(newAd);
    setSuccessNotice(
      status === 'premium'
        ? isAr
          ? 'تم نشر إعلانك المميز بنجاح في عون يمن!'
          : 'Featured ad published!'
        : status === 'draft'
        ? isAr
          ? 'تم حفظ الإعلان في المسودات بنجاح!'
          : 'Saved to drafts!'
        : isAr
        ? 'تم نشر الإعلان بنجاح في القسم المختار وهو متاح للجميع الآن!'
        : 'Ad published successfully!'
    );

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-[#68142c] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-lg">✦</span>
            <h2 className="font-bold text-base sm:text-lg font-['Cairo']">
              {isAr ? 'نشر إعلان جديد في عون يمن' : 'Post a New Ad on Awn Yemen'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {successNotice && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* 1. Category & Subcategory Selectors */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="text-xs sm:text-sm font-bold text-slate-900 block">
              {isAr ? '1. اختيار القسم الرئيسي والفرعي' : '1. Category & Subcategory'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-500 block mb-1 font-semibold">
                  {isAr ? 'القسم الرئيسي' : 'Main Category'}
                </span>
                <select
                  value={selectedCatId}
                  onChange={(e) => {
                    const cat = CATEGORIES.find((c) => c.id === e.target.value);
                    setSelectedCatId(e.target.value);
                    if (cat && cat.subcategories[0]) {
                      setSelectedSubCatId(cat.subcategories[0].id);
                    }
                    setSpecs({});
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#68142c]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1 font-semibold">
                  {isAr ? 'القسم الفرعي' : 'Subcategory'}
                </span>
                <select
                  value={selectedSubCatId}
                  onChange={(e) => {
                    setSelectedSubCatId(e.target.value);
                    setSpecs({});
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#68142c]"
                >
                  {currentCategory.subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isAr ? s.nameAr : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. الأقسام الثلاثة الرئيسية (Crucial Section Type Selector) */}
          <div className="bg-gradient-to-r from-amber-50/60 to-rose-50/60 p-4 rounded-xl border border-amber-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 block">
                {isAr ? '2. حدد نوع وطبيعة الإعلان بدقة:' : '2. Select Ad Type & Section:'}
              </label>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">
                {isAr ? 'مهم جداً' : 'Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSectionType('job_vacancies')}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                  sectionType === 'job_vacancies'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Briefcase size={14} />
                  <span>{isAr ? 'فرصة عمل شاغرة' : 'Job Vacancy'}</span>
                </div>
                <span className={`text-[10px] leading-tight ${sectionType === 'job_vacancies' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {isAr ? 'أصحاب عمل يطلبون موظفين' : 'Employer hiring'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSectionType('worker_profiles')}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                  sectionType === 'worker_profiles'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck size={14} />
                  <span>{isAr ? 'كفاءة مهنية (عامل)' : 'Worker Profile'}</span>
                </div>
                <span className={`text-[10px] leading-tight ${sectionType === 'worker_profiles' ? 'text-amber-100' : 'text-slate-500'}`}>
                  {isAr ? 'أعرض مهاراتي للتوظيف' : 'Job seeker / Artisan'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSectionType('company_services')}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                  sectionType === 'company_services'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Building2 size={14} />
                  <span>{isAr ? 'خدمات شركات' : 'Company Services'}</span>
                </div>
                <span className={`text-[10px] leading-tight ${sectionType === 'company_services' ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {isAr ? 'عروض شركات ومؤسسات' : 'Corporate offerings'}
                </span>
              </button>
            </div>
          </div>

          {/* Special Corporate Services Inputs */}
          {sectionType === 'company_services' && (
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Building2 size={15} className="text-indigo-700" />
                <span>{isAr ? 'بيانات الشركة والاعتماد التجاري وسجل الأعمال' : 'Company Details & Track Record'}</span>
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'رقم السجل التجاري أو الترخيص الرسمي' : 'Commercial Registration (CR)'}
                </label>
                <input
                  type="text"
                  value={companyCr}
                  onChange={(e) => setCompanyCr(e.target.value)}
                  placeholder={isAr ? 'مثال: س.ت: 104829 / صنعاء' : 'CR Number'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'قائمة الخدمات المنشورة (اكتب كل خدمة في سطر جديد)' : 'Services List (one per line)'}
                </label>
                <textarea
                  rows={3}
                  value={companyServicesText}
                  onChange={(e) => setCompanyServicesText(e.target.value)}
                  placeholder={isAr ? 'مثال:\nتموين بوفيه مفتوح للمؤتمرات\nإعداد ولائم الأعراس والمناسبات\nتجهيز وصيانة المطابخ الفندقية' : 'List services'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'سجل الأعمال والخبرات والمشاريع المنفذة' : 'Portfolio / Key Clients'}
                </label>
                <textarea
                  rows={2}
                  value={companyPortfolioText}
                  onChange={(e) => setCompanyPortfolioText(e.target.value)}
                  placeholder={isAr ? 'مثال: إعاشة ملتقى المصارف الأول (1,400 ضيف)، تجهيز مطابخ فندق كورال عدن' : 'Projects portfolio'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* Special Worker Profile Inputs */}
          {sectionType === 'worker_profiles' && (
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <UserCheck size={15} className="text-amber-800" />
                <span>{isAr ? 'بيانات الكفاءة والمهارات التخصصية' : 'Worker Skills & Experience'}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isAr ? 'سنوات الخبرة' : 'Years of Experience'}
                  </label>
                  <input
                    type="text"
                    value={workerExpYears}
                    onChange={(e) => setWorkerExpYears(e.target.value)}
                    placeholder={isAr ? 'مثال: 8 سنوات خبرة ممتازة' : 'e.g. 8 years'}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isAr ? 'الاستعداد للعمل والسفر' : 'Travel / Availability'}
                  </label>
                  <input
                    type="text"
                    value={travelReadiness}
                    onChange={(e) => setTravelReadiness(e.target.value)}
                    placeholder={isAr ? 'مستعد للسفر فوراً / داخل اليمن فقط' : 'Ready immediately'}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'أهم المهارات التخصصية (افصل بينها بفواصل)' : 'Key Skills (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={workerSkillsText}
                  onChange={(e) => setWorkerSkillsText(e.target.value)}
                  placeholder={isAr ? 'مثال: طبخ ذبايح، رز مندي، بشاور، زربيان، إدارة مطابخ' : 'Skills'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* 3. Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                {isAr ? 'عنوان الإعلان الواضح' : 'Ad Title'} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAr ? 'مثال: شيف طباخ ذبايح ورز مندي ومناسبات، أو مطلوب معلم باريستا' : 'Enter title'}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#68142c]"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                {isAr ? 'نص الإعلان والوصف التفصيلي' : 'Ad Description'} *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isAr ? 'اكتب كافة تفاصيل الإعلان وشروط العمل أو الخدمات المقدمة وطريقة التواصل...' : 'Write full ad details...'}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm leading-relaxed focus:ring-2 focus:ring-[#68142c]"
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* 4. Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {isAr ? 'السعر أو الراتب المتوقع (اتركه فارغاً إن كان عند الاتفاق)' : 'Price or Expected Salary'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={isAr ? 'مثال: 4500 أو 320000' : 'Amount'}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {isAr ? 'العملة' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-800"
              >
                <option value="YER">{isAr ? 'ريال يمني (YER)' : 'YER'}</option>
                <option value="SAR">{isAr ? 'ريال سعودي (SAR)' : 'SAR'}</option>
                <option value="USD">{isAr ? 'دولار أمريكي (USD)' : 'USD'}</option>
              </select>
            </div>
          </div>

          {/* 5. Contact Info */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block">
              {isAr ? 'معلومات التواصل والناشر' : 'Contact Details'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'اسم المعلن / اسم الشركة' : 'Seller or Company Name'}
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {isAr ? 'رقم الهاتف (اتصال وواتساب)' : 'Phone Number'} *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+967 7..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* 6. Upload Photo Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 block">
                {isAr ? 'صور الإعلان' : 'Photos'}
              </label>
              <span className="text-[11px] text-slate-500">
                {uploadedImages.length}/10 {isAr ? 'صور مضافة' : 'photos'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {uploadedImages.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddImagePlaceholder}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#68142c] bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center shrink-0 transition-all text-slate-500 hover:text-[#68142c]"
                >
                  <Plus size={22} />
                  <span className="text-[10px] font-bold mt-1">{isAr ? 'إضافة صورة' : 'Add Slot'}</span>
                </button>
              )}

              {uploadedImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 group bg-slate-100"
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors opacity-90"
                    title={isAr ? 'حذف الصورة' : 'Remove'}
                  >
                    <X size={12} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#68142c] text-white text-[9px] text-center font-bold py-0.5">
                      {isAr ? 'الرئيسية' : 'Cover'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Phone Sharing Consent (Requested by user) */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              errors.phoneConsent
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-300'
                : 'bg-amber-50/80 border-amber-200 shadow-2xs'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={phoneConsent}
                onChange={(e) => {
                  setPhoneConsent(e.target.checked);
                  if (errors.phoneConsent) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.phoneConsent;
                      return next;
                    });
                  }
                }}
                className="mt-1 w-4 h-4 rounded text-[#68142c] focus:ring-[#68142c] shrink-0"
              />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-900 block leading-snug">
                  {isAr
                    ? 'أوافق وأصرّح بمشاركة رقم هاتفي مع هذا الإعلان لتمكين المهتمين من التواصل معي هاتفياً أو عبر واتساب *'
                    : 'I consent to sharing my phone number with this listing for direct calls & WhatsApp *'}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isAr
                    ? '🔒 تنبيه خصوصية وأمان: رقم هاتفك سيكون محمياً ومحجوباً عن الزوار والبرمجيات الخبيثة، ولن يظهر إلا للمستخدمين المسجلين في منصة عون يمن لحمايتك من الاتصالات العشوائية.'
                    : '🔒 Privacy Notice: Your phone number is shielded from guests and bots, visible only to signed-in members.'}
                </p>
                {errors.phoneConsent && (
                  <p className="text-rose-600 font-bold text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠ {errors.phoneConsent}</span>
                  </p>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-bold transition-colors"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={() => handlePublish('draft')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
          >
            {isAr ? 'حفظ كمسودة' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={() => handlePublish('active')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
          >
            {isAr ? 'نشر الإعلان الآن' : 'Publish Ad Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Trash2,
  BookmarkCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Layers,
  MapPin,
  FileText,
  Lock,
  Phone,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, Category } from '../data/categoriesData';
import { COUNTRIES, Region, City } from '../data/yemenRegions';
import { Listing, ListingSectionType } from '../data/mockListings';
import { AuthUser } from '../types/auth';
import { apiService } from '../services/apiService';
import { moderateAdContent } from '../utils/contentModeration';
import { API_CONFIG } from '../config/apiConfig';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: Region;
  currentCity?: City;
  onAdCreated: (newAd: Listing) => void;
  initialSection?: ListingSectionType;
  initialCategoryId?: string;
  initialSubCatId?: string;
  lang: 'ar' | 'en';
  existingListings?: Listing[];
  currentUser?: AuthUser | null;
  onUpdateUser?: (updated: AuthUser) => void;
  categories?: Category[];
}

const uploadImageToSupabase = async (file: File): Promise<string> => {
  const originalName = (file.name || 'listing-image').trim();
  const extension = originalName.includes('.')
    ? originalName.split('.').pop()?.toLowerCase() || 'jpg'
    : 'jpg';

  const safeName = originalName
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_+/g, '_');

  const objectKey = `${Date.now()}_${safeName || `listing_${Date.now()}.${extension}`}`;
  const mimeType =
    extension === 'png'
      ? 'image/png'
      : extension === 'webp'
      ? 'image/webp'
      : extension === 'gif'
      ? 'image/gif'
      : 'image/jpeg';

  const response = await fetch(
    `${API_CONFIG.SUPABASE_URL}/storage/v1/object/images/${objectKey}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
        apikey: API_CONFIG.SUPABASE_ANON_KEY,
        'x-upsert': 'true',
        'Content-Type': mimeType,
      },
      body: file,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`فشل رفع الصورة إلى Supabase: ${errorText || response.statusText}`);
  }

  return `${API_CONFIG.SUPABASE_URL}/storage/v1/object/public/images/${objectKey}`;
};

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  currentCity,
  onAdCreated,
  initialSection,
  initialCategoryId,
  initialSubCatId,
  lang,
  currentUser = null,
  categories = CATEGORIES,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Cascading Category Selection
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategoryId || 'jobs');
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>(initialSubCatId || 'jobs-culinary');

  // 2. Ad Intent (ad_type): OFFER (عرض) vs REQUEST (طلب) placed directly UNDER subcategory
  const [adType, setAdType] = useState<'OFFER' | 'REQUEST'>(
    initialSection === 'worker_profiles' ? 'REQUEST' : 'OFFER'
  );

  // 3. Location Selection (Governorate of active country)
  const activeCountry = COUNTRIES.find((c) => c.regions.some((r) => r.id === currentRegion.id)) || COUNTRIES[0];
  const availableRegions = activeCountry.regions;
  const [selectedRegionId, setSelectedRegionId] = useState<string>(currentRegion.id || availableRegions[0]?.id || 'ye-sanaa');

  // 4. Primary Multi-line Description Field (Mandatory)
  const [content, setContent] = useState<string>('');

  // 5. Media Attachments (Empty by default - NO mock/dummy images!)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // 6. Contact & Phone Details ("اتصل بي")
  const [primaryPhone, setPrimaryPhone] = useState<string>(currentUser?.phone || '');
  const [secondaryPhone, setSecondaryPhone] = useState<string>('');
  // "السماح مشاركه رقم الهاتف يكون الافتراضي غير ولا ينشر الا بموافق" -> Default MUST be FALSE
  const [sharePhone, setSharePhone] = useState<boolean>(false);

  // Saved Draft tracker
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // Status flags
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Determine if user is subscriber (for featured ad button)
  const isSubscriber = Boolean(
    currentUser?.isSubscribed ||
    currentUser?.role === 'admin' ||
    (currentUser as any)?.subscriptionTier
  );

  // Resolve active category & subcategories
  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0] || CATEGORIES[0];
  const currentSubcategories = currentCategory.subcategories || [];

  // Sync initial category & subcategory when opening modal
  useEffect(() => {
    if (isOpen) {
      if (initialCategoryId && categories.some((c) => c.id === initialCategoryId)) {
        setSelectedCatId(initialCategoryId);
        const cat = categories.find((c) => c.id === initialCategoryId);
        if (cat) {
          if (initialSubCatId && cat.subcategories.some((s) => s.id === initialSubCatId)) {
            setSelectedSubCatId(initialSubCatId);
          } else if (cat.subcategories.length > 0) {
            setSelectedSubCatId(cat.subcategories[0].id);
          }
        }
      }
      if (currentUser?.phone && !primaryPhone) {
        setPrimaryPhone(currentUser.phone);
      }
      // Check saved draft
      try {
        const savedDraft = localStorage.getItem('awn_ad_draft');
        if (savedDraft) {
          setHasSavedDraft(true);
        }
      } catch {}
    }
  }, [isOpen, initialCategoryId, initialSubCatId, categories, currentUser]);

  // Restore saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('awn_ad_draft');
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.content || d.description) setContent(d.content || d.description);
        if (d.adType) setAdType(d.adType === 'REQUEST' ? 'REQUEST' : 'OFFER');
        if (d.categoryId) setSelectedCatId(d.categoryId);
        if (d.subCategoryId) setSelectedSubCatId(d.subCategoryId);
        if (d.regionId) setSelectedRegionId(d.regionId);
        if (typeof d.sharePhone === 'boolean') setSharePhone(d.sharePhone);
        if (d.primaryPhone) setPrimaryPhone(d.primaryPhone);
        if (d.secondaryPhone) setSecondaryPhone(d.secondaryPhone);
        if (Array.isArray(d.mediaUrls)) setUploadedImages(d.mediaUrls);
        setHasSavedDraft(true);
      }
    } catch { }
  }, []);

  // Update cascading subcategory when category changes
  const handleCategoryChange = (newCatId: string) => {
    setSelectedCatId(newCatId);
    const cat = categories.find((c) => c.id === newCatId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubCatId(cat.subcategories[0].id);
    }
  };

  // Direct Camera / Gallery Image Upload (Converts file to base64 Data URL)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - uploadedImages.length;
    if (remainingSlots <= 0) return;

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            return await uploadImageToSupabase(file);
          } catch (uploadError) {
            const fallbackUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result ?? ''));
              reader.onerror = () => reject(uploadError);
              reader.readAsDataURL(file);
            });
            return fallbackUrl;
          }
        })
      );

      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
      setSuccessNotice(
        isAr
          ? 'تم رفع الصور بنجاح واتباعها في الإعلان.'
          : 'Images uploaded successfully and attached to the ad.'
      );
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch (error: any) {
      setErrorNotice(
        error?.message ||
          (isAr ? 'فشل رفع الصور، يرجى المحاولة مرة أخرى.' : 'Failed to upload images. Please try again.')
      );
    }

    if (e.target) e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Derive concise title from first sentence of content
  const deriveTitle = (text: string): string => {
    const trimmed = text.trim();
    if (!trimmed) return isAr ? 'إعلان بدون عنوان' : 'Untitled Ad';
    const firstLine = trimmed.split('\n')[0].trim();
    const firstSentence = firstLine.split(/[.!؟]/)[0].trim();
    return firstSentence.length > 55 ? `${firstSentence.slice(0, 52)}...` : firstSentence || 'إعلان جديد';
  };

  // Delete saved draft and purge all related input states
  const handleDeleteDraft = () => {
    try {
      localStorage.removeItem('awn_ad_draft');
    } catch {}
    setContent('');
    setUploadedImages([]);
    setPrimaryPhone(currentUser?.phone || '');
    setSecondaryPhone('');
    setSharePhone(false);
    setHasSavedDraft(false);
    setSuccessNotice(isAr ? 'تم حذف المسودة وتفريغ النموذج بالكامل.' : 'Draft deleted and form cleared.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Submission Handler (Draft vs Free vs Featured)
  const handleSubmit = async (isDraft: boolean, isFeatured: boolean = false) => {
    setErrorNotice(null);
    setSuccessNotice(null);

    const trimmedContent = content.trim();

    if (!isDraft) {
      if (!trimmedContent || trimmedContent.length < 10) {
        setErrorNotice(
          isAr
            ? 'يرجى كتابة نص وتفاصيل الإعلان بشكل واضح (10 أحرف على الأقل)'
            : 'Please enter clear ad details (at least 10 characters).'
        );
        return;
      }

      // Automated Keyword Moderation
      const mod = moderateAdContent(deriveTitle(trimmedContent), trimmedContent, uploadedImages);
      if (!mod.allowed) {
        setErrorNotice(mod.reason || 'محتوى الإعلان مخالف لمعايير النشر.');
        return;
      }
    }

    setIsSubmitting(true);

    const targetRegion = availableRegions.find((r) => r.id === selectedRegionId) || availableRegions[0];
    const derivedTitle = deriveTitle(trimmedContent);
    const creatorPhone = sharePhone ? (primaryPhone.trim() || currentUser?.phone || '') : '';
    const altPhone = sharePhone ? secondaryPhone.trim() : '';
    const nowIso = new Date().toISOString();

    const adStatus = isDraft ? 'DRAFT' : isFeatured ? 'PREMIUM' : 'ACTIVE';

    const payload: Partial<Listing> = {
      title: derivedTitle,
      description: trimmedContent,
      adType,
      sectionType: adType === 'REQUEST' ? 'worker_profiles' : 'job_vacancies',
      categoryId: selectedCatId,
      categoryNameAr: currentCategory.nameAr,
      subCategoryId: selectedSubCatId,
      subCategoryNameAr: currentSubcategories.find((s) => s.id === selectedSubCatId)?.nameAr || currentCategory.nameAr,
      countryId: activeCountry.id,
      regionId: selectedRegionId,
      regionNameAr: targetRegion ? targetRegion.nameAr : 'صنعاء',
      cityId: currentCity?.id || `${selectedRegionId}-center`,
      cityNameAr: currentCity?.nameAr || targetRegion?.nameAr || 'صنعاء',
      sharePhone,
      creatorPhone: creatorPhone || undefined,
      contactPhone: creatorPhone,
      whatsappNumber: creatorPhone,
      altPhone: altPhone || undefined,
      sellerName: currentUser?.displayName || (isAr ? 'مستخدم عون' : 'Awn User'),
      status: adStatus as any,
      publishedAt: isDraft ? undefined : nowIso,
      createdAt: nowIso,
      media: uploadedImages.map((url, i) => ({
        id: `img-${i}`,
        url,
        isPrimary: i === 0,
        orderWeight: i,
      })),
      mediaUrls: uploadedImages,
      metadata: {
        ...(payload as any)?.metadata,
        mediaUrls: uploadedImages,
        sectionType: adType === 'REQUEST' ? 'worker_profiles' : 'job_vacancies',
      },
      price: null,
      currency: 'YER',
      priceNegotiable: true,
      purpose: 'both',
      sellerType: 'personal',
      sellerVerified: false,
      sellerRating: 5.0,
      viewsCount: 1,
      clicksCount: 0,
      attributes: [],
    };

    try {
      // 1. Save in local browser storage
      if (isDraft) {
        localStorage.setItem(
          'awn_ad_draft',
          JSON.stringify({
            ...payload,
            content: trimmedContent,
            primaryPhone: primaryPhone.trim(),
            secondaryPhone: secondaryPhone.trim(),
          })
        );
        setHasSavedDraft(true);
      } else {
        localStorage.removeItem('awn_ad_draft');
        setHasSavedDraft(false);
      }

      // 2. Transmit to backend
      const created = await apiService.createListing(payload);

      setIsSubmitting(false);
      setSuccessNotice(
        isDraft
          ? isAr
            ? '✓ تم حفظ الإعلان كمسودة بنجاح'
            : 'Draft saved successfully!'
          : isFeatured
          ? isAr
            ? '⭐ تم فحص الإعلان آلياً ونُشر كإعلان مميز للمشتركين بنجاح!'
            : 'Published as Featured ad!'
          : isAr
          ? '✓ تم فحص الإعلان آلياً ونُشر فوراً بنجاح!'
          : 'Ad verified and published instantly!'
      );

      setTimeout(() => {
        onAdCreated(created || (payload as Listing));
        onClose();
      }, 700);
    } catch (e: any) {
      setIsSubmitting(false);
      setErrorNotice(e?.message || (isAr ? 'تعذر إرسال الإعلان، يرجى المحاولة لاحقاً' : 'Failed to submit ad.'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#68142c] to-[#8b203e] text-white">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isAr ? 'نشر إعلان جديد' : 'Create New Ad'}
              </h2>
              <p className="text-xs text-white/80">
                {isAr ? 'نموذج موحد مبسط بنشر فوري وفحص آلي ذكي' : 'Unified streamlined ad creation with instant verification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Alerts */}
          {errorNotice && (
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {successNotice && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* 1. Cascading Category Selection with Ad Intent placed UNDER Sub-Category */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'القسم الرئيسي *' : 'Main Category *'}
                </label>
                <select
                  value={selectedCatId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#68142c] focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isAr ? cat.nameAr : cat.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'القسم الفرعي *' : 'Sub-Category *'}
                </label>
                <select
                  value={selectedSubCatId}
                  onChange={(e) => setSelectedSubCatId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#68142c] focus:outline-none"
                >
                  {currentSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {isAr ? sub.nameAr : sub.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ad Intent Toggle: OFFER (عرض) vs REQUEST (طلب) - Placed directly UNDER Sub-Category */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'نوع الإعلان (تحت القسم الفرعي) *' : 'Ad Intent (Offer or Request) *'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAdType('OFFER')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    adType === 'OFFER'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'عـــرض (OFFER)' : 'Offer (Supply)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdType('REQUEST')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    adType === 'REQUEST'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isAr ? 'طـــلب (REQUEST)' : 'Request (Demand)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Location Selection (Governorate) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#68142c] dark:text-amber-400" />
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? `المحافظة (${activeCountry.nameAr}) *` : `Governorate (${activeCountry.nameEn}) *`}
              </label>
            </div>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#68142c] focus:outline-none"
            >
              {availableRegions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {isAr ? reg.nameAr : reg.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Primary Multi-line Description Field (Mandatory) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'نص وتفاصيل الإعلان *' : 'Ad Description / Content *'}
              </label>
              <span className="text-[11px] text-slate-400">
                {content.length} {isAr ? 'حرف' : 'chars'}
              </span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب تفاصيل إعلانك هنا بوضوح (المواصفات، الشروط، متطلبات العمل، الخبرة المطلوبة)...'
                  : 'Write your complete ad details here (specifications, requirements, terms)...'
              }
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-[#68142c] focus:outline-none"
            />
          </div>

          {/* 4. Media Attachments: Native OS File/Camera Upload Only */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#68142c] dark:text-amber-400" />
                <span>{isAr ? 'الصور المرفقة (اختياري)' : 'Attached Photos (Optional)'}</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {uploadedImages.length} / 5
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-wrap gap-2.5">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <img src={img} alt={`ad-img-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                    title={isAr ? 'حذف الصورة' : 'Remove'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {uploadedImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#68142c] text-slate-500 hover:text-[#68142c] transition-colors bg-white dark:bg-slate-900"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{isAr ? 'إضافة' : 'Add'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. Contact Me Section: Primary Phone + Secondary Phone + Permission */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#68142c] dark:text-amber-400" />
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'اتصل بي (بيانات التواصل)' : 'Contact Me (Phone Numbers)'}
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {isAr ? 'رقم الهاتف الأساسي (يمكن تعديله)' : 'Primary Phone (Editable)'}
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+967 77X XXX XXX"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#68142c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {isAr ? 'رقم هاتف ثانٍ للتواصل (اختياري)' : 'Secondary Phone (Optional)'}
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="+967 71X XXX XXX"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#68142c] focus:outline-none"
                />
              </div>
            </div>

            {/* Permission Checkbox: Default false (غير ولا ينشر الا بموافقة) */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="share-phone-check"
                checked={sharePhone}
                onChange={(e) => setSharePhone(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#68142c] focus:ring-[#68142c] border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <label htmlFor="share-phone-check" className="cursor-pointer text-xs select-none">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {isAr
                    ? 'السماح بمشاركة أرقام الهاتف مع هذا الإعلان للتواصل'
                    : 'Allow sharing contact phone numbers with this ad'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {isAr
                    ? 'ملاحظة: افتراضياً لا يتم نشر الرقم، ولا ينشر إلا بموافقتك هنا لحماية خصوصيتك'
                    : 'Note: Phone is not published unless approved here for your privacy'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {/* Delete Draft Button (shows when saved draft exists) */}
            {hasSavedDraft && (
              <button
                type="button"
                onClick={handleDeleteDraft}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
                title={isAr ? 'حذف المسودة وتفريغ النموذج' : 'Delete Draft'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'حذف المسودة' : 'Delete Draft'}</span>
              </button>
            )}

            {/* Save as Draft */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <BookmarkCheck className="w-4 h-4 text-slate-500" />
              <span>{isAr ? 'حفظ كمسودة' : 'Save as Draft'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            {/* Publish Free Ad */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false, false)}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري النشر...' : 'Publishing...')
                  : (isAr ? 'نشر إعلان مجاني' : 'Publish Free Ad')}
              </span>
            </button>

            {/* Publish Featured Ad: Enabled ONLY for subscribers */}
            {isSubscriber ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false, true)}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-100" />
                <span>{isAr ? 'نشر إعلان مميز ⭐' : 'Publish Featured ⭐'}</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold cursor-not-allowed opacity-80"
                title={isAr ? 'النشر المميز متاح للمشتركين فقط' : 'Featured ads are for subscribers only'}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'مميز (للمشتركين فقط)' : 'Featured (Subscribers)'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

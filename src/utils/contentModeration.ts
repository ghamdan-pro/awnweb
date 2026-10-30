/**
 * Automated Content Moderation Engine for Awn Yemen
 * محرك الفحص الآلي للإعلانات: مكافحة التكرار، الألفاظ غير الأخلاقية، الشتم، والمحتوى السياسي
 */

import { Listing } from '../data/mockListings';

export interface ModerationResult {
  isValid: boolean;
  reason?: string;
  category?: 'duplication' | 'profanity' | 'immoral' | 'political' | 'images' | 'passed';
  duplicateId?: string;
  isDuplicateAutoReplace?: boolean;
}

// قائمة الكلمات والمصطلحات غير الأخلاقية الممنوعة
const IMMORAL_TERMS = [
  'جنس', 'جنسي', 'دعارة', 'زنا', 'سكس', 'بنات ليل', 'شيميل', 'عاهرة', 'قحبة',
  'متعة سرية', 'مساج خاص', 'تعارف جنسي', 'صور عارية', 'افلام اباحية', 'اباحي',
  'شذوذ', 'مخنث', 'منيوك', 'لواط', 'سحاق', 'ديوث'
];

// قائمة الشتائم والسب والقذف الممنوعة
const PROFANITY_TERMS = [
  'كلب', 'حمار', 'حيوان', 'غبي', 'تافه', 'قذر', 'حقير', 'سافل', 'نذل',
  'ملعون', 'لعنة', 'يلعن', 'ابن الحرام', 'يا كلب', 'يا حمار', 'خنزير',
  'شحات', 'صعلوك', 'واطي', 'فاسد', 'نصابين', 'سرق', 'سارق'
];

// قائمة الشعارات والمصطلحات السياسية والحزبية الممنوعة
const POLITICAL_TERMS = [
  'إسقاط النظام', 'مظاهرات مسلحة', 'ثورة مسلحة', 'حزب سياسي', 'انقلاب',
  'سلاح حربي', 'كلاشنكوف', 'قذائف', 'مضاد طيران', 'ذخيرة حية',
  'تحريض طائفي', 'طائفية', 'قتال أهلي', 'مليشيا', 'حرب أهلية',
  'قوات الاحتلال', 'تنظيم القاعدة', 'داعش'
];

/**
 * دالة تطبيع النص العربي لإزالة التشكيل وعلامات الترقيم وتوحيد الهمزات
 */
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * فحص مطابقة الألفاظ الممنوعة في النص
 */
function checkKeywords(text: string, list: string[]): string | null {
  const norm = normalizeArabic(text);
  for (const term of list) {
    const normTerm = normalizeArabic(term);
    // تطابق كامل أو كجزء من الكلمة
    const regex = new RegExp(`(^|\\s)${normTerm}(\\s|$)`, 'i');
    if (regex.test(norm) || norm.includes(` ${normTerm} `) || norm.startsWith(`${normTerm} `) || norm.endsWith(` ${normTerm}`)) {
      return term;
    }
  }
  return null;
}

/**
 * المحرك الأساسي للفحص الآلي لمحتوى الإعلان
 */
export function moderateAdContent(
  title: string,
  description: string,
  phone: string,
  images: string[] = [],
  existingListings: Listing[] = [],
  isAr: boolean = true
): ModerationResult {
  const combinedText = `${title} ${description}`;

  // 1. فحص عدم التكرار (Anti-Duplication Check)
  const cleanPhone = phone.replace(/\D/g, '').slice(-9); // آخر 9 أرقام من الهاتف
  const normTitle = normalizeArabic(title);

  if (cleanPhone && existingListings.length > 0) {
    const duplicate = existingListings.find((item) => {
      if (item.status === 'expired' || item.status === 'rejected') return false;
      const itemPhone = item.contactPhone.replace(/\D/g, '').slice(-9);
      if (itemPhone === cleanPhone) {
        const itemTitleNorm = normalizeArabic(item.title);
        // تطابق دقيق للعنوان أو تشابه كبير من نفس رقم الهاتف
        if (itemTitleNorm === normTitle) return true;
        if (itemTitleNorm.length > 8 && normTitle.includes(itemTitleNorm)) return true;
      }
      return false;
    });

    if (duplicate) {
      // المطلوب: عند إضافة إعلان مكرر يتم حذف أحدهما تلقائياً (حذف القديم وتثبيت الجديد)
      return {
        isValid: true,
        category: 'duplication',
        isDuplicateAutoReplace: true,
        duplicateId: duplicate.id,
        reason: isAr
          ? `تم رصد إعلان مكرر سابق لنفس الرقم ("${duplicate.title}"). سيتم تلقائياً حذف الإعلان القديم واستبداله بهذا الإعلان الجديد المحدث.`
          : 'A previous duplicate ad was detected. The older listing will be automatically deleted and replaced with this update.',
      };
    }
  }

  // 2. فحص الألفاظ غير الأخلاقية (Immoral Content Check)
  const immoralMatch = checkKeywords(combinedText, IMMORAL_TERMS);
  if (immoralMatch) {
    return {
      isValid: false,
      category: 'immoral',
      reason: isAr
        ? 'محتوى مخالف: يحتوي الإعلان على عبارات غير لائقة تخالف الآداب والأخلاق الإسلامية واليمنية العامة.'
        : 'Inappropriate content: The ad contains immoral or adult phrases violating community standards.',
    };
  }

  // 3. فحص الشتم والسب والقذف (Profanity & Abusive Language Check)
  const profanityMatch = checkKeywords(combinedText, PROFANITY_TERMS);
  if (profanityMatch) {
    return {
      isValid: false,
      category: 'profanity',
      reason: isAr
        ? 'محتوى مخالف: تم رصد ألفاظ مسيئة أو عبارات سب وشتم. يرجى تعديل الإعلان والالتزام بأسلوب مهني محترم.'
        : 'Offensive language: Abusive words or insults detected. Please maintain polite language.',
    };
  }

  // 4. فحص المحتوى السياسي والحزبي والعسكري (Political & Arms Check)
  const politicalMatch = checkKeywords(combinedText, POLITICAL_TERMS);
  if (politicalMatch) {
    return {
      isValid: false,
      category: 'political',
      reason: isAr
        ? 'محتوى مخالف: عون يمن منصة خدمية وتجارية موحدة، ويُمنع منعاً باتاً نشر المنشورات والشعارات السياسية أو التحريضية أو تجارة الأسلحة الحربية.'
        : 'Prohibited political content: Political agitation and weapons are strictly prohibited on this commercial platform.',
    };
  }

  // 5. فحص الصور (Images Check)
  if (images.length === 0) {
    return {
      isValid: false,
      category: 'images',
      reason: isAr ? 'يجب إضافة صورة واحدة على الأقل توضح السلعة أو الخدمة.' : 'At least one photo is required.',
    };
  }

  // اجتياز كافة معايير الفحص الآلي بنجاح
  return {
    isValid: true,
    category: 'passed',
    reason: isAr ? 'تم الفحص الآلي بنجاح: الإعلان مطابق لكافة المعايير والشروط.' : 'Passed automated moderation.',
  };
}

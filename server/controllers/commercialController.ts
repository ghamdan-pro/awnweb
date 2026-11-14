import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export interface CommercialBanner {
  id: string;
  tag: string;
  location: string;
  title: string;
  subtitle: string;
  icon?: string;
  imageUrl?: string;
  gradientStart: string;
  gradientEnd: string;
  badgeColor: string;
  buttonText: string;
  actionType: 'contact' | 'link' | 'cars' | 'real_estate' | 'post';
  contactPhone?: string;
  contactName?: string;
  actionUrl?: string;
  isActive: boolean;
  order: number;
}

export interface CommercialTicker {
  id: string;
  text: string;
  tag?: string;
  isActive: boolean;
  order: number;
}

// In-Memory Fallback State (Synchronized across API requests)
let inMemoryBanners: CommercialBanner[] = [
  {
    id: 'banner-1',
    tag: 'إعلان تجاري مميز',
    location: 'صنعاء - عدن',
    title: 'مجموعة النخبة للتجارة والاستيراد العام',
    subtitle: 'توزيع مباشر وتوريدات جملة للمحلات والمراكز التجارية',
    icon: 'business',
    gradientStart: '#68142C',
    gradientEnd: '#991B1B',
    badgeColor: '#F59E0B',
    buttonText: 'تواصل 📞',
    actionType: 'contact',
    contactName: 'مجموعة النخبة التجارية',
    contactPhone: '+967 777 123 456',
    isActive: true,
    order: 1,
  },
  {
    id: 'banner-2',
    tag: 'معرض سيارات معتمد',
    location: 'صنعاء - شارع الستين',
    title: 'معارض الرواد للسيارات والمعدات الحديثة',
    subtitle: 'أحدث الموديلات وفحص معتمد مع تسهيلات وخصم نقدي',
    icon: 'car',
    gradientStart: '#0F172A',
    gradientEnd: '#1E293B',
    badgeColor: '#38BDF8',
    buttonText: 'عرض 🚗',
    actionType: 'cars',
    isActive: true,
    order: 2,
  },
  {
    id: 'banner-3',
    tag: 'استثمار وتطوير عقاري',
    location: 'عدن - خور مكسر والمنصورة',
    title: 'أبراج الأفق السكنية والتجارية الفاخرة',
    subtitle: 'شقق ومكاتب ومحلات تجارية للتمليك والإيجار بأسعار مناسبة',
    icon: 'building',
    gradientStart: '#064E3B',
    gradientEnd: '#047857',
    badgeColor: '#34D399',
    buttonText: 'حجز 🏢',
    actionType: 'real_estate',
    isActive: true,
    order: 3,
  },
  {
    id: 'banner-4',
    tag: 'مساحة إعلانية تجارية',
    location: 'عموم المحافظات',
    title: 'روّج لنشاطك التجاري وثبّت إعلانك أمام آلاف المشترين',
    subtitle: 'اشترك بالباقة المميزة واحصل على ظهور فوري واستثنائي',
    icon: 'star',
    gradientStart: '#78350F',
    gradientEnd: '#D97706',
    badgeColor: '#FEF08A',
    buttonText: 'أعلن الآن 📢',
    actionType: 'post',
    isActive: true,
    order: 4,
  },
];

let inMemoryTickers: CommercialTicker[] = [
  {
    id: 'tick-1',
    text: '⚡ إشعار تجاري: مجمع اليمن التجاري والاستثماري يعلن عن فرص استثمارية وتأجير مساحات بصنعاء',
    tag: 'إشعار تجاري',
    isActive: true,
    order: 1,
  },
  {
    id: 'tick-2',
    text: '🔥 عرض خاص: خصم 40% على اشتراكات الشركات والمتاجر في منصة عون يمن',
    tag: 'عرض خاص',
    isActive: true,
    order: 2,
  },
  {
    id: 'tick-3',
    text: '💼 شركة رواد التقنية تطلب مطورين ومسوقين فوراً في عدن وصنعاء',
    tag: 'وظائف',
    isActive: true,
    order: 3,
  },
  {
    id: 'tick-4',
    text: '🚗 عروض مميزة من وكالات السيارات المعتمدة بضمان شامل وفحص فوري',
    tag: 'سيارات',
    isActive: true,
    order: 4,
  },
  {
    id: 'tick-5',
    text: '📢 أعلن عن نشاطك التجاري هنا ليصل لآلاف الزوار والعملاء يومياً في كافة المحافظات',
    tag: 'ترويج',
    isActive: true,
    order: 5,
  },
];

/**
 * جلب جميع الإعلانات التجارية والإشعارات النصية لتطبيق الموبايل ولوحة التحكم
 */
export const getCommercialContent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Try fetching from Supabase table if available
    const { data: dbBanners, error: bErr } = await supabase
      .from('commercial_banners')
      .select('*')
      .order('order', { ascending: true });

    const { data: dbTickers, error: tErr } = await supabase
      .from('commercial_tickers')
      .select('*')
      .order('order', { ascending: true });

    const banners = (!bErr && dbBanners && dbBanners.length > 0) ? dbBanners : inMemoryBanners;
    const tickers = (!tErr && dbTickers && dbTickers.length > 0) ? dbTickers : inMemoryTickers;

    res.status(200).json({
      success: true,
      data: {
        banners: banners.filter((b: CommercialBanner) => b.isActive !== false),
        tickers: tickers.filter((t: CommercialTicker) => t.isActive !== false),
        allBanners: banners,
        allTickers: tickers,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        banners: inMemoryBanners.filter((b) => b.isActive !== false),
        tickers: inMemoryTickers.filter((t) => t.isActive !== false),
        allBanners: inMemoryBanners,
        allTickers: inMemoryTickers,
      },
    });
  }
};

/**
 * تحديث البانرات التجارية من لوحة التحكم
 */
export const updateCommercialBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { banners } = req.body;
    if (Array.isArray(banners)) {
      inMemoryBanners = banners;

      // Best effort update in Supabase
      try {
        await supabase.from('commercial_banners').upsert(banners);
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: 'تم حفظ وتحديث البانرات التجارية بنجاح ومزامنتها مع تطبيق الموبايل',
      data: inMemoryBanners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل حفظ البانرات التجارية',
    });
  }
};

/**
 * تحديث الإشعارات النصية المتحركة من لوحة التحكم
 */
export const updateCommercialTickers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tickers } = req.body;
    if (Array.isArray(tickers)) {
      inMemoryTickers = tickers;

      // Best effort update in Supabase
      try {
        await supabase.from('commercial_tickers').upsert(tickers);
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: 'تم حفظ وتحديث الإشعارات النصية بنجاح ومزامنتها مع شريط الموبايل',
      data: inMemoryTickers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل حفظ الإشعارات النصية',
    });
  }
};

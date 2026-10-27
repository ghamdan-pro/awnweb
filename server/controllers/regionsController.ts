import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const FALLBACK_REGIONS = [
  {
    id: 'ye-sanaa',
    nameAr: 'صنعاء',
    nameEn: 'Sanaa',
    code: 'SAN',
    cities: [
      { id: 'ye-san-amanah', nameAr: 'أمانة العاصمة', nameEn: 'Capital Secretariat' },
      { id: 'ye-san-hadda', nameAr: 'حدة والحي الدبلوماسي', nameEn: 'Hadda' },
      { id: 'ye-san-sabeein', nameAr: 'السبعين', nameEn: 'Al-Sabyeen' },
      { id: 'ye-san-safiyah', nameAr: 'الصافية', nameEn: 'Al-Safiyah' },
      { id: 'ye-san-harith', nameAr: 'بني الحارث / المطار', nameEn: 'Bani Al-Harith' },
      { id: 'ye-san-tahrir', nameAr: 'التحرير ووسط البلد', nameEn: 'Al-Tahrir' },
      { id: 'ye-san-asima', nameAr: 'صنعاء القديمة', nameEn: 'Old Sanaa' },
    ],
  },
  {
    id: 'ye-aden',
    nameAr: 'عدن',
    nameEn: 'Aden',
    code: 'ADE',
    cities: [
      { id: 'ye-ade-mualla', nameAr: 'المعلا', nameEn: 'Al-Mualla' },
      { id: 'ye-ade-khormaksar', nameAr: 'خور مكسر', nameEn: 'Khor Maksar' },
      { id: 'ye-ade-crater', nameAr: 'كريتر (صيرة)', nameEn: 'Crater' },
      { id: 'ye-ade-mansoura', nameAr: 'المنصورة', nameEn: 'Al-Mansoura' },
      { id: 'ye-ade-sheikh', nameAr: 'الشيخ عثمان', nameEn: 'Sheikh Othman' },
      { id: 'ye-ade-buraiqeh', nameAr: 'البريقة', nameEn: 'Al-Buraiqeh' },
    ],
  },
  {
    id: 'ye-taiz',
    nameAr: 'تعز',
    nameEn: 'Taiz',
    code: 'TAI',
    cities: [
      { id: 'ye-tai-mudhaffar', nameAr: 'المظفر', nameEn: 'Al-Mudhaffar' },
      { id: 'ye-tai-qahirah', nameAr: 'القاهرة', nameEn: 'Al-Qahirah' },
      { id: 'ye-tai-salh', nameAr: 'صالة', nameEn: 'Salh' },
      { id: 'ye-tai-hawban', nameAr: 'الحوبان', nameEn: 'Al-Hawban' },
    ],
  },
  {
    id: 'ye-hadramout',
    nameAr: 'حضرموت',
    nameEn: 'Hadramout',
    code: 'HAD',
    cities: [
      { id: 'ye-had-mukalla', nameAr: 'المكلا', nameEn: 'Al-Mukalla' },
      { id: 'ye-had-seiyun', nameAr: 'سيئون', nameEn: 'Seiyun' },
      { id: 'ye-had-tarim', nameAr: 'تريم', nameEn: 'Tarim' },
      { id: 'ye-had-shihr', nameAr: 'الشحر', nameEn: 'Al-Shihr' },
    ],
  },
  {
    id: 'ye-hodeidah',
    nameAr: 'الحديدة',
    nameEn: 'Al-Hudaydah',
    code: 'HOD',
    cities: [
      { id: 'ye-hod-hali', nameAr: 'الحالي', nameEn: 'Al-Hali' },
      { id: 'ye-hod-hawak', nameAr: 'الحوك', nameEn: 'Al-Hawak' },
      { id: 'ye-hod-mina', nameAr: 'الميناء', nameEn: 'Al-Mina' },
    ],
  },
  {
    id: 'ye-ibb',
    nameAr: 'إب',
    nameEn: 'Ibb',
    code: 'IBB',
    cities: [
      { id: 'ye-ibb-dhahar', nameAr: 'الظهار', nameEn: 'Al-Dhahar' },
      { id: 'ye-ibb-mishna', nameAr: 'المشنة', nameEn: 'Al-Mishna' },
      { id: 'ye-ibb-jebla', nameAr: 'جبلة', nameEn: 'Jeblah' },
    ],
  },
  {
    id: 'ye-marib',
    nameAr: 'مأرب',
    nameEn: 'Marib',
    code: 'MAR',
    cities: [
      { id: 'ye-mar-city', nameAr: 'مدينة مأرب', nameEn: 'Marib City' },
      { id: 'ye-mar-wadi', nameAr: 'الوادي', nameEn: 'Al-Wadi' },
    ],
  },
  {
    id: 'ye-dhamar',
    nameAr: 'ذمار',
    nameEn: 'Dhamar',
    code: 'DHA',
    cities: [{ id: 'ye-dha-city', nameAr: 'مدينة ذمار', nameEn: 'Dhamar City' }],
  },
];

export const getRegions = async (req: Request, res: Response): Promise<void> => {
  try {
    try {
      const { data: regions, error: regErr } = await supabase
        .from('regions_provinces')
        .select('*, cities:cities_districts(*)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!regErr && regions && regions.length > 0) {
        const formatted = regions.map((r: any) => ({
          id: r.id,
          nameAr: r.name_ar,
          nameEn: r.name_en,
          code: r.code,
          cities: (r.cities || []).map((c: any) => ({
            id: c.id,
            nameAr: c.name_ar,
            nameEn: c.name_en,
          })),
        }));
        res.status(200).json({ success: true, data: formatted });
        return;
      }
    } catch (e) {}

    res.status(200).json({ success: true, data: FALLBACK_REGIONS });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

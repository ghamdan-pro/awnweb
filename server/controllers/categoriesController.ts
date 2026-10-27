import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const FALLBACK_CATEGORIES = [
  {
    id: 'jobs',
    nameAr: 'وظائف',
    nameEn: 'Jobs',
    count: 145,
    icon: 'Briefcase',
    slug: 'jobs',
    color: '#68142c',
    subcategories: [
      { id: 'jobs-culinary', nameAr: 'سياحة ومطاعم وفنادق', nameEn: 'Hospitality & Culinary', count: 48, slug: 'jobs-culinary' },
      { id: 'jobs-driver', nameAr: 'سائقين وتوصيل ونقل', nameEn: 'Drivers & Delivery', count: 26, slug: 'jobs-driver' },
      { id: 'jobs-programming', nameAr: 'برمجة وتكنولوجيا ومعلومات', nameEn: 'Software & IT', count: 18, slug: 'jobs-programming' },
      { id: 'jobs-medical', nameAr: 'طب وتمريض وصيدلة', nameEn: 'Medical & Healthcare', count: 15, slug: 'jobs-medical' },
      { id: 'jobs-sales', nameAr: 'مبيعات وتسويق وخدمة عملاء', nameEn: 'Sales & Marketing', count: 14, slug: 'jobs-sales' },
      { id: 'jobs-accounting', nameAr: 'محاسبة ومالية وبنوك', nameEn: 'Accounting & Finance', count: 11, slug: 'jobs-accounting' },
      { id: 'jobs-crafts', nameAr: 'حرفيين ومهن يدوية وصيانة', nameEn: 'Crafts & Trades', count: 9, slug: 'jobs-crafts' },
      { id: 'jobs-education', nameAr: 'تدريس وتعليم وتدريب', nameEn: 'Teaching & Education', count: 8, slug: 'jobs-education' },
      { id: 'jobs-admin', nameAr: 'إدارة وموارد بشرية وسكرتارية', nameEn: 'Admin & HR', count: 6, slug: 'jobs-admin' },
      { id: 'jobs-security', nameAr: 'أمن وحراسة وسلامة', nameEn: 'Security & Safety', count: 5, slug: 'jobs-security' },
    ],
  },
  {
    id: 'cars',
    nameAr: 'سيارات ومركبات',
    nameEn: 'Cars & Vehicles',
    count: 340,
    icon: 'Car',
    slug: 'cars',
    color: '#c99316',
    subcategories: [
      { id: 'cars-sale', nameAr: 'سيارات للبيع', nameEn: 'Cars for Sale', count: 210, slug: 'cars-sale' },
      { id: 'cars-rent', nameAr: 'سيارات للإيجار', nameEn: 'Cars for Rent', count: 65, slug: 'cars-rent' },
      { id: 'cars-parts', nameAr: 'قطع غيار وإكسسوارات', nameEn: 'Spare Parts', count: 45, slug: 'cars-parts' },
      { id: 'cars-heavy', nameAr: 'شاحنات ومعدات ثقيلة', nameEn: 'Trucks & Heavy', count: 20, slug: 'cars-heavy' },
      { id: 'cars-motorcycles', nameAr: 'دراجات نارية وسكوتر', nameEn: 'Motorcycles', count: 15, slug: 'cars-motorcycles' },
      { id: 'cars-marine', nameAr: 'قوارب ويخوت وبحريات', nameEn: 'Boats & Marine', count: 8, slug: 'cars-marine' },
    ],
  },
  {
    id: 'real-estate',
    nameAr: 'عقارات',
    nameEn: 'Real Estate',
    count: 185,
    icon: 'Home',
    slug: 'real-estate',
    color: '#68142c',
    subcategories: [
      { id: 'real-apartments-rent', nameAr: 'شقق للإيجار', nameEn: 'Apartments for Rent', count: 85, slug: 'real-apartments-rent' },
      { id: 'real-apartments-sale', nameAr: 'شقق للبيع', nameEn: 'Apartments for Sale', count: 45, slug: 'real-apartments-sale' },
      { id: 'real-villas-sale', nameAr: 'فلل وقصور وبيوت مستقلة', nameEn: 'Villas for Sale', count: 25, slug: 'real-villas-sale' },
      { id: 'real-lands-sale', nameAr: 'أراضي ومخططات استثمارية', nameEn: 'Lands for Sale', count: 30, slug: 'real-lands-sale' },
      { id: 'real-commercial', nameAr: 'عقارات تجارية ومحلات ومكاتب', nameEn: 'Commercial', count: 22, slug: 'real-commercial' },
      { id: 'real-buildings', nameAr: 'عمارات وأبراج ومشاريع', nameEn: 'Buildings', count: 12, slug: 'real-buildings' },
    ],
  },
  {
    id: 'electronics',
    nameAr: 'إلكترونيات وهواتف',
    nameEn: 'Electronics',
    count: 290,
    icon: 'Smartphone',
    slug: 'electronics',
    color: '#c99316',
    subcategories: [
      { id: 'elec-phones', nameAr: 'هواتف وأجهزة لوحية', nameEn: 'Phones & Tablets', count: 140, slug: 'elec-phones' },
      { id: 'elec-solar', nameAr: 'طاقة شمسية وبطاريات وأنظمة', nameEn: 'Solar & Energy', count: 90, slug: 'elec-solar' },
      { id: 'elec-laptops', nameAr: 'كمبيوترات ولابتوب وشاشات', nameEn: 'Laptops & Computers', count: 60, slug: 'elec-laptops' },
      { id: 'elec-appliances', nameAr: 'أجهزة منزلية وكهربائية', nameEn: 'Home Appliances', count: 42, slug: 'elec-appliances' },
      { id: 'elec-cameras', nameAr: 'كاميرات ومعدات تصوير', nameEn: 'Cameras', count: 18, slug: 'elec-cameras' },
      { id: 'elec-gaming', nameAr: 'ألعاب فيديو وكونسول', nameEn: 'Gaming', count: 25, slug: 'elec-gaming' },
    ],
  },
  {
    id: 'services',
    nameAr: 'خدمات وأعمال',
    nameEn: 'Services & Business',
    count: 95,
    icon: 'Wrench',
    slug: 'services',
    color: '#68142c',
    subcategories: [
      { id: 'serv-maintenance', nameAr: 'صيانة منزلية وكهرباء وسباكة', nameEn: 'Home Maintenance', count: 55, slug: 'serv-maintenance' },
      { id: 'serv-transport', nameAr: 'نقل عفش وبضائع وتوصيل', nameEn: 'Moving & Transport', count: 40, slug: 'serv-transport' },
      { id: 'serv-contracting', nameAr: 'مقاولات وترميم وتشطيبات', nameEn: 'Contracting', count: 32, slug: 'serv-contracting' },
      { id: 'serv-customs', nameAr: 'تخليص جمركي ومعاملات', nameEn: 'Customs Clearance', count: 18, slug: 'serv-customs' },
      { id: 'serv-cleaning', nameAr: 'تنظيف ومكافحة حشرات', nameEn: 'Cleaning', count: 22, slug: 'serv-cleaning' },
      { id: 'serv-events', nameAr: 'تنظيم حفلات ومناسبات وتصوير', nameEn: 'Events & Catering', count: 14, slug: 'serv-events' },
      { id: 'serv-legal', nameAr: 'استشارات قانونية ومحاسبية', nameEn: 'Legal & Consulting', count: 12, slug: 'serv-legal' },
    ],
  },
  {
    id: 'furniture',
    nameAr: 'أثاث وديكور',
    nameEn: 'Furniture & Decor',
    count: 110,
    icon: 'Armchair',
    slug: 'furniture',
    color: '#b07d62',
    subcategories: [
      { id: 'furn-majlis', nameAr: 'مجالس يمنية وعربية وصالونات', nameEn: 'Yemeni Majlis', count: 45, slug: 'furn-majlis' },
      { id: 'furn-bedroom', nameAr: 'غرف نوم ودواليب', nameEn: 'Bedrooms', count: 30, slug: 'furn-bedroom' },
      { id: 'furn-kitchen', nameAr: 'مطابخ وخزائن ومعدات', nameEn: 'Kitchens', count: 20, slug: 'furn-kitchen' },
      { id: 'furn-curtains', nameAr: 'سجاد وموكيت وستائر', nameEn: 'Carpets & Curtains', count: 18, slug: 'furn-curtains' },
      { id: 'furn-decor', nameAr: 'ديكورات وتحف وإنارة', nameEn: 'Decor & Lighting', count: 15, slug: 'furn-decor' },
    ],
  },
  {
    id: 'livestock',
    nameAr: 'مواشي وزراعة',
    nameEn: 'Livestock & Agriculture',
    count: 85,
    icon: 'Tractor',
    slug: 'livestock',
    color: '#2d6a4f',
    subcategories: [
      { id: 'live-sheep', nameAr: 'مواشي وأغنام وأبقار وذبائح', nameEn: 'Sheep & Cattle', count: 38, slug: 'live-sheep' },
      { id: 'live-coffee-honey', nameAr: 'عسل يمني أصلي وبن وقشر', nameEn: 'Yemeni Honey & Coffee', count: 28, slug: 'live-coffee-honey' },
      { id: 'live-birds', nameAr: 'طيور ودواجن وحمام', nameEn: 'Birds & Poultry', count: 20, slug: 'live-birds' },
      { id: 'live-agriculture', nameAr: 'بذور ومحاصيل ومعدات زراعية', nameEn: 'Farming Equipment', count: 16, slug: 'live-agriculture' },
      { id: 'live-horses', nameAr: 'خيول وأصايل ومستلزمات', nameEn: 'Horses', count: 8, slug: 'live-horses' },
    ],
  },
  {
    id: 'fashion',
    nameAr: 'أزياء ومقتنيات',
    nameEn: 'Fashion & Traditional',
    count: 75,
    icon: 'Shirt',
    slug: 'fashion',
    color: '#d90429',
    subcategories: [
      { id: 'fash-traditional', nameAr: 'أزياء شعبية يمنية وجنابي وعسوب', nameEn: 'Traditional Wear & Janbiya', count: 35, slug: 'fash-traditional' },
      { id: 'fash-abayas', nameAr: 'عبايات وشيلات وجلابيات', nameEn: 'Abayas & Jalabiyas', count: 25, slug: 'fash-abayas' },
      { id: 'fash-perfumes', nameAr: 'بخور وعطور ودهن عود يمني', nameEn: 'Yemeni Incense & Perfumes', count: 20, slug: 'fash-perfumes' },
      { id: 'fash-watches', nameAr: 'ساعات وفضيات ومجوهرات', nameEn: 'Watches & Silver', count: 18, slug: 'fash-watches' },
      { id: 'fash-clothing', nameAr: 'ملابس وأحذية رجالية ونسائية', nameEn: 'Apparel & Shoes', count: 15, slug: 'fash-clothing' },
    ],
  },
];

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_weight', { ascending: true });

      if (!error && data && data.length > 0) {
        const parents = data.filter((c: any) => !c.parent_id);
        const hierarchy = parents.map((p: any) => ({
          id: p.id,
          nameAr: p.name_ar,
          nameEn: p.name_en,
          icon: p.icon_name || 'Briefcase',
          slug: p.slug,
          color: p.accent_color || '#68142c',
          count: 50,
          subcategories: data
            .filter((c: any) => c.parent_id === p.id)
            .map((sub: any) => ({
              id: sub.id,
              nameAr: sub.name_ar,
              nameEn: sub.name_en,
              icon: sub.icon_name,
              slug: sub.slug,
              count: 15,
            })),
        }));

        res.status(200).json({ success: true, data: hierarchy });
        return;
      }
    } catch (e) {}

    res.status(200).json({ success: true, data: FALLBACK_CATEGORIES });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

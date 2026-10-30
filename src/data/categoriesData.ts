export interface SubCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  count: number;
  icon?: string;
  slug: string;
  serviceType?: 'individual' | 'company'; // خدمات أفراد vs خدمات شركات
  fields?: {
    key: string;
    labelAr: string;
    labelEn: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
    unit?: string;
  }[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  count: number;
  icon: string;
  slug: string;
  color: string;
  subcategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'jobs',
    nameAr: 'وظائف',
    nameEn: 'Jobs',
    count: 127,
    icon: 'Briefcase',
    slug: 'jobs',
    color: '#68142c',
    subcategories: [
      { id: 'jobs-culinary', nameAr: 'سياحة ومطاعم', nameEn: 'Hospitality & Restaurants', count: 12, slug: 'culinary', fields: [
        { key: 'role', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title', type: 'select', options: ['شيف / طباخ ذبايح ورز مندي', 'معلم بوفية وسندويشات', 'معلم معصوب وعريكة', 'معلم شاورما ومشويات', 'مساعد طباخ', 'كابتن صالة / ويتر'] },
        { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience', type: 'select', options: ['أقل من سنة', '1-3 سنوات', '3-5 سنوات', 'أكثر من 5 سنوات'] },
        { key: 'travelReady', labelAr: 'الاستعداد للسفر', labelEn: 'Willing to travel', type: 'select', options: ['مستعد للسفر فوراً', 'داخل اليمن فقط', 'الخليج والسعودية'] },
      ]},
      { id: 'jobs-design', nameAr: 'تصميم', nameEn: 'Design', count: 14, slug: 'design', fields: [
        { key: 'tool', labelAr: 'برامج التصميم', labelEn: 'Tools', type: 'text' },
        { key: 'portfolio', labelAr: 'رابط الأعمال', labelEn: 'Portfolio URL', type: 'text' },
      ]},
      { id: 'jobs-driver', nameAr: 'سائق', nameEn: 'Driver', count: 13, slug: 'driver', fields: [
        { key: 'licenseType', labelAr: 'نوع الرخصة', labelEn: 'License Type', type: 'select', options: ['خصوصي', 'عمومي خفيف', 'عمومي ثقيل', 'معدات'] },
      ]},
      { id: 'jobs-accounting', nameAr: 'حسابات', nameEn: 'Accounting', count: 12, slug: 'accounting' },
      { id: 'jobs-labor', nameAr: 'عمال', nameEn: 'Laborers', count: 8, slug: 'labor' },
      { id: 'jobs-management', nameAr: 'إدارة', nameEn: 'Management', count: 7, slug: 'management' },
      { id: 'jobs-crafts', nameAr: 'حرفيين', nameEn: 'Craftsmen', count: 7, slug: 'crafts' },
      { id: 'jobs-nursing', nameAr: 'طب وتمريض', nameEn: 'Medical & Nursing', count: 6, slug: 'nursing' },
      { id: 'jobs-programming', nameAr: 'برمجة', nameEn: 'Programming', count: 5, slug: 'programming', fields: [
        { key: 'techStack', labelAr: 'لغات البرمجة والتقنيات', labelEn: 'Tech Stack', type: 'text' },
        { key: 'workType', labelAr: 'طبيعة العمل', labelEn: 'Work Type', type: 'select', options: ['عن بعد (Remote)', 'دوام كامل حضوري', 'دوام جزئي', 'مشاريع حرة'] },
      ]},
      { id: 'jobs-tech', nameAr: 'تقني', nameEn: 'Technical & IT', count: 4, slug: 'tech' },
      { id: 'jobs-sales', nameAr: 'مبيعات وتسويق', nameEn: 'Sales & Marketing', count: 4, slug: 'sales' },
      { id: 'jobs-writing', nameAr: 'محررين', nameEn: 'Editors & Copywriters', count: 1, slug: 'writing' },
      { id: 'jobs-hr', nameAr: 'موارد بشرية', nameEn: 'Human Resources', count: 1, slug: 'hr' },
      { id: 'jobs-editing', nameAr: 'مونتاج وإخراج', nameEn: 'Video Production', count: 1, slug: 'editing' },
      { id: 'jobs-fashion', nameAr: 'أزياء', nameEn: 'Fashion', count: 0, slug: 'fashion' },
      { id: 'jobs-beauty', nameAr: 'تزيين وتجميل', nameEn: 'Beauty & Salon', count: 0, slug: 'beauty' },
      { id: 'jobs-childcare', nameAr: 'حضانة أطفال', nameEn: 'Childcare', count: 0, slug: 'childcare' },
      { id: 'jobs-secretarial', nameAr: 'سكرتارية', nameEn: 'Secretarial', count: 0, slug: 'secretarial' },
      { id: 'jobs-travel', nameAr: 'سياحة وسفر', nameEn: 'Travel & Tourism', count: 0, slug: 'travel' },
      { id: 'jobs-pr', nameAr: 'علاقات عامة', nameEn: 'Public Relations', count: 0, slug: 'pr' },
      { id: 'jobs-cleaning', nameAr: 'عمال تنظيف', nameEn: 'Cleaning Staff', count: 0, slug: 'cleaning' },
      { id: 'jobs-domestic', nameAr: 'عمالة منزلية', nameEn: 'Domestic Help', count: 0, slug: 'domestic' },
      { id: 'jobs-translators', nameAr: 'مترجمين', nameEn: 'Translators', count: 0, slug: 'translators' },
      { id: 'jobs-misc', nameAr: 'متفرقات', nameEn: 'Miscellaneous', count: 4, slug: 'misc' },
      { id: 'jobs-contracting', nameAr: 'مقاولات', nameEn: 'Contracting', count: 4, slug: 'contracting' },
      { id: 'jobs-teaching', nameAr: 'تعليم وتدريس', nameEn: 'Teaching & Tutors', count: 3, slug: 'teaching' },
      { id: 'jobs-security', nameAr: 'حراسة وأمن', nameEn: 'Security & Guarding', count: 3, slug: 'security' },
      { id: 'jobs-engineering', nameAr: 'مهندس', nameEn: 'Engineering', count: 3, slug: 'engineering' },
      { id: 'jobs-webdesign', nameAr: 'تصميم مواقع', nameEn: 'Web Design', count: 2, slug: 'webdesign' },
      { id: 'jobs-tailor', nameAr: 'خياطين', nameEn: 'Tailoring', count: 2, slug: 'tailor' },
      { id: 'jobs-partnership', nameAr: 'شراكة', nameEn: 'Partnership', count: 2, slug: 'partnership' },
      { id: 'jobs-dataentry', nameAr: 'مدخل بيانات', nameEn: 'Data Entry', count: 2, slug: 'dataentry' },
      { id: 'jobs-ac', nameAr: 'تقنيين تكييف وتبريد', nameEn: 'AC & Cooling', count: 1, slug: 'ac' },
      { id: 'jobs-landscape', nameAr: 'حدائق ومناظر طبيعية', nameEn: 'Landscaping', count: 1, slug: 'landscape' },
      { id: 'jobs-customer-service', nameAr: 'خدمة الزبائن', nameEn: 'Customer Service', count: 1, slug: 'customer-service' }
    ]
  },
  {
    id: 'services',
    nameAr: 'خدمات',
    nameEn: 'Services',
    count: 32,
    icon: 'Wrench',
    slug: 'services',
    color: '#68142c',
    subcategories: [
      // === خدمات أفراد (Individual / Artisan Services) ===
      { id: 'serv-electricity', nameAr: 'كهرباء', nameEn: 'Electrician & Electrical', count: 12, slug: 'electricity', serviceType: 'individual', icon: 'zap' },
      { id: 'serv-carpentry', nameAr: 'نجارة', nameEn: 'Carpentry & Woodwork', count: 9, slug: 'carpentry', serviceType: 'individual', icon: 'hammer' },
      { id: 'serv-auto-mechanic', nameAr: 'ميكانيك', nameEn: 'Auto Mechanic', count: 14, slug: 'auto-mechanic', serviceType: 'individual', icon: 'car' },
      { id: 'serv-auto-electrician', nameAr: 'كهربائي سيارات', nameEn: 'Auto Electrician', count: 8, slug: 'auto-electrician', serviceType: 'individual', icon: 'battery' },
      { id: 'serv-plumbing', nameAr: 'سباكة', nameEn: 'Plumbing & Pipes', count: 11, slug: 'plumbing', serviceType: 'individual', icon: 'droplet' },
      { id: 'serv-nursing', nameAr: 'تمريض', nameEn: 'Home Nursing & Care', count: 6, slug: 'nursing', serviceType: 'individual', icon: 'heart-pulse' },
      { id: 'serv-mobile-repair', nameAr: 'صيانة جوال', nameEn: 'Mobile Phone Repair', count: 15, slug: 'mobile-repair', serviceType: 'individual', icon: 'smartphone' },
      { id: 'serv-ac-cooling', nameAr: 'تبريد وتكييف', nameEn: 'AC & Cooling Repair', count: 7, slug: 'ac-cooling', serviceType: 'individual', icon: 'wind' },
      { id: 'serv-construction', nameAr: 'بناء وتشطيبات', nameEn: 'Construction & Finishing', count: 10, slug: 'construction', serviceType: 'individual', icon: 'paint-roller' },
      { id: 'serv-electronics-repair', nameAr: 'صيانة إلكترونيات', nameEn: 'Electronics & TV Repair', count: 8, slug: 'electronics-repair', serviceType: 'individual', icon: 'cpu' },
      { id: 'serv-domestic-help', nameAr: 'عامل منزلي', nameEn: 'Domestic Help & Cleaning', count: 6, slug: 'domestic-help', serviceType: 'individual', icon: 'home' },
      { id: 'serv-gardening', nameAr: 'منسق حدائق', nameEn: 'Gardening & Landscaping', count: 4, slug: 'gardening', serviceType: 'individual', icon: 'trees' },
      { id: 'serv-private-tutor', nameAr: 'مدرس خصوصي', nameEn: 'Private Tutoring', count: 7, slug: 'private-tutor', serviceType: 'individual', icon: 'graduation-cap' },
      { id: 'serv-moving-delivery', nameAr: 'شحن ونقل وتوصيل', nameEn: 'Moving & Delivery', count: 13, slug: 'moving-delivery', serviceType: 'individual', icon: 'truck' },
      { id: 'serv-home-services', nameAr: 'خدمات منزلية', nameEn: 'General Home Services', count: 9, slug: 'home-services', serviceType: 'individual', icon: 'sparkles' },
      { id: 'serv-photography', nameAr: 'تصوير', nameEn: 'Photography & Videography', count: 5, slug: 'photography', serviceType: 'individual', icon: 'camera' },
      { id: 'serv-hotel-hospitality', nameAr: 'خدمات فندقية', nameEn: 'Hotel & Hospitality Services', count: 3, slug: 'hotel-hospitality', serviceType: 'individual', icon: 'utensils' },
      { id: 'serv-other', nameAr: 'أخرى', nameEn: 'Other Services', count: 8, slug: 'other-services', serviceType: 'individual', icon: 'more-horizontal' },

      // === خدمات شركات (Corporate / Commercial Services) ===
      { id: 'serv-business', nameAr: 'اعمال واستثمار', nameEn: 'Business & Investment', count: 5, slug: 'business', serviceType: 'company', icon: 'briefcase' },
      { id: 'serv-advertising', nameAr: 'دعاية واعلان', nameEn: 'Advertising & Marketing', count: 4, slug: 'advertising', serviceType: 'company', icon: 'megaphone' },
      { id: 'serv-contracting-co', nameAr: 'مقاولات وإنشاءات', nameEn: 'General Contracting', count: 6, slug: 'contracting-co', serviceType: 'company', icon: 'hard-hat' },
      { id: 'serv-recruitment', nameAr: 'استقدام عمالة', nameEn: 'Manpower Supply', count: 3, slug: 'recruitment', serviceType: 'company', icon: 'users' },
      { id: 'serv-realestate', nameAr: 'خدمات عقارية', nameEn: 'Real Estate Services', count: 4, slug: 'realestate', serviceType: 'company', icon: 'building' },
      { id: 'serv-travel', nameAr: 'سياحة وسفر', nameEn: 'Travel & Tourism', count: 3, slug: 'travel', serviceType: 'company', icon: 'plane' },
      { id: 'serv-law', nameAr: 'محاماة وقانون', nameEn: 'Legal & Law Services', count: 2, slug: 'law', serviceType: 'company', icon: 'scale' },
      { id: 'serv-paperwork', nameAr: 'تخليص معاملات', nameEn: 'Government Clearance', count: 4, slug: 'paperwork', serviceType: 'company', icon: 'file-check' },
      { id: 'serv-security', nameAr: 'حراسة وأمن شركات', nameEn: 'Corporate Security', count: 2, slug: 'security', serviceType: 'company', icon: 'shield' },
      { id: 'serv-tax', nameAr: 'ضريبة ومحاسبة شركات', nameEn: 'Corporate Tax & Accounting', count: 3, slug: 'tax', serviceType: 'company', icon: 'calculator' },
      { id: 'serv-events', nameAr: 'تنظيم مؤتمرات وفعاليات', nameEn: 'Event Management', count: 2, slug: 'events', serviceType: 'company', icon: 'calendar' },
      { id: 'serv-pestcontrol', nameAr: 'مكافحة الحشرات والتعقيم', nameEn: 'Commercial Pest Control', count: 2, slug: 'pestcontrol', serviceType: 'company', icon: 'bug' },
      { id: 'serv-corporate-it', nameAr: 'شبكات وتقنية معلومات', nameEn: 'IT & Enterprise Networks', count: 3, slug: 'corporate-it', serviceType: 'company', icon: 'server' },
      { id: 'serv-freight-shipping', nameAr: 'شحن بضائع دولي', nameEn: 'Freight & Global Logistics', count: 2, slug: 'freight-shipping', serviceType: 'company', icon: 'container' }
    ]
  },
  {
    id: 'real-estate',
    nameAr: 'عقارات',
    nameEn: 'Real Estate',
    count: 85,
    icon: 'Building2',
    slug: 'real-estate',
    color: '#68142c',
    subcategories: [
      { id: 're-rent-apt', nameAr: 'شقق للإيجار', nameEn: 'Apartments for Rent', count: 32, slug: 'rent-apt', fields: [
        { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Bedrooms', type: 'select', options: ['غرفة واحدة', 'غرفتين', '3 غرف', '4 غرف', '5+ غرف'] },
        { key: 'bathrooms', labelAr: 'دورات المياه', labelEn: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'select', options: ['نعم - مفروشة بالكامل', 'نصف مفروشة', 'غير مفروشة'] },
        { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'number' }
      ]},
      { id: 're-sale-apt', nameAr: 'شقق للبيع', nameEn: 'Apartments for Sale', count: 18, slug: 'sale-apt' },
      { id: 're-villa', nameAr: 'فلل وقصور للبيع والإيجار', nameEn: 'Villas & Houses', count: 12, slug: 'villa' },
      { id: 're-lands', nameAr: 'أراضي للبيع', nameEn: 'Lands for Sale', count: 14, slug: 'lands', fields: [
        { key: 'area', labelAr: 'المساحة (لبنة / قصبة / م²)', labelEn: 'Area', type: 'text' },
        { key: 'streetWidth', labelAr: 'عرض الشارع', labelEn: 'Street Width', type: 'text' }
      ]},
      { id: 're-commercial', nameAr: 'محلات ومكاتب تجارية', nameEn: 'Commercial & Shops', count: 9, slug: 'commercial' },
    ]
  },
  {
    id: 'cars',
    nameAr: 'سيارات',
    nameEn: 'Cars & Vehicles',
    count: 64,
    icon: 'Car',
    slug: 'cars',
    color: '#68142c',
    subcategories: [
      { id: 'cars-sale', nameAr: 'سيارات للبيع', nameEn: 'Cars for Sale', count: 45, slug: 'cars-sale', fields: [
        { key: 'make', labelAr: 'الشركة المصنعة', labelEn: 'Make', type: 'select', options: ['تويوتا (Toyota)', 'هيونداي (Hyundai)', 'كيا (Kia)', 'مرسيدس (Mercedes)', 'نيسان (Nissan)', 'لكزس (Lexus)', 'شفروليه (Chevrolet)', 'أخرى'] },
        { key: 'year', labelAr: 'سنة الصنع', labelEn: 'Year', type: 'number' },
        { key: 'transmission', labelAr: 'ناقل الحركة', labelEn: 'Transmission', type: 'select', options: ['أوتوماتيك', 'يدوي / عادي'] },
        { key: 'mileage', labelAr: 'الممشى (كم)', labelEn: 'Mileage (km)', type: 'number' },
        { key: 'fuel', labelAr: 'نوع الوقود', labelEn: 'Fuel', type: 'select', options: ['بنزين', 'ديزل', 'غاز', 'هايبرد / كهرباء'] },
        { key: 'customs', labelAr: 'حالة الجمارك', labelEn: 'Customs Status', type: 'select', options: ['مجمرك جاهز لوحات', 'مجمرك بدون ترقيم', 'غير مجمرك (شحن جديد)'] }
      ]},
      { id: 'cars-rent', nameAr: 'سيارات للإيجار', nameEn: 'Cars for Rent', count: 6, slug: 'cars-rent' },
      { id: 'cars-bikes', nameAr: 'دراجات نارية ودبابات', nameEn: 'Motorcycles', count: 5, slug: 'bikes' },
      { id: 'cars-trucks', nameAr: 'شاحنات ومعدات ثقيلة', nameEn: 'Trucks & Heavy Machinery', count: 4, slug: 'trucks' },
      { id: 'cars-parts', nameAr: 'قطع غيار وإكسسوارات', nameEn: 'Spare Parts & Accessories', count: 4, slug: 'parts' }
    ]
  },
  {
    id: 'misc',
    nameAr: 'منوعات',
    nameEn: 'Miscellaneous',
    count: 36,
    icon: 'Package',
    slug: 'misc',
    color: '#68142c',
    subcategories: [
      { id: 'misc-numbers', nameAr: 'ارقام مميزة', nameEn: 'VIP Phone Numbers', count: 8, slug: 'vip-numbers' },
      { id: 'misc-electronics', nameAr: 'الكترونيات', nameEn: 'Electronics', count: 11, slug: 'electronics' },
      { id: 'misc-software', nameAr: 'برامج تطبيقية', nameEn: 'Apps & Software', count: 4, slug: 'software' },
      { id: 'misc-cosmetics', nameAr: 'مستحضرات تجميل', nameEn: 'Cosmetics', count: 3, slug: 'cosmetics' },
      { id: 'misc-industrial', nameAr: 'معدات صناعية', nameEn: 'Industrial Equipment', count: 3, slug: 'industrial' },
      { id: 'misc-collectibles', nameAr: 'مقتنيات', nameEn: 'Collectibles & Antiques', count: 2, slug: 'collectibles' },
      { id: 'misc-instruments', nameAr: 'آلات موسيقية', nameEn: 'Musical Instruments', count: 1, slug: 'instruments' },
      { id: 'misc-appliances', nameAr: 'أجهزة منزلية', nameEn: 'Home Appliances', count: 2, slug: 'appliances' },
      { id: 'misc-security', nameAr: 'أنظمة أمن وحماية', nameEn: 'Security Systems & CCTV', count: 2, slug: 'cctv' }
    ]
  }
];

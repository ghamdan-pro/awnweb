export interface ListingMedia {
  id: string;
  url: string;
  isPrimary: boolean;
  orderWeight: number;
}

export interface ListingAttribute {
  key: string;
  labelAr: string;
  valueAr: string;
  labelEn: string;
  valueEn: string;
}

export type ListingSectionType = 'job_vacancies' | 'worker_profiles' | 'company_services' | 'general';

export interface CompanyServiceItem {
  id: string;
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  priceEstimate?: string;
}

export interface CompanyPortfolioItem {
  id: string;
  titleAr: string;
  clientOrProject: string;
  year: string;
  scopeAr: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryNameAr: string;
  subCategoryId: string;
  subCategoryNameAr: string;
  sectionType?: ListingSectionType;
  
  // Specific fields for Worker Profiles
  workerTitle?: string;
  workerExperienceYears?: string;
  workerSkills?: string[];
  travelReadiness?: string;

  // Specific fields for Corporate Services
  companyCrNumber?: string;
  companyLicenseBadge?: string;
  companyServicesList?: CompanyServiceItem[];
  companyPortfolio?: CompanyPortfolioItem[];
  companyCoverageAreas?: string[];

  // Standard fields
  price: number | null;
  currency: 'YER' | 'SAR' | 'USD';
  priceNegotiable: boolean;
  countryId: string;
  regionId: string;
  regionNameAr: string;
  cityId: string;
  cityNameAr: string;
  status: 'active' | 'premium' | 'pending' | 'expired';
  purpose: 'call_me' | 'message_me' | 'both';
  contactPhone: string;
  contactEmail?: string;
  whatsappNumber?: string;
  sellerName: string;
  sellerType: 'personal' | 'company' | 'agency' | 'advertiser';
  sellerVerified: boolean;
  sellerRating: number;
  sellerAvatar?: string;
  createdAt: string;
  viewsCount: number;
  clicksCount?: number;
  attributes: ListingAttribute[];
  media: ListingMedia[];
  isBookmarked?: boolean;
}

export const INITIAL_LISTINGS: Listing[] = [
  // =========================================================================
  // القسم 1: سياحة ومطاعم - إعلانات العمال والكفاءات (Worker Profiles)
  // =========================================================================
  {
    id: 'listing-culinary-worker-1',
    title: 'شيف حمزة - طباخ ذبايح وقعدان ومناسبات ورز مندي وبشاور وحضرمي',
    description: 'اسمي حمزة من اليمن عمري 26 طباخ ذبايح وقعدان ومناسبات ورز مندي وبشاور وحضرمي واكلات يمنيه ومستعد للسفر في أي وقت والعمل في مطاعم كبرى أو مناسبات خاصة وعائلية أو قاعات أفراح.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'worker_profiles',
    workerTitle: 'شيف ذبايح وولائم ومندي حضرمي',
    workerExperienceYears: '8 سنوات خبرة ممتازة',
    workerSkills: ['طبخ ذبايح وقعدان', 'رز مندي وبشاور', 'زربيان عدني', 'مضغوط ولحم مدفون', 'تجهيز صالات ومناسبات'],
    travelReadiness: 'مستعد للسفر فوراً داخل وخارج اليمن',
    price: null,
    currency: 'SAR',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-sanaa',
    regionNameAr: 'صنعاء',
    cityId: 'ye-san-hadda',
    cityNameAr: 'حدة والحي الدبلوماسي',
    status: 'premium',
    purpose: 'both',
    contactPhone: '+967 777 123 456',
    whatsappNumber: '+967 777 123 456',
    contactEmail: 'hamza.chef@gmail.com',
    sellerName: 'حمزة الشيف اليمني',
    sellerType: 'personal',
    sellerVerified: true,
    sellerRating: 4.9,
    createdAt: 'منذ ساعتين',
    viewsCount: 382,
    clicksCount: 145,
    attributes: [
      { key: 'role', labelAr: 'المسمى الوظيفي', valueAr: 'شيف ذبايح ورز مندي وبشاور', labelEn: 'Role', valueEn: 'Banquet & Mandi Chef' },
      { key: 'experience', labelAr: 'سنوات الخبرة', valueAr: '8 سنوات خبرة احترافية', labelEn: 'Experience', valueEn: '8 Years' },
      { key: 'travelReady', labelAr: 'الاستعداد للسفر', valueAr: 'مستعد للسفر فوراً', labelEn: 'Travel Ready', valueEn: 'Ready Immediately' }
    ],
    media: [
      { id: 'm-1', url: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_10.38.17_PM_f6350e73.jpeg', isPrimary: true, orderWeight: 0 },
      { id: 'm-2', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', isPrimary: false, orderWeight: 1 }
    ]
  },
  {
    id: 'listing-culinary-worker-2',
    title: 'معلم بوفية درجة أولى وسندويشات ومعلم مطبق ومعصوب وعريكة',
    description: 'معلم بوفية درجة أولى معلم سندويشات ومعلم مطبق معصوب عريكة خبز شاباتي، طباخ اكلات شعبية، خبرة في إدارة المطبخ واستقبال الزبائن وتجهيز الطلبات عند الطلب وسرعة فائقة في الإنجاز.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'worker_profiles',
    workerTitle: 'معلم بوفية وسندويشات ومطبق',
    workerExperienceYears: '6 سنوات',
    workerSkills: ['سندويشات وبيرجر', 'مطبق مالح وحلو', 'معصوب وعريكة ملكي', 'خبز شاباتي وروتي', 'خلطات الشاورما'],
    travelReadiness: 'داخل محافظات اليمن (صنعاء، تعز، عدن)',
    price: null,
    currency: 'YER',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-taiz',
    regionNameAr: 'تعز',
    cityId: 'ye-tai-mudhafar',
    cityNameAr: 'المظفر',
    status: 'active',
    purpose: 'call_me',
    contactPhone: '+967 733 987 654',
    whatsappNumber: '+967 733 987 654',
    sellerName: 'معلم سندويشات ومطبق',
    sellerType: 'personal',
    sellerVerified: true,
    sellerRating: 4.8,
    createdAt: 'منذ يوم',
    viewsCount: 247,
    clicksCount: 88,
    attributes: [
      { key: 'role', labelAr: 'المسمى الوظيفي', valueAr: 'معلم بوفية ومطبق وعريكة', labelEn: 'Role', valueEn: 'Snack & Traditional Pastry Cook' },
      { key: 'experience', labelAr: 'سنوات الخبرة', valueAr: '6 سنوات', labelEn: 'Experience', valueEn: '6 Years' },
      { key: 'travelReady', labelAr: 'الاستعداد للسفر', valueAr: 'داخل اليمن فقط', labelEn: 'Travel Ready', valueEn: 'Inside Yemen Only' }
    ],
    media: [
      { id: 'm-3', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  },

  // =========================================================================
  // القسم 2: سياحة ومطاعم - إعلانات فرص عمل شاغرة (Job Vacancies)
  // =========================================================================
  {
    id: 'listing-culinary-vacancy-1',
    title: 'مطلوب شيف رئيسي طباخ مندي وولائم لمطعم سياحي راقي في صنعاء حدة',
    description: 'يعلن مطعم الروابي السياحي في صنعاء - شارع حدة عن حاجته لشيف رئيسي ذو كفاءة عالية متخصص في طبخ الولائم والأرز البشاور والمندي الحضرمي ومضغوط اللحم والدجاج. نوفر راتباً مجزياً مع سكن خاص ومكافآت على جودة الطبخ وسرعة الخدمة.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'job_vacancies',
    price: 4500,
    currency: 'SAR',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-sanaa',
    regionNameAr: 'صنعاء',
    cityId: 'ye-san-hadda',
    cityNameAr: 'حدة',
    status: 'premium',
    purpose: 'both',
    contactPhone: '+967 771 888 999',
    whatsappNumber: '+967 771 888 999',
    contactEmail: 'rawabi.rest.ye@gmail.com',
    sellerName: 'مطاعم الروابي السياحية (صاحب عمل)',
    sellerType: 'company',
    sellerVerified: true,
    sellerRating: 4.95,
    createdAt: 'منذ 4 ساعات',
    viewsCount: 520,
    clicksCount: 215,
    attributes: [
      { key: 'role', labelAr: 'الوظيفة المطلوبة', valueAr: 'شيف رئيسي مندي ومناسبات', labelEn: 'Required Role', valueEn: 'Head Mandi Chef' },
      { key: 'experienceRequired', labelAr: 'الخبرة المطلوبة', valueAr: '5 سنوات فأكثر', labelEn: 'Experience Required', valueEn: '5+ Years' },
      { key: 'benefits', labelAr: 'المزايا المقدمة', valueAr: 'راتب 4,500 ريال سعودي + سكن مؤثث + إعاشة كاملة', labelEn: 'Benefits', valueEn: 'Salary + Housing + Food' },
      { key: 'workType', labelAr: 'نظام الدوام', valueAr: 'دوام كامل في المطعم', labelEn: 'Schedule', valueEn: 'Full Time' }
    ],
    media: [
      { id: 'm-v1', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  },
  {
    id: 'listing-culinary-vacancy-2',
    title: 'فرصة عمل: مطلوب معلم باريستا ومشروبات ساخنة وعصائر لكافيه في عدن',
    description: 'كافيه مميز في كورنيش المحافظة - عدن يطلب معلم باريستا محترف للعمل على ماكينات الإسبريسو وخلطات القهوة المختصة والعصائر الطبيعية. يشترط النظافة واللباقة وحسن المظهر والخبرة لا تقل عن سنتين.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'job_vacancies',
    price: 320000,
    currency: 'YER',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-aden',
    regionNameAr: 'عدن',
    cityId: 'ye-ade-khormaksar',
    cityNameAr: 'خور مكسر',
    status: 'active',
    purpose: 'both',
    contactPhone: '+967 735 111 222',
    whatsappNumber: '+967 735 111 222',
    sellerName: 'كافيه شمس عدن السياحي',
    sellerType: 'company',
    sellerVerified: true,
    sellerRating: 4.7,
    createdAt: 'منذ 8 ساعات',
    viewsCount: 310,
    clicksCount: 122,
    attributes: [
      { key: 'role', labelAr: 'الوظيفة المطلوبة', valueAr: 'معلم باريستا وعصائر', labelEn: 'Required Role', valueEn: 'Barista & Juice Maker' },
      { key: 'experienceRequired', labelAr: 'الخبرة المطلوبة', valueAr: 'سنتان فأكثر', labelEn: 'Experience', valueEn: '2+ Years' },
      { key: 'benefits', labelAr: 'المزايا', valueAr: 'راتب 320,000 ريال يمني + حوافز مبيعات', labelEn: 'Benefits', valueEn: 'Competitive salary + bonus' }
    ],
    media: [
      { id: 'm-v2', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  },

  // =========================================================================
  // القسم 3: سياحة ومطاعم - تقديم خدمات الشركات (Company Services)
  // =========================================================================
  {
    id: 'listing-culinary-company-1',
    title: 'شركة الضيافة العربية لخدمات الإعاشة والتموين الفندقي وإدارة بوفيهات المناسبات الكبرى',
    description: 'شركة معتمدة رسمياً ومختصة في تقديم خدمات التموين الغذائي والإعاشة المؤسسية (Catering & Hospitality Services) لكبرى الشركات، المنظمات، المؤتمرات، وحفلات الأعراس. نمتلك أسطول مطابخ متنقلة وفرق ضيافة وسيرفيس مدربة بأعلى معايير النظافة والاشتراطات الصحية.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'company_services',
    companyCrNumber: 'س.ت: 104829 / صنعاء - وزارة التجارة والصناعة',
    companyLicenseBadge: 'شركة مرخصة ومعتمدة من الغرفة التجارية',
    companyCoverageAreas: ['أمانة العاصمة صنعاء', 'محافظة عدن', 'مأرب', 'حضرموت'],
    companyServicesList: [
      {
        id: 's-1',
        nameAr: 'تموين البوفيه المفتوح للمؤتمرات والمنظمات',
        descriptionAr: 'قوائم أطعمة عربية وعالمية ومقبلات فاخرة وتجهيز قاعات بالكامل بطواقم خدمة نظامية.',
        priceEstimate: 'عروض مخصصة حسب عدد الأفراد'
      },
      {
        id: 's-2',
        nameAr: 'إعداد ولائم الذبايح وقعدان الأعراس والمناسبات',
        descriptionAr: 'قدور ولائم متنقلة ضخمة مع خبراء طبخ حضرمي وصنعاني ومندي على الحطب الطبيعي.',
        priceEstimate: 'تبدأ من 45,000 ريال يمني للذبيحة'
      },
      {
        id: 's-3',
        nameAr: 'عقود الإعاشة الدورية للمستشفيات والشركات وحقول النفط',
        descriptionAr: 'توريد وجبات إفطار وغداء وعشاء يومية مطابقة لشهادات الجودة HACCP ومعايير السلامة.',
        priceEstimate: 'عقود شهرية وسنوية معتمدة'
      },
      {
        id: 's-4',
        nameAr: 'تأجير طواقم الضيافة والمشرفين (Waiters & Hospitality Staff)',
        descriptionAr: 'طواقم مضيفين ومضيفات بزيهن الموحد وخبرة راقية في البروتوكول والتقديم.',
        priceEstimate: 'حسب ساعات وسعة الفعالية'
      }
    ],
    companyPortfolio: [
      {
        id: 'p-1',
        titleAr: 'إعاشة ملتقى رجال الأعمال والمصارف الأول - صنعاء',
        clientOrProject: 'اتحاد الغرف التجارية والبنوك اليمنية',
        year: '2025',
        scopeAr: 'تقديم بوفيه مفتوح وضيافة كاملة لـ 1,400 ضيف على مدار 3 أيام'
      },
      {
        id: 'p-2',
        titleAr: 'تموين فعاليات مهرجان عدن السياحي والتراثي',
        clientOrProject: 'الهيئة العامة للسياحة والمحافظة',
        year: '2024',
        scopeAr: 'إعداد وجبات ومشروبات تراثية يمنية لـ 850 مشارك ووفود دولية'
      },
      {
        id: 'p-3',
        titleAr: 'عقد التموين السنوي لشركة الاتصالات العالمية سبأفون',
        clientOrProject: 'شركة سبأفون للاتصالات',
        year: '2023 - 2026',
        scopeAr: 'وجبات غذائية طازجة يومياً للمقر الرئيسي والإدارات التشغيلية'
      }
    ],
    price: null,
    currency: 'YER',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-sanaa',
    regionNameAr: 'صنعاء',
    cityId: 'ye-san-hadda',
    cityNameAr: 'حدة - جوار مجمع السفارات',
    status: 'premium',
    purpose: 'both',
    contactPhone: '+967 1 445566',
    whatsappNumber: '+967 775 554 433',
    contactEmail: 'corporate@diafa-ye.com',
    sellerName: 'شركة الضيافة العربية للتموين والإعاشة',
    sellerType: 'company',
    sellerVerified: true,
    sellerRating: 5.0,
    createdAt: 'منذ 3 ساعات',
    viewsCount: 1140,
    attributes: [
      { key: 'companyType', labelAr: 'النشاط المصرح', valueAr: 'تموين غذائي وإعاشة فنادق ومؤتمرات', labelEn: 'Type', valueEn: 'Catering & Hospitality' },
      { key: 'crNumber', labelAr: 'رقم السجل التجاري', valueAr: '104829 / صنعاء', labelEn: 'CR Number', valueEn: '104829' },
      { key: 'hygieneCert', labelAr: 'شهادة الجودة الصحية', valueAr: 'معتمد من وزارة الصحة والبلدية', labelEn: 'Quality Certificate', valueEn: 'ISO/MoH Certified' },
      { key: 'capacity', labelAr: 'الطاقة الاستيعابية', valueAr: 'حتى 5,000 وجبة يومياً', labelEn: 'Capacity', valueEn: 'Up to 5000 meals/day' }
    ],
    media: [
      { id: 'm-c1', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 },
      { id: 'm-c2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80', isPrimary: false, orderWeight: 1 },
      { id: 'm-c3', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', isPrimary: false, orderWeight: 2 }
    ]
  },
  {
    id: 'listing-culinary-company-2',
    title: 'مؤسسة الأفق لتجهيز وصيانة المطابخ الفندقية المركزية ومعدات المطاعم والكافيهات',
    description: 'توريد وتركيب وتصنيع معدات المطابخ الفندقية من الستانلس ستيل المقاوم للصدأ (SS 304). تصنيع شوايات وفرن مندي أوتوماتيك، شوايات فحم وشاورما، ثلاجات تبريد وتجميد مركزية، وشفاطات دخان صناعية مع الضمان والصيانة الدورية.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-culinary',
    subCategoryNameAr: 'سياحة ومطاعم',
    sectionType: 'company_services',
    companyCrNumber: 'س.ت: 209381 / عدن',
    companyLicenseBadge: 'مؤسسة معتمدة للمعدات الصناعية والطهي التجاري',
    companyCoverageAreas: ['عدن', 'لحج', 'أبين', 'شبوة', 'حضرموت'],
    companyServicesList: [
      {
        id: 's-eq-1',
        nameAr: 'تصنيع خطوط الطهي وشوايات المندي والشاورما',
        descriptionAr: 'تفصيل ستانلس ستيل غذائي مقاوم للحرارة بمواصفات إيطالية وسخانات أوتوماتيكية.',
        priceEstimate: 'حسب المقاسات الهندسية'
      },
      {
        id: 's-eq-2',
        nameAr: 'توريد ثلاجات التبريد المركزية وغرف التجميد (Walk-in Freezers)',
        descriptionAr: 'محركات دانفوس أصلية وعزل حراري فائق للحفاظ على الأغذية في درجات حرارة الصيف.',
        priceEstimate: 'عروض توريد وتركيب مع الضمان سنتين'
      },
      {
        id: 's-eq-3',
        nameAr: 'عقود الصيانة الدورية وشبكات الغاز المركزي',
        descriptionAr: 'فريق صيانة متنقل 24/7 لإصلاح أعطال أفران الطهي وخلاطات العجين وثلاجات العرض.',
        priceEstimate: 'اشتراكات صيانة دورية شهرية'
      }
    ],
    companyPortfolio: [
      {
        id: 'p-eq-1',
        titleAr: 'تجهيز المطبخ المركزي لفندق كورال عدن',
        clientOrProject: 'إدارة فندق ومنتجع كورال عدن',
        year: '2024',
        scopeAr: 'تصنيع وتوريد كامل خطوط الطهي، أفران الكومبي، والثلاجات المركزية'
      },
      {
        id: 'p-eq-2',
        titleAr: 'تجهيز سلسلة مطاعم وكافيهات باريستا كوست - عدن',
        clientOrProject: 'مجموعة باريستا الاستثمارية',
        year: '2025',
        scopeAr: 'توريد محطات القهوة وشبكات المياه النقية وماكينات الإسبريسو الاحترافية'
      }
    ],
    price: null,
    currency: 'USD',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-aden',
    regionNameAr: 'عدن',
    cityId: 'ye-ade-mansoura',
    cityNameAr: 'المنصورة - المنطقة الصناعية',
    status: 'active',
    purpose: 'both',
    contactPhone: '+967 2 384455',
    whatsappNumber: '+967 773 221 100',
    contactEmail: 'info@alofooq-kitchens.com',
    sellerName: 'مؤسسة الأفق لتجهيز المطابخ الفندقية',
    sellerType: 'company',
    sellerVerified: true,
    sellerRating: 4.88,
    createdAt: 'منذ يوم',
    viewsCount: 780,
    attributes: [
      { key: 'cr', labelAr: 'السجل التجاري', valueAr: '209381 / عدن', labelEn: 'Commercial Reg', valueEn: '209381' },
      { key: 'warranty', labelAr: 'الضمان', valueAr: 'ضمان سنتين شامل قطع الغيار الأصلية', labelEn: 'Warranty', valueEn: '2 Years' }
    ],
    media: [
      { id: 'm-eq-1', url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  },

  // =========================================================================
  // إعلانات تصنيفات أخرى (Cars, Real-estate, Electronics, Services)
  // =========================================================================
  {
    id: 'listing-car-1',
    title: 'تويوتا لاندكروزر برادو 2022 TXL فل كامل مجمرك جاهز لوحات',
    description: 'سيارة تويوتا برادو بحالة الوكالة شبه جديدة، موديل 2022، قاطع 34 ألف كم فقط. محرك 6 سلندر 4.0 لتر، فتحة سقف، شاشة ملاحة وكاميرات 360، حساسات، مقاعد جلد كهرباء، خالية من أي صدم أو رش.',
    categoryId: 'cars',
    categoryNameAr: 'سيارات',
    subCategoryId: 'cars-sale',
    subCategoryNameAr: 'سيارات للبيع',
    sectionType: 'general',
    price: 43000,
    currency: 'USD',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-sanaa',
    regionNameAr: 'صنعاء',
    cityId: 'ye-san-sabeein',
    cityNameAr: 'السبعين',
    status: 'premium',
    purpose: 'both',
    contactPhone: '+967 771 555 444',
    whatsappNumber: '+967 771 555 444',
    sellerName: 'معرض الأمانة للسيارات الحديثة',
    sellerType: 'company',
    sellerVerified: true,
    sellerRating: 5.0,
    createdAt: 'منذ 3 ساعات',
    viewsCount: 890,
    clicksCount: 380,
    attributes: [
      { key: 'make', labelAr: 'الشركة المصنعة', valueAr: 'تويوتا (Toyota)', labelEn: 'Make', valueEn: 'Toyota' },
      { key: 'year', labelAr: 'سنة الصنع', valueAr: '2022', labelEn: 'Year', valueEn: '2022' },
      { key: 'mileage', labelAr: 'الممشى', valueAr: '34,000 كم', labelEn: 'Mileage', valueEn: '34,000 km' },
      { key: 'transmission', labelAr: 'ناقل الحركة', valueAr: 'أوتوماتيك', labelEn: 'Transmission', valueEn: 'Automatic' }
    ],
    media: [
      { id: 'm-4', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 },
      { id: 'm-5', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80', isPrimary: false, orderWeight: 1 }
    ]
  },
  {
    id: 'listing-realestate-1',
    title: 'شقة مفروشة VIP فاخرة للإيجار السنوي أو الشهري في حدة',
    description: 'شقة فاخرة تشطيب ديلوكس في أرقى أحياء حدة بالقرب من المنظمات والخدمات، تتكون من 3 غرف نوم ومجلس واسع وصالة معيشة و3 حمامات ومطبخ مجهز بالكامل. طاقة شمسية 24 ساعة، ومصعد وحراسة وموقف سيارة خاص.',
    categoryId: 'real-estate',
    categoryNameAr: 'عقارات',
    subCategoryId: 're-rent-apt',
    subCategoryNameAr: 'شقق للإيجار',
    sectionType: 'general',
    price: 800,
    currency: 'USD',
    priceNegotiable: false,
    countryId: 'ye',
    regionId: 'ye-sanaa',
    regionNameAr: 'صنعاء',
    cityId: 'ye-san-hadda',
    cityNameAr: 'حدة والحي الدبلوماسي',
    status: 'premium',
    purpose: 'call_me',
    contactPhone: '+967 770 223 344',
    whatsappNumber: '+967 770 223 344',
    sellerName: 'مكتب الهضبة العقاري',
    sellerType: 'agency',
    sellerVerified: true,
    sellerRating: 4.7,
    createdAt: 'منذ 5 ساعات',
    viewsCount: 512,
    clicksCount: 220,
    attributes: [
      { key: 'rooms', labelAr: 'عدد الغرف', valueAr: '3 غرف نوم + مجلس', labelEn: 'Bedrooms', valueEn: '3 Bed + Majlis' },
      { key: 'bathrooms', labelAr: 'دورات المياه', valueAr: '3 حمامات', labelEn: 'Bathrooms', valueEn: '3 Baths' },
      { key: 'furnished', labelAr: 'الفرش', valueAr: 'نعم - مفروشة بالكامل أثاث تركي', labelEn: 'Furnished', valueEn: 'Fully Furnished' }
    ],
    media: [
      { id: 'm-6', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  },
  {
    id: 'listing-tech-worker-1',
    title: 'مهندس برمجيات وتطبيقات متفرغ - React Native & Flutter وأنظمة سحابية',
    description: 'مطور برمجيات متفرغ لإنشاء تطبيقات الموبايل الهجينة والمواقع السريعة ولوحات التحكم. خبرة في ربط بوابات الدفع المحلية في اليمن (الكريمي، فلوسك، جايبي) والأنظمة السحابية.',
    categoryId: 'jobs',
    categoryNameAr: 'وظائف',
    subCategoryId: 'jobs-programming',
    subCategoryNameAr: 'برمجة',
    sectionType: 'worker_profiles',
    workerTitle: 'مهندس برمجيات وتطبيقات ويب وموبايل',
    workerExperienceYears: '5 سنوات',
    workerSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'ربط بوابات دفع يمنية'],
    travelReadiness: 'العمل عن بعد (Remote) أو في عدن وصنعاء',
    price: null,
    currency: 'USD',
    priceNegotiable: true,
    countryId: 'ye',
    regionId: 'ye-aden',
    regionNameAr: 'عدن',
    cityId: 'ye-ade-mansoura',
    cityNameAr: 'المنصورة',
    status: 'active',
    purpose: 'message_me',
    contactPhone: '+967 737 444 888',
    whatsappNumber: '+967 737 444 888',
    sellerName: 'م. أحمد باوزير',
    sellerType: 'personal',
    sellerVerified: true,
    sellerRating: 5.0,
    createdAt: 'منذ 6 ساعات',
    viewsCount: 165,
    clicksCount: 75,
    attributes: [
      { key: 'techStack', labelAr: 'التقنيات', valueAr: 'React, Node, PostgreSQL, Python', labelEn: 'Tech Stack', valueEn: 'React, Node' },
      { key: 'workType', labelAr: 'طبيعة العمل', valueAr: 'عن بعد (Remote) أو عقود مشاريع', labelEn: 'Work Type', valueEn: 'Remote' }
    ],
    media: [
      { id: 'm-8', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', isPrimary: true, orderWeight: 0 }
    ]
  }
];

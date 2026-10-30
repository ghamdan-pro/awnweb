import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

// Unified categories data matching awnweb/src/data/categoriesData.ts (5 Main, 87 Subcategories)
const FALLBACK_CATEGORIES = [
  {
    "id": "jobs",
    "nameAr": "وظائف",
    "nameEn": "Jobs",
    "count": 127,
    "icon": "Briefcase",
    "slug": "jobs",
    "color": "#68142c",
    "subcategories": [
      {
        "id": "jobs-culinary",
        "nameAr": "سياحة ومطاعم",
        "nameEn": "Hospitality & Restaurants",
        "count": 12,
        "slug": "culinary",
        "fields": [
          {
            "key": "role",
            "labelAr": "المسمى الوظيفي",
            "labelEn": "Job Title",
            "type": "select",
            "options": [
              "شيف / طباخ ذبايح ورز مندي",
              "معلم بوفية وسندويشات",
              "معلم معصوب وعريكة",
              "معلم شاورما ومشويات",
              "مساعد طباخ",
              "كابتن صالة / ويتر"
            ]
          },
          {
            "key": "experience",
            "labelAr": "سنوات الخبرة",
            "labelEn": "Experience",
            "type": "select",
            "options": [
              "أقل من سنة",
              "1-3 سنوات",
              "3-5 سنوات",
              "أكثر من 5 سنوات"
            ]
          },
          {
            "key": "travelReady",
            "labelAr": "الاستعداد للسفر",
            "labelEn": "Willing to travel",
            "type": "select",
            "options": [
              "مستعد للسفر فوراً",
              "داخل اليمن فقط",
              "الخليج والسعودية"
            ]
          }
        ]
      },
      {
        "id": "jobs-design",
        "nameAr": "تصميم",
        "nameEn": "Design",
        "count": 14,
        "slug": "design",
        "fields": [
          {
            "key": "tool",
            "labelAr": "برامج التصميم",
            "labelEn": "Tools",
            "type": "text"
          },
          {
            "key": "portfolio",
            "labelAr": "رابط الأعمال",
            "labelEn": "Portfolio URL",
            "type": "text"
          }
        ]
      },
      {
        "id": "jobs-driver",
        "nameAr": "سائق",
        "nameEn": "Driver",
        "count": 13,
        "slug": "driver",
        "fields": [
          {
            "key": "licenseType",
            "labelAr": "نوع الرخصة",
            "labelEn": "License Type",
            "type": "select",
            "options": [
              "خصوصي",
              "عمومي خفيف",
              "عمومي ثقيل",
              "معدات"
            ]
          }
        ]
      },
      {
        "id": "jobs-accounting",
        "nameAr": "حسابات",
        "nameEn": "Accounting",
        "count": 12,
        "slug": "accounting"
      },
      {
        "id": "jobs-labor",
        "nameAr": "عمال",
        "nameEn": "Laborers",
        "count": 8,
        "slug": "labor"
      },
      {
        "id": "jobs-management",
        "nameAr": "إدارة",
        "nameEn": "Management",
        "count": 7,
        "slug": "management"
      },
      {
        "id": "jobs-crafts",
        "nameAr": "حرفيين",
        "nameEn": "Craftsmen",
        "count": 7,
        "slug": "crafts"
      },
      {
        "id": "jobs-nursing",
        "nameAr": "طب وتمريض",
        "nameEn": "Medical & Nursing",
        "count": 6,
        "slug": "nursing"
      },
      {
        "id": "jobs-programming",
        "nameAr": "برمجة",
        "nameEn": "Programming",
        "count": 5,
        "slug": "programming",
        "fields": [
          {
            "key": "techStack",
            "labelAr": "لغات البرمجة والتقنيات",
            "labelEn": "Tech Stack",
            "type": "text"
          },
          {
            "key": "workType",
            "labelAr": "طبيعة العمل",
            "labelEn": "Work Type",
            "type": "select",
            "options": [
              "عن بعد (Remote)",
              "دوام كامل حضوري",
              "دوام جزئي",
              "مشاريع حرة"
            ]
          }
        ]
      },
      {
        "id": "jobs-tech",
        "nameAr": "تقني",
        "nameEn": "Technical & IT",
        "count": 4,
        "slug": "tech"
      },
      {
        "id": "jobs-sales",
        "nameAr": "مبيعات وتسويق",
        "nameEn": "Sales & Marketing",
        "count": 4,
        "slug": "sales"
      },
      {
        "id": "jobs-writing",
        "nameAr": "محررين",
        "nameEn": "Editors & Copywriters",
        "count": 1,
        "slug": "writing"
      },
      {
        "id": "jobs-hr",
        "nameAr": "موارد بشرية",
        "nameEn": "Human Resources",
        "count": 1,
        "slug": "hr"
      },
      {
        "id": "jobs-editing",
        "nameAr": "مونتاج وإخراج",
        "nameEn": "Video Production",
        "count": 1,
        "slug": "editing"
      },
      {
        "id": "jobs-fashion",
        "nameAr": "أزياء",
        "nameEn": "Fashion",
        "count": 0,
        "slug": "fashion"
      },
      {
        "id": "jobs-beauty",
        "nameAr": "تزيين وتجميل",
        "nameEn": "Beauty & Salon",
        "count": 0,
        "slug": "beauty"
      },
      {
        "id": "jobs-childcare",
        "nameAr": "حضانة أطفال",
        "nameEn": "Childcare",
        "count": 0,
        "slug": "childcare"
      },
      {
        "id": "jobs-secretarial",
        "nameAr": "سكرتارية",
        "nameEn": "Secretarial",
        "count": 0,
        "slug": "secretarial"
      },
      {
        "id": "jobs-travel",
        "nameAr": "سياحة وسفر",
        "nameEn": "Travel & Tourism",
        "count": 0,
        "slug": "travel"
      },
      {
        "id": "jobs-pr",
        "nameAr": "علاقات عامة",
        "nameEn": "Public Relations",
        "count": 0,
        "slug": "pr"
      },
      {
        "id": "jobs-cleaning",
        "nameAr": "عمال تنظيف",
        "nameEn": "Cleaning Staff",
        "count": 0,
        "slug": "cleaning"
      },
      {
        "id": "jobs-domestic",
        "nameAr": "عمالة منزلية",
        "nameEn": "Domestic Help",
        "count": 0,
        "slug": "domestic"
      },
      {
        "id": "jobs-translators",
        "nameAr": "مترجمين",
        "nameEn": "Translators",
        "count": 0,
        "slug": "translators"
      },
      {
        "id": "jobs-misc",
        "nameAr": "متفرقات",
        "nameEn": "Miscellaneous",
        "count": 4,
        "slug": "misc"
      },
      {
        "id": "jobs-contracting",
        "nameAr": "مقاولات",
        "nameEn": "Contracting",
        "count": 4,
        "slug": "contracting"
      },
      {
        "id": "jobs-teaching",
        "nameAr": "تعليم وتدريس",
        "nameEn": "Teaching & Tutors",
        "count": 3,
        "slug": "teaching"
      },
      {
        "id": "jobs-security",
        "nameAr": "حراسة وأمن",
        "nameEn": "Security & Guarding",
        "count": 3,
        "slug": "security"
      },
      {
        "id": "jobs-engineering",
        "nameAr": "مهندس",
        "nameEn": "Engineering",
        "count": 3,
        "slug": "engineering"
      },
      {
        "id": "jobs-webdesign",
        "nameAr": "تصميم مواقع",
        "nameEn": "Web Design",
        "count": 2,
        "slug": "webdesign"
      },
      {
        "id": "jobs-tailor",
        "nameAr": "خياطين",
        "nameEn": "Tailoring",
        "count": 2,
        "slug": "tailor"
      },
      {
        "id": "jobs-partnership",
        "nameAr": "شراكة",
        "nameEn": "Partnership",
        "count": 2,
        "slug": "partnership"
      },
      {
        "id": "jobs-dataentry",
        "nameAr": "مدخل بيانات",
        "nameEn": "Data Entry",
        "count": 2,
        "slug": "dataentry"
      },
      {
        "id": "jobs-ac",
        "nameAr": "تقنيين تكييف وتبريد",
        "nameEn": "AC & Cooling",
        "count": 1,
        "slug": "ac"
      },
      {
        "id": "jobs-landscape",
        "nameAr": "حدائق ومناظر طبيعية",
        "nameEn": "Landscaping",
        "count": 1,
        "slug": "landscape"
      },
      {
        "id": "jobs-customer-service",
        "nameAr": "خدمة الزبائن",
        "nameEn": "Customer Service",
        "count": 1,
        "slug": "customer-service"
      }
    ]
  },
  {
    "id": "services",
    "nameAr": "خدمات",
    "nameEn": "Services",
    "count": 20,
    "icon": "Wrench",
    "slug": "services",
    "color": "#68142c",
    "subcategories": [
      {
        "id": "serv-business",
        "nameAr": "اعمال واستثمار",
        "nameEn": "Business & Investment",
        "count": 5,
        "slug": "business"
      },
      {
        "id": "serv-advertising",
        "nameAr": "دعاية واعلان",
        "nameEn": "Advertising & Marketing",
        "count": 4,
        "slug": "advertising"
      },
      {
        "id": "serv-professional",
        "nameAr": "خدمات احترافية",
        "nameEn": "Professional Services",
        "count": 2,
        "slug": "professional"
      },
      {
        "id": "serv-recruitment",
        "nameAr": "استقدام عمالة",
        "nameEn": "Manpower Supply",
        "count": 1,
        "slug": "recruitment"
      },
      {
        "id": "serv-buildings",
        "nameAr": "المباني والمنازل",
        "nameEn": "Buildings & Homes",
        "count": 1,
        "slug": "buildings"
      },
      {
        "id": "serv-cars",
        "nameAr": "خدمات السيارات",
        "nameEn": "Auto Services",
        "count": 1,
        "slug": "cars"
      },
      {
        "id": "serv-maintenance",
        "nameAr": "خدمات الصيانة",
        "nameEn": "Maintenance Services",
        "count": 1,
        "slug": "maintenance"
      },
      {
        "id": "serv-general",
        "nameAr": "خدمات عامة",
        "nameEn": "General Services",
        "count": 1,
        "slug": "general"
      },
      {
        "id": "serv-realestate",
        "nameAr": "خدمات عقارية",
        "nameEn": "Real Estate Services",
        "count": 1,
        "slug": "realestate"
      },
      {
        "id": "serv-travel",
        "nameAr": "سياحة وسفر",
        "nameEn": "Travel & Tourism",
        "count": 1,
        "slug": "travel"
      },
      {
        "id": "serv-contracting",
        "nameAr": "مقاولات",
        "nameEn": "Contracting",
        "count": 1,
        "slug": "contracting"
      },
      {
        "id": "serv-hr",
        "nameAr": "موارد بشرية",
        "nameEn": "HR Consulting",
        "count": 1,
        "slug": "hr"
      },
      {
        "id": "serv-telecom",
        "nameAr": "اتصالات",
        "nameEn": "Telecom",
        "count": 0,
        "slug": "telecom"
      },
      {
        "id": "serv-internet",
        "nameAr": "انترنت",
        "nameEn": "Internet Services",
        "count": 0,
        "slug": "internet"
      },
      {
        "id": "serv-car-rental",
        "nameAr": "تأجير سيارات",
        "nameEn": "Car Rental",
        "count": 0,
        "slug": "car-rental"
      },
      {
        "id": "serv-paperwork",
        "nameAr": "تخليص معاملات",
        "nameEn": "Paperwork Clearance",
        "count": 0,
        "slug": "paperwork"
      },
      {
        "id": "serv-translation",
        "nameAr": "ترجمة",
        "nameEn": "Translation",
        "count": 0,
        "slug": "translation"
      },
      {
        "id": "serv-entertainment",
        "nameAr": "تسلية",
        "nameEn": "Entertainment",
        "count": 0,
        "slug": "entertainment"
      },
      {
        "id": "serv-events",
        "nameAr": "تنظيم حفلات",
        "nameEn": "Event Management",
        "count": 0,
        "slug": "events"
      },
      {
        "id": "serv-security",
        "nameAr": "حراسة وأمن",
        "nameEn": "Security Services",
        "count": 0,
        "slug": "security"
      },
      {
        "id": "serv-computers",
        "nameAr": "حواسيب",
        "nameEn": "Computer Repair",
        "count": 0,
        "slug": "computers"
      },
      {
        "id": "serv-cleaning",
        "nameAr": "خدمات تنظيف",
        "nameEn": "Cleaning Services",
        "count": 0,
        "slug": "cleaning"
      },
      {
        "id": "serv-agriculture",
        "nameAr": "خدمات زراعية",
        "nameEn": "Agricultural Services",
        "count": 0,
        "slug": "agriculture"
      },
      {
        "id": "serv-tutoring",
        "nameAr": "دروس خصوصية",
        "nameEn": "Private Tutoring",
        "count": 0,
        "slug": "tutoring"
      },
      {
        "id": "serv-shipping",
        "nameAr": "شحن",
        "nameEn": "Shipping & Logistics",
        "count": 0,
        "slug": "shipping"
      },
      {
        "id": "serv-beauty",
        "nameAr": "صحة وجمال",
        "nameEn": "Health & Beauty",
        "count": 0,
        "slug": "beauty"
      },
      {
        "id": "serv-tax",
        "nameAr": "ضريبة ومال",
        "nameEn": "Tax & Accounting",
        "count": 0,
        "slug": "tax"
      },
      {
        "id": "serv-home-cooking",
        "nameAr": "طبخ منزلي",
        "nameEn": "Home Cooking",
        "count": 0,
        "slug": "home-cooking"
      },
      {
        "id": "serv-law",
        "nameAr": "محاماة وقانون",
        "nameEn": "Legal Services",
        "count": 0,
        "slug": "law"
      },
      {
        "id": "serv-flatshare",
        "nameAr": "مشاركة سكن",
        "nameEn": "Roommate / Flatshare",
        "count": 0,
        "slug": "flatshare"
      },
      {
        "id": "serv-lostfound",
        "nameAr": "مفقودات",
        "nameEn": "Lost & Found",
        "count": 0,
        "slug": "lostfound"
      },
      {
        "id": "serv-pestcontrol",
        "nameAr": "مكافحة الحشرات",
        "nameEn": "Pest Control",
        "count": 0,
        "slug": "pestcontrol"
      },
      {
        "id": "serv-training",
        "nameAr": "مهارات وتدريب",
        "nameEn": "Skills & Training",
        "count": 0,
        "slug": "training"
      }
    ]
  },
  {
    "id": "real-estate",
    "nameAr": "عقارات",
    "nameEn": "Real Estate",
    "count": 85,
    "icon": "Building2",
    "slug": "real-estate",
    "color": "#68142c",
    "subcategories": [
      {
        "id": "re-rent-apt",
        "nameAr": "شقق للإيجار",
        "nameEn": "Apartments for Rent",
        "count": 32,
        "slug": "rent-apt",
        "fields": [
          {
            "key": "rooms",
            "labelAr": "عدد الغرف",
            "labelEn": "Bedrooms",
            "type": "select",
            "options": [
              "غرفة واحدة",
              "غرفتين",
              "3 غرف",
              "4 غرف",
              "5+ غرف"
            ]
          },
          {
            "key": "bathrooms",
            "labelAr": "دورات المياه",
            "labelEn": "Bathrooms",
            "type": "select",
            "options": [
              "1",
              "2",
              "3",
              "4+"
            ]
          },
          {
            "key": "furnished",
            "labelAr": "مفروشة",
            "labelEn": "Furnished",
            "type": "select",
            "options": [
              "نعم - مفروشة بالكامل",
              "نصف مفروشة",
              "غير مفروشة"
            ]
          },
          {
            "key": "floor",
            "labelAr": "الطابق",
            "labelEn": "Floor",
            "type": "number"
          }
        ]
      },
      {
        "id": "re-sale-apt",
        "nameAr": "شقق للبيع",
        "nameEn": "Apartments for Sale",
        "count": 18,
        "slug": "sale-apt"
      },
      {
        "id": "re-villa",
        "nameAr": "فلل وقصور للبيع والإيجار",
        "nameEn": "Villas & Houses",
        "count": 12,
        "slug": "villa"
      },
      {
        "id": "re-lands",
        "nameAr": "أراضي للبيع",
        "nameEn": "Lands for Sale",
        "count": 14,
        "slug": "lands",
        "fields": [
          {
            "key": "area",
            "labelAr": "المساحة (لبنة / قصبة / م²)",
            "labelEn": "Area",
            "type": "text"
          },
          {
            "key": "streetWidth",
            "labelAr": "عرض الشارع",
            "labelEn": "Street Width",
            "type": "text"
          }
        ]
      },
      {
        "id": "re-commercial",
        "nameAr": "محلات ومكاتب تجارية",
        "nameEn": "Commercial & Shops",
        "count": 9,
        "slug": "commercial"
      }
    ]
  },
  {
    "id": "cars",
    "nameAr": "سيارات",
    "nameEn": "Cars & Vehicles",
    "count": 64,
    "icon": "Car",
    "slug": "cars",
    "color": "#68142c",
    "subcategories": [
      {
        "id": "cars-sale",
        "nameAr": "سيارات للبيع",
        "nameEn": "Cars for Sale",
        "count": 45,
        "slug": "cars-sale",
        "fields": [
          {
            "key": "make",
            "labelAr": "الشركة المصنعة",
            "labelEn": "Make",
            "type": "select",
            "options": [
              "تويوتا (Toyota)",
              "هيونداي (Hyundai)",
              "كيا (Kia)",
              "مرسيدس (Mercedes)",
              "نيسان (Nissan)",
              "لكزس (Lexus)",
              "شفروليه (Chevrolet)",
              "أخرى"
            ]
          },
          {
            "key": "year",
            "labelAr": "سنة الصنع",
            "labelEn": "Year",
            "type": "number"
          },
          {
            "key": "transmission",
            "labelAr": "ناقل الحركة",
            "labelEn": "Transmission",
            "type": "select",
            "options": [
              "أوتوماتيك",
              "يدوي / عادي"
            ]
          },
          {
            "key": "mileage",
            "labelAr": "الممشى (كم)",
            "labelEn": "Mileage (km)",
            "type": "number"
          },
          {
            "key": "fuel",
            "labelAr": "نوع الوقود",
            "labelEn": "Fuel",
            "type": "select",
            "options": [
              "بنزين",
              "ديزل",
              "غاز",
              "هايبرد / كهرباء"
            ]
          },
          {
            "key": "customs",
            "labelAr": "حالة الجمارك",
            "labelEn": "Customs Status",
            "type": "select",
            "options": [
              "مجمرك جاهز لوحات",
              "مجمرك بدون ترقيم",
              "غير مجمرك (شحن جديد)"
            ]
          }
        ]
      },
      {
        "id": "cars-rent",
        "nameAr": "سيارات للإيجار",
        "nameEn": "Cars for Rent",
        "count": 6,
        "slug": "cars-rent"
      },
      {
        "id": "cars-bikes",
        "nameAr": "دراجات نارية ودبابات",
        "nameEn": "Motorcycles",
        "count": 5,
        "slug": "bikes"
      },
      {
        "id": "cars-trucks",
        "nameAr": "شاحنات ومعدات ثقيلة",
        "nameEn": "Trucks & Heavy Machinery",
        "count": 4,
        "slug": "trucks"
      },
      {
        "id": "cars-parts",
        "nameAr": "قطع غيار وإكسسوارات",
        "nameEn": "Spare Parts & Accessories",
        "count": 4,
        "slug": "parts"
      }
    ]
  },
  {
    "id": "misc",
    "nameAr": "منوعات",
    "nameEn": "Miscellaneous",
    "count": 36,
    "icon": "Package",
    "slug": "misc",
    "color": "#68142c",
    "subcategories": [
      {
        "id": "misc-numbers",
        "nameAr": "ارقام مميزة",
        "nameEn": "VIP Phone Numbers",
        "count": 8,
        "slug": "vip-numbers"
      },
      {
        "id": "misc-electronics",
        "nameAr": "الكترونيات",
        "nameEn": "Electronics",
        "count": 11,
        "slug": "electronics"
      },
      {
        "id": "misc-software",
        "nameAr": "برامج تطبيقية",
        "nameEn": "Apps & Software",
        "count": 4,
        "slug": "software"
      },
      {
        "id": "misc-cosmetics",
        "nameAr": "مستحضرات تجميل",
        "nameEn": "Cosmetics",
        "count": 3,
        "slug": "cosmetics"
      },
      {
        "id": "misc-industrial",
        "nameAr": "معدات صناعية",
        "nameEn": "Industrial Equipment",
        "count": 3,
        "slug": "industrial"
      },
      {
        "id": "misc-collectibles",
        "nameAr": "مقتنيات",
        "nameEn": "Collectibles & Antiques",
        "count": 2,
        "slug": "collectibles"
      },
      {
        "id": "misc-instruments",
        "nameAr": "آلات موسيقية",
        "nameEn": "Musical Instruments",
        "count": 1,
        "slug": "instruments"
      },
      {
        "id": "misc-appliances",
        "nameAr": "أجهزة منزلية",
        "nameEn": "Home Appliances",
        "count": 2,
        "slug": "appliances"
      },
      {
        "id": "misc-security",
        "nameAr": "أنظمة أمن وحماية",
        "nameEn": "Security Systems & CCTV",
        "count": 2,
        "slug": "cctv"
      }
    ]
  }
];

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
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
              fields: sub.fields || [],
            })),
        }));

        res.status(200).json({ success: true, data: hierarchy });
        return;
      }
    } catch (e) {
      // Supabase unavailable, fall through to fallback
    }

    res.status(200).json({ success: true, data: FALLBACK_CATEGORIES });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

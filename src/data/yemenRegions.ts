export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface Region {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  cities: City[];
}

export interface Country {
  id: string;
  nameAr: string;
  nameEn: string;
  dialCode: string;
  currency: string;
  currencySymbol: string;
  regions: Region[];
}

export const COUNTRIES: Country[] = [
  {
    id: 'ye',
    nameAr: 'اليَمَن',
    nameEn: 'Yemen',
    dialCode: '+967',
    currency: 'YER',
    currencySymbol: 'ريال يمني',
    regions: [
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
        ]
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
          { id: 'ye-ade-dar', nameAr: 'دار سعد', nameEn: 'Dar Saad' },
        ]
      },
      {
        id: 'ye-taiz',
        nameAr: 'تعز',
        nameEn: 'Taiz',
        code: 'TAI',
        cities: [
          { id: 'ye-tai-mudhafar', nameAr: 'المظفر', nameEn: 'Al-Mudhaffar' },
          { id: 'ye-tai-qahirah', nameAr: 'القاهرة', nameEn: 'Al-Qahirah' },
          { id: 'ye-tai-houban', nameAr: 'الحوبان', nameEn: 'Al-Houban' },
          { id: 'ye-tai-salah', nameAr: 'صالة', nameEn: 'Salah' },
          { id: 'ye-tai-turbah', nameAr: 'التربة / الشمايتين', nameEn: 'Al-Turbah' },
        ]
      },
      {
        id: 'ye-hadhramaut',
        nameAr: 'حضرموت',
        nameEn: 'Hadhramaut',
        code: 'HAD',
        cities: [
          { id: 'ye-had-mukalla', nameAr: 'المكلا (ساحل حضرموت)', nameEn: 'Al-Mukalla' },
          { id: 'ye-had-seiyun', nameAr: 'سيئون (وادي حضرموت)', nameEn: 'Seiyun' },
          { id: 'ye-had-shihr', nameAr: 'الشحر', nameEn: 'Al-Shihr' },
          { id: 'ye-had-tarim', nameAr: 'تريم الغناء', nameEn: 'Tarim' },
          { id: 'ye-had-doan', nameAr: 'وادي دوعن', nameEn: 'Wadi Doan' },
        ]
      },
      {
        id: 'ye-hodeidah',
        nameAr: 'الحديدة',
        nameEn: 'Al-Hodeidah',
        code: 'HOD',
        cities: [
          { id: 'ye-hod-hawak', nameAr: 'الحوك', nameEn: 'Al-Hawak' },
          { id: 'ye-hod-mina', nameAr: 'الميناء', nameEn: 'Al-Mina' },
          { id: 'ye-hod-hali', nameAr: 'الحالي', nameEn: 'Al-Hali' },
          { id: 'ye-hod-zabid', nameAr: 'زبيد التاريخية', nameEn: 'Zabid' },
          { id: 'ye-hod-bajil', nameAr: 'باجل', nameEn: 'Bajil' },
        ]
      },
      {
        id: 'ye-ibb',
        nameAr: 'إب',
        nameEn: 'Ibb',
        code: 'IBB',
        cities: [
          { id: 'ye-ibb-dhihar', nameAr: 'الظهار', nameEn: 'Al-Dhihar' },
          { id: 'ye-ibb-mashnah', nameAr: 'المشنة', nameEn: 'Al-Mashnah' },
          { id: 'ye-ibb-yerim', nameAr: 'يريم', nameEn: 'Yerim' },
          { id: 'ye-ibb-jibleh', nameAr: 'جبلة', nameEn: 'Jiblah' },
          { id: 'ye-ibb-udain', nameAr: 'العدين', nameEn: 'Al-Udain' },
        ]
      },
      {
        id: 'ye-marib',
        nameAr: 'مأرب',
        nameEn: 'Marib',
        code: 'MAR',
        cities: [
          { id: 'ye-mar-city', nameAr: 'مدينة مأرب', nameEn: 'Marib City' },
          { id: 'ye-mar-wadi', nameAr: 'الوادي', nameEn: 'Al-Wadi' },
          { id: 'ye-mar-harib', nameAr: 'حريب', nameEn: 'Harib' },
        ]
      },
      {
        id: 'ye-dhamar',
        nameAr: 'ذمار',
        nameEn: 'Dhamar',
        code: 'DHA',
        cities: [
          { id: 'ye-dha-city', nameAr: 'مدينة ذمار', nameEn: 'Dhamar City' },
          { id: 'ye-dha-ans', nameAr: 'عنس', nameEn: 'Anas' },
        ]
      },
      {
        id: 'ye-shabwah',
        nameAr: 'شبوة',
        nameEn: 'Shabwah',
        code: 'SHB',
        cities: [
          { id: 'ye-shb-ataq', nameAr: 'عتق', nameEn: 'Ataq' },
          { id: 'ye-shb-bayhan', nameAr: 'بيحان', nameEn: 'Bayhan' },
        ]
      },
      {
        id: 'ye-mahrah',
        nameAr: 'المهرة',
        nameEn: 'Al-Mahrah',
        code: 'MAH',
        cities: [
          { id: 'ye-mah-ghaida', nameAr: 'الغيضة', nameEn: 'Al-Ghaydah' },
          { id: 'ye-mah-shehin', nameAr: 'شحن', nameEn: 'Shehin' },
        ]
      },
      {
        id: 'ye-socotra',
        nameAr: 'أرخبيل سقطرى',
        nameEn: 'Socotra Archipelago',
        code: 'SOC',
        cities: [
          { id: 'ye-soc-hadibu', nameAr: 'حديبو', nameEn: 'Hadibu' },
          { id: 'ye-soc-qalansiyah', nameAr: 'قلنسية', nameEn: 'Qalansiyah' },
        ]
      },
    ]
  },
  {
    id: 'sa',
    nameAr: 'السعودية (المغتربين)',
    nameEn: 'Saudi Arabia (Expats)',
    dialCode: '+966',
    currency: 'SAR',
    currencySymbol: 'ريال سعودي',
    regions: [
      {
        id: 'sa-riyadh',
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        code: 'RUH',
        cities: [
          { id: 'sa-ruh-center', nameAr: 'وسط الرياض والبطحاء', nameEn: 'Central Riyadh' },
          { id: 'sa-ruh-north', nameAr: 'شمال الرياض', nameEn: 'North Riyadh' },
        ]
      },
      {
        id: 'sa-jeddah',
        nameAr: 'جدة ومكة',
        nameEn: 'Jeddah & Makkah',
        code: 'JED',
        cities: [
          { id: 'sa-jed-center', nameAr: 'جدة - البلد والصفا', nameEn: 'Jeddah' },
          { id: 'sa-mak-center', nameAr: 'مكة المكرمة', nameEn: 'Makkah' },
        ]
      },
      {
        id: 'sa-south',
        nameAr: 'المنطقة الجنوبية (جازان / عسير / نجران)',
        nameEn: 'Southern Region',
        code: 'SOU',
        cities: [
          { id: 'sa-sou-jizan', nameAr: 'جازان', nameEn: 'Jizan' },
          { id: 'sa-sou-abha', nameAr: 'أبها وخميس مشيط', nameEn: 'Abha & Khamis' },
          { id: 'sa-sou-najran', nameAr: 'نجران', nameEn: 'Najran' },
        ]
      }
    ]
  }
];

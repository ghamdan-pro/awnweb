import { Listing } from '../data/mockListings';
import { Category } from '../data/categoriesData';

/**
 * Utility to export tabular data to CSV with UTF-8 BOM so Microsoft Excel
 * on Windows and Mac opens Arabic text perfectly without encoding issues.
 */
export function exportToExcelCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) for Excel
  const BOM = '\uFEFF';

  const escapeCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all listings to Excel
 */
export function exportListingsToExcel(listings: Listing[], lang: 'ar' | 'en' = 'ar') {
  const isAr = lang === 'ar';
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = isAr ? `اعلانات_عون_يمن_${dateStr}` : `awn_yemen_listings_${dateStr}`;

  const headers = isAr
    ? [
        'معرف الإعلان',
        'عنوان الإعلان',
        'القسم الرئيسي',
        'القسم الفرعي',
        'السعر',
        'العملة',
        'المحافظة',
        'المدينة',
        'الحالة',
        'اسم المعلن',
        'نوع الحساب',
        'رقم الهاتف',
        'رقم الواتساب',
        'عدد المشاهدات',
        'عدد النقرات',
        'تاريخ النشر',
      ]
    : [
        'ID',
        'Title',
        'Category',
        'SubCategory',
        'Price',
        'Currency',
        'Region',
        'City',
        'Status',
        'Seller Name',
        'Seller Type',
        'Phone',
        'WhatsApp',
        'Views',
        'Clicks',
        'Created At',
      ];

  const rows = listings.map((l) => [
    l.id,
    l.title,
    l.categoryNameAr,
    l.subCategoryNameAr,
    l.price !== null ? l.price : (isAr ? 'عند الاتفاق' : 'Negotiable'),
    l.currency,
    l.regionNameAr,
    l.cityNameAr,
    l.status === 'premium' ? (isAr ? 'مميز ★' : 'Featured') : l.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معلق' : 'Pending'),
    l.sellerName,
    l.sellerType,
    l.contactPhone,
    l.whatsappNumber || l.contactPhone,
    l.viewsCount || 0,
    l.clicksCount || 0,
    l.createdAt || '',
  ]);

  exportToExcelCsv(filename, headers, rows);
}

/**
 * Export all categories and subcategories to Excel
 */
export function exportCategoriesToExcel(categories: Category[], listings: Listing[], lang: 'ar' | 'en' = 'ar') {
  const isAr = lang === 'ar';
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = isAr ? `اقسام_عون_يمن_${dateStr}` : `awn_yemen_categories_${dateStr}`;

  const headers = isAr
    ? [
        'معرف القسم',
        'المستوى',
        'معرف القسم الأب',
        'الاسم بالعربي',
        'الاسم بالإنجليزي',
        'الرمز (Slug)',
        'الأيقونة',
        'لون التمييز',
        'عدد الإعلانات المرتبطة',
      ]
    : [
        'Category ID',
        'Level',
        'Parent ID',
        'Name (AR)',
        'Name (EN)',
        'Slug',
        'Icon',
        'Accent Color',
        'Ads Count',
      ];

  const rows: (string | number)[][] = [];

  categories.forEach((cat) => {
    const parentAdsCount = listings.filter((l) => l.categoryId === cat.id).length;
    // Parent Row (Level 1)
    rows.push([
      cat.id,
      isAr ? 'قسم رئيسي (مستوى 1)' : 'Parent (Level 1)',
      '-',
      cat.nameAr,
      cat.nameEn,
      cat.slug,
      cat.icon,
      cat.color,
      parentAdsCount,
    ]);

    // Subcategories Rows (Level 2)
    cat.subcategories.forEach((sub) => {
      const subAdsCount = listings.filter((l) => l.subCategoryId === sub.id).length;
      rows.push([
        sub.id,
        isAr ? 'قسم فرعي (مستوى 2)' : 'Subcategory (Level 2)',
        cat.id,
        sub.nameAr,
        sub.nameEn,
        sub.slug,
        sub.icon || cat.icon,
        cat.color,
        subAdsCount,
      ]);
    });
  });

  exportToExcelCsv(filename, headers, rows);
}

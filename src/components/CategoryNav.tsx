import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, Wrench, Building2, Car, Package, Search, ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES, Category, SubCategory } from '../data/categoriesData';

interface CategoryNavProps {
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  onSelectCategory: (category?: Category, subCategory?: SubCategory) => void;
  lang: 'ar' | 'en';
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  lang
}) => {
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const isAr = lang === 'ar';

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);
  const activeSubCategory = activeCategory?.subcategories.find((s) => s.id === selectedSubCategoryId);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#68142c]" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-[#68142c]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#68142c]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#68142c]" />;
      case 'Package':
        return <Package className="w-5 h-5 text-[#68142c]" />;
      default:
        return <Layers className="w-5 h-5 text-[#68142c]" />;
    }
  };

  // If a category is selected, show its subcategories drill-down view (Mourjan style)
  if (activeCategory) {
    const filteredSubs = activeCategory.subcategories.filter((sub) => {
      if (!subSearchQuery.trim()) return true;
      const q = subSearchQuery.toLowerCase();
      return sub.nameAr.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q);
    });

    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-5">
        {/* Subcategory Drilldown Header with Back Button (Mourjan blue/burgundy bar) */}
        <div className="bg-[#68142c] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectCategory(undefined, undefined);
                setSubSearchQuery('');
              }}
              className="p-1 hover:bg-white/20 rounded-md transition-colors flex items-center gap-1 text-sm font-bold"
            >
              <ArrowRight size={18} />
              <span>{isAr ? 'الرئيسية' : 'Back'}</span>
            </button>
            <span className="text-white/40">/</span>
            <span className="font-bold text-base">
              {isAr ? activeCategory.nameAr : activeCategory.nameEn}
            </span>
          </div>

          <span className="text-xs bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-full">
            {activeCategory.count} {isAr ? 'إعلان' : 'Ads'}
          </span>
        </div>

        {/* Search within subcategories */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <input
              type="text"
              value={subSearchQuery}
              onChange={(e) => setSubSearchQuery(e.target.value)}
              placeholder={isAr ? `بحث في ${activeCategory.nameAr}...` : `Search in ${activeCategory.nameEn}...`}
              className="w-full bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#68142c]/40"
            />
            <div className="absolute top-2.5 right-3 text-slate-400">
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* All Subcategories Option */}
        <div className="divide-y divide-slate-100">
          <button
            onClick={() => onSelectCategory(activeCategory, undefined)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right transition-colors ${
              !selectedSubCategoryId
                ? 'bg-amber-50 font-bold text-[#68142c]'
                : 'hover:bg-slate-50 text-slate-800'
            }`}
          >
            <span className="font-bold">{isAr ? `جميع إعلانات ${activeCategory.nameAr}` : `All ${activeCategory.nameEn} ads`}</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {activeCategory.count}
            </span>
          </button>

          {/* Subcategories List */}
          {filteredSubs.map((sub) => {
            const isSelected = selectedSubCategoryId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectCategory(activeCategory, sub)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right transition-colors ${
                  isSelected
                    ? 'bg-amber-50 font-bold text-[#68142c] border-r-4 border-[#68142c]'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#68142c]/60"></span>
                  <span className="font-medium text-slate-800">{isAr ? sub.nameAr : sub.nameEn}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-bold text-slate-500">{sub.count}</span>
                  <ChevronLeft size={16} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Top Main Categories View (Mourjan home screen list & desktop grid)
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-5">
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
          <Layers size={16} className="text-[#68142c]" />
          <span>{isAr ? 'الأقسام الرئيسية' : 'Main Categories'}</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {isAr ? 'اضغط لتصفح الأقسام الفرعية' : 'Click to explore subcategories'}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat, undefined)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition-colors text-right group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#68142c]/8 flex items-center justify-center shrink-0 group-hover:bg-[#68142c]/15 transition-colors">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block group-hover:text-[#68142c] transition-colors">
                  {isAr ? cat.nameAr : cat.nameEn}
                </span>
                <span className="text-xs text-slate-400">
                  {cat.subcategories.length} {isAr ? 'قسم فرعي' : 'subcategories'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-slate-600 px-2 py-0.5 rounded-full transition-colors">
                {cat.count}
              </span>
              <ChevronLeft size={18} className="text-slate-400 group-hover:text-[#68142c] transition-transform group-hover:-translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

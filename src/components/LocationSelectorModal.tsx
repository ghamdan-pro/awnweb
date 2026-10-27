import React, { useState } from 'react';
import { X, Search, Check, MapPin, Compass } from 'lucide-react';
import { COUNTRIES, Country, Region, City } from '../data/yemenRegions';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: Region;
  selectedCity?: City;
  onSelectLocation: (country: Country, region: Region, city?: City) => void;
  lang: 'ar' | 'en';
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedRegion,
  selectedCity,
  onSelectLocation,
  lang
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('ye');
  const [activeRegion, setActiveRegion] = useState<Region>(selectedRegion);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentCountry = COUNTRIES.find((c) => c.id === selectedCountryId) || COUNTRIES[0];
  const isAr = lang === 'ar';

  const filteredRegions = currentCountry.regions.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.nameAr.toLowerCase().includes(q) ||
      r.nameEn.toLowerCase().includes(q) ||
      r.cities.some((c) => c.nameAr.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#68142c] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-amber-400" />
            <h3 className="font-bold text-base">
              {isAr ? 'اختر الدولة والمحافظة / المنطقة' : 'Select Country & Governorate'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Country Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              onClick={() => {
                setSelectedCountryId(country.id);
                setActiveRegion(country.regions[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
                selectedCountryId === country.id
                  ? 'border-[#68142c] text-[#68142c] bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {country.id === 'ye' ? (
                <span className="w-4 h-3 flex flex-col border border-slate-300 rounded-xs overflow-hidden">
                  <span className="h-1 bg-[#ce1126]"></span>
                  <span className="h-1 bg-white"></span>
                  <span className="h-1 bg-black"></span>
                </span>
              ) : (
                <span className="w-4 h-3 bg-emerald-600 rounded-xs"></span>
              )}
              <span>{isAr ? country.nameAr : country.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن محافظة أو مدينة (مثلاً: صنعاء، حدة، عدن، المكلا)...' : 'Search city or governorate...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#68142c]/40"
            />
            <div className="absolute top-2.5 right-3 text-slate-400">
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* 2-Column Split: Governorates & Districts */}
        <div className="flex-1 grid grid-cols-2 divide-x divide-x-reverse divide-slate-200 overflow-hidden min-h-[320px]">
          {/* Left / First: Governorates */}
          <div className="overflow-y-auto p-2 space-y-1 bg-slate-50/50">
            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'المحافظات' : 'Governorates'}
            </div>
            {filteredRegions.map((region) => {
              const isSelected = activeRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setActiveRegion(region)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-right font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#68142c] text-white font-bold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                    <span>{isAr ? region.nameAr : region.nameEn}</span>
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                    {region.cities.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right / Second: Cities & Districts */}
          <div className="overflow-y-auto p-2 space-y-1 bg-white">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isAr ? `مديريات وأحياء ${activeRegion.nameAr}` : `Districts of ${activeRegion.nameEn}`}
              </span>
              <button
                onClick={() => {
                  onSelectLocation(currentCountry, activeRegion, undefined);
                  onClose();
                }}
                className="text-xs text-[#68142c] font-bold hover:underline"
              >
                {isAr ? 'كامل المحافظة' : 'All Province'}
              </button>
            </div>

            {/* Select Whole Governorate Option */}
            <button
              onClick={() => {
                onSelectLocation(currentCountry, activeRegion, undefined);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-right hover:bg-amber-50 text-slate-900 border border-dashed border-amber-300/80 mb-2 font-medium"
            >
              <span>{isAr ? `كل مناطق ${activeRegion.nameAr}` : `All of ${activeRegion.nameEn}`}</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                {isAr ? 'الكل' : 'All'}
              </span>
            </button>

            {activeRegion.cities.map((city) => {
              const isSelected = selectedCity?.id === city.id && selectedRegion.id === activeRegion.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectLocation(currentCountry, activeRegion, city);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${
                    isSelected
                      ? 'bg-amber-50 text-[#68142c] font-bold border border-amber-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{isAr ? city.nameAr : city.nameEn}</span>
                  {isSelected && <Check size={16} className="text-[#68142c]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isAr
              ? `المحدد حالياً: ${selectedRegion.nameAr}${selectedCity ? ` - ${selectedCity.nameAr}` : ''}`
              : `Current: ${selectedRegion.nameEn}${selectedCity ? ` - ${selectedCity.nameEn}` : ''}`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

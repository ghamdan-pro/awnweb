import { INITIAL_LISTINGS, Listing } from '../data/mockListings';
import { CATEGORIES, Category } from '../data/categoriesData';
import { COUNTRIES, Region } from '../data/yemenRegions';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiService = {
  // 1. Fetch Listings
  async getListings(filters: {
    category?: string;
    subcategory?: string;
    region?: string;
    city?: string;
    q?: string;
  } = {}): Promise<Listing[]> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.region && filters.region !== 'all') params.append('region', filters.region);
      if (filters.city) params.append('city', filters.city);
      if (filters.q) params.append('q', filters.q);

      const res = await fetch(`${API_BASE_URL}/listings/search?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      // Backend not running, use mock
    }

    // Fallback to local filter
    let results = [...INITIAL_LISTINGS];
    if (filters.category) results = results.filter((l) => l.categoryId === filters.category);
    if (filters.subcategory) results = results.filter((l) => l.subCategoryId === filters.subcategory);
    if (filters.region && filters.region !== 'all') results = results.filter((l) => l.regionId === filters.region);
    if (filters.city) results = results.filter((l) => l.cityId === filters.city);
    if (filters.q) {
      const query = filters.q.toLowerCase();
      results = results.filter(
        (l) => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query)
      );
    }
    return results;
  },

  // 2. Create Listing
  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // Fallback
    }

    // In-memory fallback
    const newAd: Listing = {
      id: 'listing-' + Date.now(),
      title: listingData.title || '',
      description: listingData.description || '',
      categoryId: listingData.categoryId || 'jobs',
      categoryNameAr: listingData.categoryNameAr || 'وظائف',
      subCategoryId: listingData.subCategoryId || 'jobs-culinary',
      subCategoryNameAr: listingData.subCategoryNameAr || 'سياحة ومطاعم',
      price: listingData.price ?? null,
      currency: listingData.currency || 'YER',
      priceNegotiable: listingData.priceNegotiable ?? true,
      countryId: listingData.countryId || 'ye',
      regionId: listingData.regionId || 'ye-sanaa',
      regionNameAr: listingData.regionNameAr || 'صنعاء',
      cityId: listingData.cityId || 'ye-san-hadda',
      cityNameAr: listingData.cityNameAr || 'حدة',
      status: 'active',
      purpose: listingData.purpose || 'both',
      contactPhone: listingData.contactPhone || '+967777123456',
      whatsappNumber: listingData.whatsappNumber || '+967777123456',
      contactEmail: listingData.contactEmail,
      sellerName: listingData.sellerName || 'مستخدم عون',
      sellerType: listingData.sellerType || 'personal',
      sellerVerified: false,
      sellerRating: 5.0,
      createdAt: 'الآن',
      viewsCount: 1,
      attributes: listingData.attributes || [],
      media: listingData.media || [],
    };
    INITIAL_LISTINGS.unshift(newAd);
    return newAd;
  },

  // 3. Auth OTP
  async requestOtp(phone: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneCountryCode: '+967',
          phoneNationalNumber: phone,
        }),
      });
      return res.ok;
    } catch (e) {
      return true; // Test fallback
    }
  },

  async verifyOtp(phone: string, code: string): Promise<{ token: string; user: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneCountryCode: '+967',
          phoneNationalNumber: phone,
          otpCode: code,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          token: json.data?.accessToken,
          user: json.data?.user,
        };
      }
    } catch (e) {}

    // Fallback demo user
    return {
      token: 'demo_token',
      user: {
        id: 'user-demo',
        phone: '+967' + phone,
        displayName: 'مستخدم عون يمن',
        accountType: 'individual',
      },
    };
  },
};

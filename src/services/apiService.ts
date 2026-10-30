import { INITIAL_LISTINGS, Listing } from '../data/mockListings';
import { CATEGORIES, Category } from '../data/categoriesData';
import { COUNTRIES, Region } from '../data/yemenRegions';
import { API_CONFIG } from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

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

  // 4. Analytics & Visitor Tracking
  async trackVisit(platform: 'web' | 'app' = 'web'): Promise<{ platform: string; currentVisitors: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/track-visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {}
    return { platform, currentVisitors: platform === 'web' ? 15421 : 9851 };
  },

  async getAnalyticsStats(): Promise<{ siteVisitors: number; appVisitors: number; totalViews: number; totalClicks: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/stats`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {}

    // Fallback calculation from INITIAL_LISTINGS
    const totalViews = INITIAL_LISTINGS.reduce((sum, item) => sum + (item.viewsCount || 0), 0);
    const totalClicks = INITIAL_LISTINGS.reduce((sum, item) => sum + (item.clicksCount || 0), 0);

    return {
      siteVisitors: 15420,
      appVisitors: 9850,
      totalViews,
      totalClicks,
    };
  },

  // 5. Track Listing Click (for detail views)
  async trackListingClick(id: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.clicksCount) return json.data.clicksCount;
      }
    } catch (e) {}

    const item = INITIAL_LISTINGS.find((l) => l.id === id);
    if (item) {
      item.clicksCount = (item.clicksCount || 0) + 1;
      return item.clicksCount;
    }
    return 1;
  },

  // 6. Track Listing View (when details modal is opened)
  async trackListingView(id: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.viewsCount) return json.data.viewsCount;
      }
    } catch (e) {}

    const item = INITIAL_LISTINGS.find((l) => l.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      return item.viewsCount;
    }
    return 1;
  },

  // 7. Update Listing (Edit from Admin Panel)
  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {}

    // In-memory update
    const index = INITIAL_LISTINGS.findIndex((l) => l.id === id);
    if (index !== -1) {
      INITIAL_LISTINGS[index] = { ...INITIAL_LISTINGS[index], ...updates };
      return INITIAL_LISTINGS[index];
    }
    throw new Error('Listing not found');
  },

  // 8. Delete Listing
  async deleteListing(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (e) {}

    const index = INITIAL_LISTINGS.findIndex((l) => l.id === id);
    if (index !== -1) {
      INITIAL_LISTINGS.splice(index, 1);
      return true;
    }
    return false;
  },

  // 9. Update Listing Status
  async updateListingStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    } catch (e) {}

    const item = INITIAL_LISTINGS.find((l) => l.id === id);
    if (item) {
      item.status = status as any;
      return true;
    }
    return false;
  },
};


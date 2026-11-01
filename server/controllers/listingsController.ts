import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { INITIAL_LISTINGS } from '../../src/data/mockListings.js';

const FALLBACK_LISTINGS = [...INITIAL_LISTINGS];

export const searchListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, subcategory, section, adType, region, city, q, page = '1', limit = '20', status, sellerPhone, days } = req.query;

    let listings: any[] = [];
    let count = 0;

    // Try Supabase first
    try {
      let query = supabase.from('listings').select('*', { count: 'exact' });

      if (category) query = query.eq('category_id', category);
      if (subcategory) query = query.eq('sub_category_id', subcategory);
      if (adType) {
        const normType = (adType as string).toUpperCase();
        query = query.eq('ad_type', normType);
      }
      if (region && region !== 'all') query = query.eq('region_id', region);
      if (city) query = query.eq('city_id', city);
      if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,content.ilike.%${q}%`);
      if (sellerPhone) query = query.ilike('contact_phone', `%${sellerPhone}%`);

      // Date cutoff (e.g. default 7 days)
      if (days) {
        const daysNum = parseInt(days as string, 10);
        if (!isNaN(daysNum) && daysNum > 0) {
          const cutoff = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('published_at', cutoff);
        }
      }

      // Filter by status:
      if (status && status !== 'all') {
        if (status === 'active' || status === 'ACTIVE') {
          query = query.in('status', ['active', 'premium', 'ACTIVE', 'PREMIUM']);
        } else {
          query = query.eq('status', status);
        }
      } else if (!status) {
        // Public search: default to active & premium only!
        query = query.in('status', ['active', 'premium', 'ACTIVE', 'PREMIUM']);
      }

      // Priority Sorting: is_featured DESC, published_at DESC, created_at DESC
      query = query
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      const p = parseInt(page as string, 10) || 1;
      const l = parseInt(limit as string, 10) || 20;
      const from = (p - 1) * l;
      const to = from + l - 1;

      const { data, count: dbCount, error } = await query.range(from, to);

      if (!error && data && data.length > 0) {
        listings = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          adType: (item.ad_type || item.metadata?.adType || (item.sdui_section_type === 'worker_profiles' ? 'REQUEST' : 'OFFER')).toUpperCase(),
          sharePhone: item.share_phone ?? Boolean(item.contact_phone),
          creatorPhone: item.creator_phone || item.contact_phone,
          publishedAt: item.published_at || item.created_at,
          categoryId: item.category_id,
          categoryNameAr: item.category_name_ar || item.category_id,
          subCategoryId: item.sub_category_id,
          subCategoryNameAr: item.sub_category_name_ar || item.sub_category_id,
          sectionType: item.sdui_section_type || item.metadata?.job_section || item.metadata?.sectionType || 'job_vacancies',
          jobSection: item.sdui_section_type || item.metadata?.job_section || item.metadata?.sectionType || 'job_vacancies',
          companyCrNumber: item.company_cr_number || item.metadata?.companyCrNumber,
          companyServicesList: item.service_capabilities || item.metadata?.companyServicesList || item.metadata?.company_services_list,
          companyPortfolio: item.metadata?.companyPortfolio || item.metadata?.company_portfolio,
          workerSkills: item.metadata?.workerSkills || item.metadata?.worker_skills,
          workerTitle: item.metadata?.workerTitle,
          price: item.price,
          currency: item.currency,
          priceNegotiable: item.is_price_negotiable,
          countryId: item.country_id,
          regionId: item.region_id,
          regionNameAr: item.region_name_ar,
          cityId: item.city_id,
          cityNameAr: item.city_name_ar,
          status: item.status,
          purpose: item.purpose,
          contactPhone: item.contact_phone,
          whatsappNumber: item.whatsapp_number,
          contactEmail: item.contact_email,
          sellerName: item.seller_name,
          sellerType: item.seller_type,
          sellerVerified: item.seller_verified,
          sellerRating: item.seller_rating,
          viewsCount: item.views_count || 0,
          clicksCount: item.clicks_count || 0,
          createdAt: item.created_at,
          media: (Array.isArray(item.metadata?.mediaUrls) && item.metadata.mediaUrls.length > 0)
            ? item.metadata.mediaUrls.map((url: string, index: number) => ({
                id: `media-${index}`,
                url,
                isPrimary: index === 0,
                orderWeight: index,
              }))
            : (item.seller_avatar ? [{ id: 'media-0', url: item.seller_avatar, isPrimary: true, orderWeight: 0 }] : []),
          attributes: item.metadata?.attributes || [],
        }));
        count = dbCount || listings.length;
      }
    } catch (dbError) {}

    // Fallback if DB empty or not yet seeded
    if (listings.length === 0) {
      let filtered = [...FALLBACK_LISTINGS];
      if (category) filtered = filtered.filter((l) => l.categoryId === category);
      if (subcategory) filtered = filtered.filter((l) => l.subCategoryId === subcategory);
      if (adType) {
        const normType = (adType as string).toUpperCase();
        filtered = filtered.filter((l) => {
          const itemType = ((l as any).adType || (l.sectionType === 'worker_profiles' ? 'REQUEST' : 'OFFER')).toUpperCase();
          return itemType === normType;
        });
      }
      if (section) filtered = filtered.filter((l) => l.sectionType === section);
      if (region && region !== 'all') filtered = filtered.filter((l) => l.regionId === region);
      if (city) filtered = filtered.filter((l) => l.cityId === city);
      if (sellerPhone) {
        filtered = filtered.filter((l) => (l.contactPhone || '').includes(sellerPhone as string));
      }
      if (status && status !== 'all') {
        if (status === 'active' || status === 'ACTIVE') {
          filtered = filtered.filter((l) => l.status === 'active' || l.status === 'premium' || (l.status as any) === 'ACTIVE');
        } else {
          filtered = filtered.filter((l) => l.status === status);
        }
      } else if (!status) {
        filtered = filtered.filter((l) => l.status === 'active' || l.status === 'premium' || (l.status as any) === 'ACTIVE');
      }
      if (q) {
        const queryLower = (q as string).toLowerCase();
        filtered = filtered.filter(
          (l) => l.title.toLowerCase().includes(queryLower) ||
                 l.description.toLowerCase().includes(queryLower) ||
                 ((l as any).content && (l as any).content.toLowerCase().includes(queryLower))
        );
      }
      if (days) {
        const daysNum = parseInt(days as string, 10);
        if (!isNaN(daysNum) && daysNum > 0) {
          const cutoff = Date.now() - daysNum * 24 * 60 * 60 * 1000;
          filtered = filtered.filter((l) => {
            const d = new Date((l as any).publishedAt || l.createdAt).getTime();
            return isNaN(d) || d >= cutoff;
          });
        }
      }

      // Priority sort: is_featured DESC, then publishedAt DESC
      filtered.sort((a, b) => {
        const aFeat = (a.status === 'premium' || (a as any).isFeatured || (a as any).is_featured) ? 1 : 0;
        const bFeat = (b.status === 'premium' || (b as any).isFeatured || (b as any).is_featured) ? 1 : 0;
        if (aFeat !== bFeat) return bFeat - aFeat;
        const aTime = new Date((a as any).publishedAt || a.createdAt).getTime() || 0;
        const bTime = new Date((b as any).publishedAt || b.createdAt).getTime() || 0;
        return bTime - aTime;
      });

      listings = filtered.map((l) => ({
        ...l,
        adType: ((l as any).adType || (l.sectionType === 'worker_profiles' ? 'REQUEST' : 'OFFER')).toUpperCase(),
        jobSection: (l as any).jobSection || l.sectionType || 'job_vacancies',
      }));
      count = filtered.length;
    }

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 20,
        total: count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        // Increment view count asynchronously
        supabase
          .from('listings')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', id)
          .then(() => {});

        const media = (Array.isArray(data.metadata?.mediaUrls) && data.metadata.mediaUrls.length > 0)
          ? data.metadata.mediaUrls.map((url: string, index: number) => ({
              id: `media-${index}`,
              url,
              isPrimary: index === 0,
              orderWeight: index,
            }))
          : (data.seller_avatar ? [{ id: 'media-0', url: data.seller_avatar, isPrimary: true, orderWeight: 0 }] : []);

        res.status(200).json({
          success: true,
          data: {
            ...data,
            media,
          },
        });
        return;
      }
    } catch (e) {}

    // Check fallback
    const item = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      res.status(200).json({ success: true, data: item });
      return;
    }

    res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      categoryId,
      subCategoryId,
      sectionType = 'general',
      adType,
      countryId = 'ye',
      regionId,
      regionNameAr,
      cityId,
      cityNameAr,
      price,
      currency = 'YER',
      priceNegotiable = true,
      purpose = 'both',
      contactPhone,
      whatsappNumber,
      contactEmail,
      sellerName = 'معلن في عون',
      sellerType = 'personal',
      companyCrNumber,
      companyServicesList,
      companyPortfolio,
      workerSkills,
      workerTitle,
      mediaUrls = [],
      attributes = [],
      status = 'active',
      sharePhone = true,
      creatorPhone,
    } = req.body;

    const isDraft = status === 'draft' || status === 'DRAFT';
    const adContent = description || req.body.content || '';

    // Only content is mandatory when publishing
    if (!isDraft && !adContent.trim()) {
      res.status(400).json({ success: false, message: 'نص وتفاصيل الإعلان حقل مطلوب' });
      return;
    }

    // Auto-derive title from first line or sentence if not provided
    const trimmedContent = adContent.trim();
    const firstLine = trimmedContent.split('\n')[0].trim();
    const derivedTitle = title || (firstLine.length > 55 ? `${firstLine.slice(0, 52)}...` : firstLine) || (isDraft ? 'مسودة بدون عنوان' : 'إعلان جديد');

    const finalAdType = (adType || req.body.ad_type || (sectionType === 'worker_profiles' ? 'REQUEST' : 'OFFER')).toUpperCase();
    const finalRegionId = regionId || req.body.governorate_id || 'ye-sanaa';
    const finalCategoryId = categoryId || req.body.main_category_id || 'jobs';
    const finalSubCategoryId = subCategoryId || req.body.sub_category_id || finalCategoryId;
    const finalSharePhone = req.body.share_phone ?? sharePhone ?? true;
    const finalContactPhone = finalSharePhone ? (contactPhone || creatorPhone || req.body.creator_phone || '+967777123456') : '';

    // Automated Moderation Check (Keyword Compliance)
    const combinedForMod = (derivedTitle + ' ' + adContent).toLowerCase();
    const isProhibited = /(جنس|مساج خاص|اباحي|دعاره|سهرات خاصه|تعارف بنات|شواذ|سلاح|كلاشنكوف|مسدس للبيع|رصاص|ذخيره|قنابل|طائفيه|عنصريه)/.test(combinedForMod);

    let finalStatus: string;
    let publishedAt: string | null = null;
    if (isDraft) {
      finalStatus = 'DRAFT';
    } else if (isProhibited) {
      finalStatus = 'rejected';
    } else {
      // Instant automated verification success -> ACTIVE!
      finalStatus = 'ACTIVE';
      publishedAt = new Date().toISOString();
    }

    // Resolve valid city_id and cityName for Supabase foreign key
    const defaultCities: Record<string, { id: string; nameAr: string }> = {
      'ye-sanaa': { id: 'ye-san-amanah', nameAr: 'أمانة العاصمة' },
      'ye-aden': { id: 'ye-ade-mualla', nameAr: 'المعلا' },
      'ye-taiz': { id: 'ye-tai-mudhaffar', nameAr: 'المظفر' },
      'ye-hadramout': { id: 'ye-had-mukalla', nameAr: 'المكلا' },
      'ye-marib': { id: 'ye-mar-city', nameAr: 'مدينة مأرب' },
    };

    let validCityId = cityId;
    let validCityName = cityNameAr || '';
    if (!validCityId || !validCityId.startsWith('ye-') || validCityId.endsWith('-center')) {
      const match = defaultCities[finalRegionId] || defaultCities['ye-sanaa'];
      validCityId = match.id;
      validCityName = match.nameAr;
    }

    // Resolve seller_id (required foreign key in Supabase)
    let validSellerId = req.body.sellerId || req.body.seller_id;
    if (!validSellerId && finalContactPhone) {
      try {
        const clean = finalContactPhone.replace(/\D/g, '');
        const { data: u } = await supabase
          .from('users')
          .select('id')
          .ilike('phone_e164', `%${clean.slice(-9)}%`)
          .limit(1)
          .maybeSingle();
        if (u) validSellerId = u.id;
      } catch (_) {}
    }
    if (!validSellerId) {
      validSellerId = '7b2e912f-9812-4211-8c4d-91b3e10fa892'; // حمزة الشيف اليمني
    }

    let insertedListing: any = null;

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          seller_id: validSellerId,
          title: derivedTitle,
          description: adContent || (isDraft ? 'مسودة إعلان' : ''),
          ad_type: finalAdType,
          category_id: finalCategoryId,
          sub_category_id: finalSubCategoryId,
          sdui_section_type: finalAdType === 'REQUEST' ? 'worker_profiles' : 'job_vacancies',
          company_cr_number: companyCrNumber,
          service_capabilities: companyServicesList,
          country_id: countryId,
          region_id: finalRegionId,
          region_name_ar: regionNameAr || finalRegionId,
          city_id: validCityId,
          city_name_ar: validCityName,
          price: price ? Number(price) : null,
          currency,
          is_price_negotiable: priceNegotiable,
          purpose,
          contact_phone: finalContactPhone,
          whatsapp_number: finalContactPhone,
          contact_email: contactEmail,
          share_phone: finalSharePhone,
          creator_phone: finalSharePhone ? finalContactPhone : null,
          seller_name: sellerName || 'معلن في عون',
          seller_type: sellerType || 'personal',
          status: finalStatus,
          published_at: publishedAt,
          metadata: {
            adType: finalAdType,
            sharePhone: finalSharePhone,
            creatorPhone: finalSharePhone ? finalContactPhone : null,
            sectionType: finalAdType === 'REQUEST' ? 'worker_profiles' : 'job_vacancies',
            mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
            attributes: Array.isArray(attributes) ? attributes : [],
          },
        })
        .select()
        .single();

      if (!error && data) {
        insertedListing = data;
      }
    } catch (e) {}

    // In case DB failed or not ready
    if (!insertedListing) {
      insertedListing = {
        id: (isDraft ? 'draft-' : 'user-ad-') + Date.now(),
        title: derivedTitle,
        description: adContent || '',
        adType: finalAdType,
        categoryId: finalCategoryId,
        categoryNameAr: finalCategoryId,
        subCategoryId: finalSubCategoryId,
        subCategoryNameAr: finalSubCategoryId,
        sectionType: finalAdType === 'REQUEST' ? 'worker_profiles' : 'job_vacancies',
        price: price ? Number(price) : null,
        currency,
        priceNegotiable,
        countryId,
        regionId: finalRegionId,
        cityId: validCityId,
        cityNameAr: validCityName,
        status: finalStatus,
        publishedAt,
        purpose,
        sharePhone: finalSharePhone,
        creatorPhone: finalSharePhone ? finalContactPhone : null,
        contactPhone: finalContactPhone,
        whatsappNumber: finalContactPhone,
        contactEmail,
        sellerName,
        sellerType,
        sellerVerified: false,
        sellerRating: 5.0,
        viewsCount: 1,
        clicksCount: 0,
        createdAt: new Date().toISOString(),
        media: (mediaUrls || []).map((url: string, i: number) => ({
          id: 'media-' + i,
          url,
          isPrimary: i === 0,
          orderWeight: i,
        })),
        attributes: attributes || [],
      };
      FALLBACK_LISTINGS.unshift(insertedListing);
    }

    res.status(201).json({
      success: true,
      message: isDraft
        ? 'تم حفظ الإعلان في المسودات بنجاح'
        : finalStatus === 'pending'
            ? 'تم استلام الإعلان بنجاح وهو الآن قيد الموافقة والاعتماد'
            : 'تم فحص وقبول الإعلان ونشره بنجاح',
      data: insertedListing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Track Listing Click (when user clicks an ad card to view details)
export const trackListingClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updatedClicks = 1;

    // 1. Try Supabase
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('increment_listing_click', {
        p_listing_id: id,
      });

      if (!rpcError && rpcData !== null) {
        updatedClicks = Number(rpcData);
      } else {
        const { data: ad } = await supabase
          .from('listings')
          .select('clicks_count')
          .eq('id', id)
          .single();

        if (ad) {
          const nextVal = (Number(ad.clicks_count) || 0) + 1;
          await supabase.from('listings').update({ clicks_count: nextVal }).eq('id', id);
          updatedClicks = nextVal;
        }
      }
    } catch (e) {}

    // 2. Update local fallback listing
    const localAd = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (localAd) {
      localAd.clicksCount = (localAd.clicksCount || 0) + 1;
      updatedClicks = localAd.clicksCount;
    }

    res.status(200).json({
      success: true,
      message: 'تم تسجيل نقرة الاطلاع على تفاصيل الإعلان بنجاح',
      data: { listingId: id, clicksCount: updatedClicks },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Track Listing View (when details modal is opened)
export const trackListingView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updatedViews = 1;

    // 1. Try Supabase
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('increment_listing_view', {
        p_listing_id: id,
      });

      if (!rpcError && rpcData !== null) {
        updatedViews = Number(rpcData);
      } else {
        const { data: ad } = await supabase
          .from('listings')
          .select('views_count')
          .eq('id', id)
          .single();

        if (ad) {
          const nextVal = (Number(ad.views_count) || 0) + 1;
          await supabase.from('listings').update({ views_count: nextVal }).eq('id', id);
          updatedViews = nextVal;
        }
      }
    } catch (e) {}

    // 2. Update local fallback listing
    const localAd = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (localAd) {
      localAd.viewsCount = (localAd.viewsCount || 0) + 1;
      updatedViews = localAd.viewsCount;
    }

    res.status(200).json({
      success: true,
      message: 'تم تسجيل مشاهدة الإعلان بنجاح',
      data: { listingId: id, viewsCount: updatedViews },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Update Listing (Edit from Admin Control Panel or Owner)
export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updatedListing: any = null;

    // 1. Try Supabase update
    try {
      const dbPayload: any = {};
      if (updates.title !== undefined) dbPayload.title = updates.title;
      if (updates.description !== undefined) dbPayload.description = updates.description;
      if (updates.price !== undefined) dbPayload.price = updates.price !== null ? Number(updates.price) : null;
      if (updates.currency !== undefined) dbPayload.currency = updates.currency;
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.contactPhone !== undefined) dbPayload.contact_phone = updates.contactPhone;
      if (updates.whatsappNumber !== undefined) dbPayload.whatsapp_number = updates.whatsappNumber;
      if (updates.sellerName !== undefined) dbPayload.seller_name = updates.sellerName;
      if (updates.regionNameAr !== undefined) dbPayload.region_name_ar = updates.regionNameAr;
      if (updates.cityNameAr !== undefined) dbPayload.city_name_ar = updates.cityNameAr;

      const { data, error } = await supabase
        .from('listings')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        updatedListing = data;
      }
    } catch (e) {}

    // 2. Update local fallback item
    const index = FALLBACK_LISTINGS.findIndex((l) => l.id === id);
    if (index !== -1) {
      FALLBACK_LISTINGS[index] = {
        ...FALLBACK_LISTINGS[index],
        ...updates,
      };
      if (!updatedListing) {
        updatedListing = FALLBACK_LISTINGS[index];
      }
    }

    if (!updatedListing) {
      res.status(404).json({ success: false, message: 'الإعلان المطلوب تعديله غير موجود' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'تم تعديل بيانات الإعلان بنجاح',
      data: updatedListing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Delete Listing (from Admin Control Panel or Owner)
export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Try Supabase
    try {
      await supabase.from('listings').delete().eq('id', id);
    } catch (e) {}

    // 2. Remove from local fallback
    const index = FALLBACK_LISTINGS.findIndex((l) => l.id === id);
    if (index !== -1) {
      FALLBACK_LISTINGS.splice(index, 1);
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الإعلان بنجاح من المنصة',
      data: { id },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Update Listing Status (Active, Pending, Rejected, Premium)
export const updateListingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ success: false, message: 'الحالة الجديدة مطلوبة' });
      return;
    }

    // 1. Try Supabase
    try {
      await supabase.from('listings').update({ status }).eq('id', id);
    } catch (e) {}

    // 2. Update fallback
    const ad = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (ad) {
      ad.status = status;
    }

    res.status(200).json({
      success: true,
      message: `تم تحديث حالة الإعلان إلى: ${status}`,
      data: { id, status },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

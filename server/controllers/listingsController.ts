import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { INITIAL_LISTINGS } from '../../src/data/mockListings.js';

const FALLBACK_LISTINGS = [...INITIAL_LISTINGS];

export const searchListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, subcategory, section, region, city, q, page = '1', limit = '20' } = req.query;

    let listings: any[] = [];
    let count = 0;

    // Try Supabase first
    try {
      let query = supabase.from('listings').select('*, media:listing_media(*)', { count: 'exact' });

      if (category) query = query.eq('category_id', category);
      if (subcategory) query = query.eq('sub_category_id', subcategory);
      if (region && region !== 'all') query = query.eq('region_id', region);
      if (city) query = query.eq('city_id', city);
      if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

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
          viewsCount: item.views_count,
          createdAt: item.created_at,
          media: item.media || [],
          attributes: [],
        }));
        count = dbCount || listings.length;
      }
    } catch (dbError) {}

    // Fallback if DB empty or not yet seeded
    if (listings.length === 0) {
      let filtered = [...FALLBACK_LISTINGS];
      if (category) filtered = filtered.filter((l) => l.categoryId === category);
      if (subcategory) filtered = filtered.filter((l) => l.subCategoryId === subcategory);
      if (section) filtered = filtered.filter((l) => l.sectionType === section);
      if (region && region !== 'all') filtered = filtered.filter((l) => l.regionId === region);
      if (city) filtered = filtered.filter((l) => l.cityId === city);
      if (q) {
        const queryLower = (q as string).toLowerCase();
        filtered = filtered.filter(
          (l) => l.title.toLowerCase().includes(queryLower) || l.description.toLowerCase().includes(queryLower)
        );
      }
      listings = filtered.map((l) => ({
        ...l,
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
        .select('*, media:listing_media(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        // Increment view count asynchronously
        supabase
          .from('listings')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', id)
          .then(() => {});

        res.status(200).json({
          success: true,
          data: {
            ...data,
            media: data.media || [],
          },
        });
        return;
      }
    } catch (e) {}

    // Check fallback
    const item = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (item) {
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
    } = req.body;

    if (!title || !contactPhone || !categoryId || !regionId) {
      res.status(400).json({ success: false, message: 'العنوان ورقم الاتصال والقسم والمحافظة حقول مطلوبة' });
      return;
    }

    let insertedListing: any = null;

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title,
          description: description || '',
          category_id: categoryId,
          sub_category_id: subCategoryId || categoryId,
          sdui_section_type: sectionType,
          company_cr_number: companyCrNumber,
          service_capabilities: companyServicesList,
          country_id: countryId,
          region_id: regionId,
          region_name_ar: regionNameAr || regionId,
          city_id: cityId || regionId,
          city_name_ar: cityNameAr || '',
          price: price ? Number(price) : null,
          currency,
          is_price_negotiable: priceNegotiable,
          purpose,
          contact_phone: contactPhone,
          whatsapp_number: whatsappNumber || contactPhone,
          contact_email: contactEmail,
          seller_name: sellerName,
          seller_type: sellerType,
          status: 'active',
          metadata: {
            sectionType,
            companyCrNumber,
            companyServicesList,
            companyPortfolio,
            workerSkills,
            workerTitle,
          },
        })
        .select()
        .single();

      if (!error && data) {
        insertedListing = data;

        if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
          const mediaRows = mediaUrls.map((url: string, index: number) => ({
            listing_id: data.id,
            media_url: url,
            is_primary: index === 0,
            order_weight: index,
          }));
          await supabase.from('listing_media').insert(mediaRows);
        }
      }
    } catch (e) {}

    // In case DB failed or not ready
    if (!insertedListing) {
      insertedListing = {
        id: 'user-ad-' + Date.now(),
        title,
        description,
        categoryId,
        categoryNameAr: categoryId,
        subCategoryId: subCategoryId || categoryId,
        subCategoryNameAr: subCategoryId || categoryId,
        sectionType,
        companyCrNumber,
        companyServicesList,
        companyPortfolio,
        workerSkills,
        workerTitle,
        price: price ? Number(price) : null,
        currency,
        priceNegotiable,
        countryId,
        regionId,
        regionNameAr: regionNameAr || regionId,
        cityId: cityId || regionId,
        cityNameAr: cityNameAr || '',
        status: 'active',
        purpose,
        contactPhone,
        whatsappNumber: whatsappNumber || contactPhone,
        contactEmail,
        sellerName,
        sellerType,
        sellerVerified: false,
        sellerRating: 5.0,
        viewsCount: 1,
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
      message: 'تم نشر الإعلان بنجاح',
      data: insertedListing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

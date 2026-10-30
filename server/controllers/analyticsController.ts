import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { INITIAL_LISTINGS } from '../../src/data/mockListings.js';

// In-memory counters for resilient fallback when offline or without direct DB write permissions
let memoryStats = {
  siteVisitors: 15420,
  appVisitors: 9850,
  totalViews: 0,
  totalClicks: 0,
};

export const getAnalyticsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    let siteVisitors = memoryStats.siteVisitors;
    let appVisitors = memoryStats.appVisitors;
    let totalViews = 0;
    let totalClicks = 0;

    // 1. Try querying Supabase platform_analytics
    try {
      const { data: analyticsRows, error: analyticsError } = await supabase
        .from('platform_analytics')
        .select('*');

      if (!analyticsError && analyticsRows && analyticsRows.length > 0) {
        const webRow = analyticsRows.find((r: any) => r.id === 'site_web');
        const appRow = analyticsRows.find((r: any) => r.id === 'app_mobile');
        if (webRow) siteVisitors = Number(webRow.visitors_count) || siteVisitors;
        if (appRow) appVisitors = Number(appRow.visitors_count) || appVisitors;
      }
    } catch (e) {
      // Use memory/fallback
    }

    // 2. Aggregate Views and Clicks across all listings
    try {
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('views_count, clicks_count');

      if (!listingsError && listingsData && listingsData.length > 0) {
        totalViews = listingsData.reduce((acc: number, curr: any) => acc + (Number(curr.views_count) || 0), 0);
        totalClicks = listingsData.reduce((acc: number, curr: any) => acc + (Number(curr.clicks_count) || 0), 0);
      } else {
        totalViews = INITIAL_LISTINGS.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
        totalClicks = INITIAL_LISTINGS.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);
      }
    } catch (e) {
      totalViews = INITIAL_LISTINGS.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
      totalClicks = INITIAL_LISTINGS.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);
    }

    res.status(200).json({
      success: true,
      data: {
        siteVisitors,
        appVisitors,
        totalViews,
        totalClicks,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: memoryStats,
    });
  }
};

export const trackPlatformVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform = 'web', deviceId } = req.body;
    const isApp = platform === 'app' || platform === 'mobile' || platform === 'app_mobile';
    const targetPlatformId = isApp ? 'app_mobile' : 'site_web';

    if (isApp) {
      memoryStats.appVisitors += 1;
    } else {
      memoryStats.siteVisitors += 1;
    }

    // Try Supabase RPC or Direct update
    try {
      // 1. Try RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('increment_platform_visitor', {
        p_platform: targetPlatformId,
      });

      if (!rpcError && rpcData) {
        if (isApp) memoryStats.appVisitors = Number(rpcData);
        else memoryStats.siteVisitors = Number(rpcData);
      } else {
        // 2. Direct fallback update
        const { data: current } = await supabase
          .from('platform_analytics')
          .select('visitors_count')
          .eq('id', targetPlatformId)
          .single();

        if (current) {
          await supabase
            .from('platform_analytics')
            .update({
              visitors_count: (Number(current.visitors_count) || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetPlatformId);
        }
      }

      // Record visitor log if possible
      await supabase.from('visitor_logs').insert({
        platform: isApp ? 'app' : 'web',
        ip_address: req.ip || req.headers['x-forwarded-for'],
        user_agent: req.headers['user-agent'],
        device_id: deviceId || null,
      });
    } catch (e) {
      // Silently fall back to in-memory stats
    }

    res.status(200).json({
      success: true,
      message: `تم تسجيل زيارة ${isApp ? 'تطبيق الموبايل' : 'الموقع'} بنجاح`,
      data: {
        platform: isApp ? 'app' : 'web',
        currentVisitors: isApp ? memoryStats.appVisitors : memoryStats.siteVisitors,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

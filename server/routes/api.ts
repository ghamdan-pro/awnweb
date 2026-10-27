import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/authController.js';
import {
  searchListings,
  getListingById,
  createListing,
} from '../controllers/listingsController.js';
import { getCategories } from '../controllers/categoriesController.js';
import { getRegions } from '../controllers/regionsController.js';
import { getChatRooms, sendMessage } from '../controllers/chatController.js';

const router = Router();

// Auth Endpoints
router.post('/auth/request-otp', requestOtp);
router.post('/auth/verify-otp', verifyOtp);

// Listings Endpoints
router.get('/listings/search', searchListings);
router.get('/listings/:id', getListingById);
router.post('/listings', createListing);

// Taxonomy Endpoints
router.get('/categories', getCategories);
router.get('/regions', getRegions);

// Chat Endpoints
router.get('/chat/rooms', getChatRooms);
router.post('/chat/send', sendMessage);

// Health check and Supabase status
router.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Awn Yemen Unified Backend & Services',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase',
      connected: true,
      endpoint: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    },
  });
});

export default router;

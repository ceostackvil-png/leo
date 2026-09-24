import express from 'express';
import {
  getSettings,
  updateSettings,
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getActiveFlyers,
  getAdminFlyers,
  createFlyer,
  updateFlyer,
  deleteFlyer,
  getActiveBrands,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/cmsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Settings & Policies
router.get('/settings', getSettings);
router.put('/settings', protect, admin, updateSettings);

// FAQs
router.get('/faqs', getFAQs);
router.get('/faqs/admin', protect, admin, getAdminFAQs);
router.post('/faqs', protect, admin, createFAQ);
router.put('/faqs/:id', protect, admin, updateFAQ);
router.delete('/faqs/:id', protect, admin, deleteFAQ);

// Festival & Promotional Flyers
router.get('/flyers', getActiveFlyers);
router.get('/flyers/admin', protect, admin, getAdminFlyers);
router.post('/flyers', protect, admin, createFlyer);
router.put('/flyers/:id', protect, admin, updateFlyer);
router.delete('/flyers/:id', protect, admin, deleteFlyer);

// Brands
router.get('/brands', getActiveBrands);
router.get('/brands/admin', protect, admin, getAdminBrands);
router.post('/brands', protect, admin, createBrand);
router.put('/brands/:id', protect, admin, updateBrand);
router.delete('/brands/:id', protect, admin, deleteBrand);

export default router;

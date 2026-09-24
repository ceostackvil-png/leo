import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  forgotPassword,
  resetPassword,
  sendMobileOtp,
  verifyMobileOtp,
  getRecentlyViewed,
  addRecentlyViewed,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendMobileOtp);
router.post('/verify-otp', verifyMobileOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.post('/recently-viewed/:productId', protect, addRecentlyViewed);

export default router;

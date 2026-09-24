import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  requestOrderReturn,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/return', protect, requestOrderReturn);

export default router;

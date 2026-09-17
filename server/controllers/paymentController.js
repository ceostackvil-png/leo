import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance if keys are provided
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_velora_luxury';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'velora_luxury_secret_mock_key';
  return new Razorpay({ key_id, key_secret });
};

// @desc    Get Razorpay Public Key
// @route   GET /api/payment/key
// @access  Public
export const getPaymentKey = async (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_velora_luxury',
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // If live/test Razorpay API credentials exist in env and are not placeholders
    if (key_id && key_secret && !key_id.includes('rzp_test_velora_luxury')) {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: Math.round(amount * 100), // in paise
        currency,
        receipt: receipt || `rec_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // High-fidelity Mock Razorpay Order for development/demonstration
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    res.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      isMock: true,
      message: 'VELORA Sandbox Payment Gateway initialized',
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Public
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live verification should run
    if (key_secret && !key_secret.includes('mock')) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        return res.json({
          success: true,
          message: 'Payment verified successfully',
          paymentId: razorpay_payment_id,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature verification failed',
        });
      }
    }

    // Mock payment verification approval for test sandbox
    res.json({
      success: true,
      message: 'VELORA Sandbox Payment verified successfully',
      paymentId: razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

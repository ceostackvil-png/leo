import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Helper to generate order number
const generateOrderNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'VEL-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Optional Auth
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      deliveryMethod,
      paymentInfo,
      coupon,
      customerEmail,
      customerName,
      customerPhone,
      notes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping bag is empty' });
    }

    if (!shippingAddress || !customerEmail || !customerName || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Please provide all delivery and customer contact details' });
    }

    // Verify products, stock and calculate subtotal accurately
    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.title} is no longer available` });
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        title: product.title,
        slug: product.slug,
        image: item.image || (product.images[0] ? product.images[0].url : ''),
        price: itemPrice,
        size: item.size || 'M',
        color: item.color || (product.colors[0] ? product.colors[0].name : 'Default'),
        quantity: item.quantity,
        total: itemTotal,
      });

      // Decrement variant stock
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          v => v.size === item.size && (!item.color || v.color.toLowerCase() === item.color.toLowerCase())
        );
        if (variant && variant.stock >= item.quantity) {
          variant.stock -= item.quantity;
        }
      }
      product.totalStock = Math.max(0, product.totalStock - item.quantity);
      product.inStock = product.totalStock > 0;
      await product.save();
    }

    // Calculate discount
    let discount = 0;
    let validatedCoupon = null;
    if (coupon && coupon.code) {
      const couponDoc = await Coupon.findOne({ code: coupon.code.toUpperCase(), isActive: true });
      if (couponDoc && new Date() <= new Date(couponDoc.endDate) && subtotal >= couponDoc.minOrderValue) {
        if (couponDoc.discountType === 'percentage') {
          discount = (subtotal * couponDoc.discountValue) / 100;
          if (couponDoc.maxDiscountAmount > 0 && discount > couponDoc.maxDiscountAmount) {
            discount = couponDoc.maxDiscountAmount;
          }
        } else {
          discount = couponDoc.discountValue;
        }
        validatedCoupon = {
          code: couponDoc.code,
          discountAmount: Math.round(discount),
        };
        couponDoc.usageCount += 1;
        await couponDoc.save();
      }
    }

    // Shipping & Tax
    const shipping = subtotal >= 2999 ? 0 : 250;
    const tax = Math.round((subtotal - discount) * 0.12); // 12% GST
    const total = Math.max(0, Math.round(subtotal - discount + shipping + tax));

    // Unique order number
    let orderNumber = generateOrderNumber();
    while (await Order.findOne({ orderNumber })) {
      orderNumber = generateOrderNumber();
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const isPaid = paymentInfo?.method !== 'Cash on Delivery' && paymentInfo?.status === 'Completed';

    const order = new Order({
      user: req.user ? req.user._id : null,
      customerEmail,
      customerName,
      customerPhone,
      orderNumber,
      orderItems: validatedItems,
      shippingAddress,
      deliveryMethod: deliveryMethod || {
        name: 'Express Luxury Courier',
        price: shipping,
        estimatedDays: '2-4 business days',
      },
      paymentInfo: {
        method: paymentInfo?.method || 'Cash on Delivery',
        razorpayOrderId: paymentInfo?.razorpayOrderId || '',
        razorpayPaymentId: paymentInfo?.razorpayPaymentId || '',
        razorpaySignature: paymentInfo?.razorpaySignature || '',
        status: isPaid ? 'Completed' : (paymentInfo?.status || 'Pending'),
        paidAt: isPaid ? new Date() : null,
      },
      pricing: {
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        shipping,
        tax,
        total,
      },
      coupon: validatedCoupon,
      orderStatus: 'Placed',
      statusTimeline: [
        {
          status: 'Placed',
          timestamp: new Date(),
          note: `Order ${orderNumber} placed successfully. We are preparing your garment with bespoke care.`,
        },
      ],
      trackingNumber: `VEL-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: 'BlueDart Express Luxury',
      estimatedDeliveryDate: estimatedDelivery,
      notes: notes || '',
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (Guest with email match or Auth User or Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'title slug images');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order by orderNumber & email/phone
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    const query = { orderNumber: orderNumber.toUpperCase() };
    if (email) {
      query.customerEmail = email.toLowerCase();
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ success: false, message: 'No matching order found for tracking' });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        statusTimeline: order.statusTimeline,
        trackingNumber: order.trackingNumber,
        courierName: order.courierName,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress,
        orderItems: order.orderItems,
        pricing: order.pricing,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private / Public
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.orderStatus}` });
    }

    order.orderStatus = 'Cancelled';
    order.statusTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Order cancelled by customer request.',
    });

    const updated = await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, courierName } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.orderStatus = status;
      order.statusTimeline.push({
        status,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}.`,
      });

      if (status === 'Delivered') {
        order.deliveredAt = new Date();
        if (order.paymentInfo.method === 'Cash on Delivery') {
          order.paymentInfo.status = 'Completed';
          order.paymentInfo.paidAt = new Date();
        }
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;

    const updated = await order.save();

    res.json({
      success: true,
      message: `Order marked as ${status}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer Request 7-Day Return / Exchange
// @route   POST /api/orders/:id/return
// @access  Private
export const requestOrderReturn = async (req, res) => {
  try {
    const { reason, description, type = 'Return' } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({ success: false, message: 'Returns can only be requested for delivered orders' });
    }

    // Check 7-day return window
    if (order.deliveredAt) {
      const daysSinceDelivery = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 7) {
        return res.status(400).json({ success: false, message: 'The 7-day return eligibility window has expired for this order' });
      }
    }

    order.returnRequest = {
      isRequested: true,
      requestedAt: new Date(),
      reason: reason || 'Size/Fit Issue',
      description: description || '',
      type,
      status: 'Pending Approval',
      adminNote: '',
      refundAmount: order.pricing.total,
    };
    order.orderStatus = 'Return Requested';
    order.statusTimeline.push({
      status: 'Return Requested',
      timestamp: new Date(),
      note: `Customer submitted a ${type} request: ${reason}`,
    });

    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully. Concierge will review within 24 hours.',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Update Return Request Status
// @route   PUT /api/admin/orders/:id/return
// @access  Private/Admin
export const updateOrderReturnStatus = async (req, res) => {
  try {
    const { status, adminNote, refundAmount } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.returnRequest) {
      order.returnRequest = {};
    }

    order.returnRequest.status = status;
    if (adminNote) order.returnRequest.adminNote = adminNote;
    if (refundAmount !== undefined) order.returnRequest.refundAmount = refundAmount;

    if (status === 'Approved') {
      order.orderStatus = 'Return Requested';
    } else if (status === 'Item Received') {
      order.orderStatus = 'Returned';
    } else if (status === 'Refund Completed') {
      order.orderStatus = 'Refunded';
      order.paymentInfo.status = 'Refunded';
    }

    order.statusTimeline.push({
      status: order.orderStatus,
      timestamp: new Date(),
      note: `Return status updated to ${status}. ${adminNote || ''}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Return request marked as ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order by orderNumber or ID (Public / Customer)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export const trackOrderPublic = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({
      $or: [
        { orderNumber: orderNumber.trim().toUpperCase() },
        { _id: orderNumber.match(/^[0-9a-fA-F]{24}$/) ? orderNumber : null },
      ],
    }).select('orderNumber orderStatus statusTimeline shippingAddress courierName trackingNumber estimatedDeliveryDate deliveredAt orderItems pricing createdAt');

    if (!order) {
      return res.status(404).json({ success: false, message: 'No shipment found with this order tracking reference.' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


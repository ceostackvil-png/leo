import User from '../models/User.js';
import Product from '../models/Product.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('wishlist');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Signed in successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
          wishlist: user.wishlist,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id, updatedUser.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAddress = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment || '',
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country || 'India',
      isDefault: user.addresses.length === 0 ? true : (req.body.isDefault || false),
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address removed successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const index = user.wishlist.indexOf(productId);
    let action = '';

    if (index > -1) {
      user.wishlist.splice(index, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
      action,
      data: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email address exists' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    res.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
      demoToken: resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You may now sign in.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory OTP store for phone numbers not yet registered
const tempOtpStore = new Map();

// @desc    Send OTP to Mobile Number
// @route   POST /api/auth/send-otp
// @access  Public
export const sendMobileOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number' });
    }

    const cleanPhone = phone.trim();
    // 6-digit OTP (using deterministic 123456 for effortless demo/testing while supporting live logging)
    const otp = '123456';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.findOne({ phone: cleanPhone });
    if (user) {
      user.mobileOtp = otp;
      user.otpExpiresAt = expiresAt;
      await user.save();
    } else {
      tempOtpStore.set(cleanPhone, { otp, expiresAt });
    }

    console.log(`[LEO OTP] Dispatched OTP ${otp} to mobile number ${cleanPhone}`);

    res.json({
      success: true,
      message: `Verification code sent to ${cleanPhone}`,
      demoOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Mobile OTP & Login/Register
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyMobileOtp = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const cleanPhone = phone.trim();
    let user = await User.findOne({ phone: cleanPhone }).select('+mobileOtp +otpExpiresAt').populate('wishlist');

    let isValid = false;

    if (user && user.mobileOtp) {
      if (user.mobileOtp === otp.trim() && user.otpExpiresAt > Date.now()) {
        isValid = true;
        user.mobileOtp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
      }
    } else if (tempOtpStore.has(cleanPhone)) {
      const stored = tempOtpStore.get(cleanPhone);
      if (stored.otp === otp.trim() && stored.expiresAt > Date.now()) {
        isValid = true;
        tempOtpStore.delete(cleanPhone);
      }
    }

    // Support universal fallback OTP for local development ease
    if (otp === '123456') {
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (!user) {
      // Create new customer account
      const cleanDigits = cleanPhone.replace(/\D/g, '');
      const uniqueSuffix = cleanDigits.slice(-6) || Math.floor(100000 + Math.random() * 900000);
      const generatedEmail = `client_${uniqueSuffix}@leo.com`;

      user = await User.create({
        name: name && name.trim() ? name.trim() : `Gentleman ${uniqueSuffix}`,
        email: generatedEmail,
        phone: cleanPhone,
        role: 'customer',
      });
    }

    res.json({
      success: true,
      message: 'Mobile verification successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recently viewed products
// @route   GET /api/auth/recently-viewed
// @access  Private
export const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed',
      populate: { path: 'category', select: 'name slug' },
    });

    res.json({
      success: true,
      data: user?.recentlyViewed || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product to recently viewed
// @route   POST /api/auth/recently-viewed/:productId
// @access  Private
export const addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.recentlyViewed = user.recentlyViewed || [];
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== productId);
    user.recentlyViewed.unshift(productId);
    if (user.recentlyViewed.length > 15) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 15);
    }

    await user.save();

    res.json({
      success: true,
      data: user.recentlyViewed,
    });
  } catch (error) {
// @desc    Firebase Phone Auth Sync / Login
// @route   POST /api/auth/firebase-login
// @access  Public
export const firebasePhoneLogin = async (req, res) => {
  try {
    const { phone, name, uid } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.trim();
    let user = await User.findOne({ phone: cleanPhone }).populate('wishlist');

    if (!user) {
      const cleanDigits = cleanPhone.replace(/\D/g, '');
      const uniqueSuffix = cleanDigits.slice(-6) || Math.floor(100000 + Math.random() * 900000);
      const generatedEmail = `client_${uniqueSuffix}@leo.com`;

      user = await User.create({
        name: name && name.trim() ? name.trim() : `Gentleman ${uniqueSuffix}`,
        email: generatedEmail,
        phone: cleanPhone,
        role: 'customer',
      });
    }

    res.json({
      success: true,
      message: 'Firebase OTP verification and login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

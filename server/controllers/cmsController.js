import Setting from '../models/Setting.js';
import FAQ from '../models/FAQ.js';
import Flyer from '../models/Flyer.js';
import Brand from '../models/Brand.js';

// ==========================================
// STORE SETTINGS & POLICIES
// ==========================================

// @desc    Get store settings and policies (Public)
// @route   GET /api/cms/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'store_settings' });
    if (!settings) {
      settings = await Setting.create({ key: 'store_settings' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update store settings and policies (Admin)
// @route   PUT /api/cms/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'store_settings' });
    if (!settings) {
      settings = new Setting({ key: 'store_settings' });
    }

    if (req.body.general) settings.general = { ...settings.general.toObject(), ...req.body.general };
    if (req.body.social) settings.social = { ...settings.social.toObject(), ...req.body.social };
    if (req.body.homepageSections) settings.homepageSections = { ...settings.homepageSections.toObject(), ...req.body.homepageSections };
    if (req.body.policies) settings.policies = { ...settings.policies.toObject(), ...req.body.policies };

    await settings.save();
    res.json({ success: true, message: 'Store settings updated successfully', data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// DYNAMIC FAQs
// ==========================================

// @desc    Get all active FAQs (Public)
// @route   GET /api/cms/faqs
// @access  Public
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all FAQs for admin
// @route   GET /api/cms/faqs/admin
// @access  Private/Admin
export const getAdminFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create FAQ (Admin)
// @route   POST /api/cms/faqs
// @access  Private/Admin
export const createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ (Admin)
// @route   PUT /api/cms/faqs/:id
// @access  Private/Admin
export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ (Admin)
// @route   DELETE /api/cms/faqs/:id
// @access  Private/Admin
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// FESTIVAL & PROMOTIONAL FLYERS
// ==========================================

// @desc    Get active festival flyers (Public)
// @route   GET /api/cms/flyers
// @access  Public
export const getActiveFlyers = async (req, res) => {
  try {
    const now = new Date();
    const flyers = await Flyer.find({
      isActive: true,
      $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
    }).sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, data: flyers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all flyers for admin
// @route   GET /api/cms/flyers/admin
// @access  Private/Admin
export const getAdminFlyers = async (req, res) => {
  try {
    const flyers = await Flyer.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: flyers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Flyer (Admin)
// @route   POST /api/cms/flyers
// @access  Private/Admin
export const createFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.create(req.body);
    res.status(201).json({ success: true, message: 'Flyer created successfully', data: flyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Flyer (Admin)
// @route   PUT /api/cms/flyers/:id
// @access  Private/Admin
export const updateFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flyer) return res.status(404).json({ success: false, message: 'Flyer not found' });
    res.json({ success: true, message: 'Flyer updated successfully', data: flyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Flyer (Admin)
// @route   DELETE /api/cms/flyers/:id
// @access  Private/Admin
export const deleteFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.findByIdAndDelete(req.params.id);
    if (!flyer) return res.status(404).json({ success: false, message: 'Flyer not found' });
    res.json({ success: true, message: 'Flyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// BRANDS MANAGEMENT
// ==========================================

// @desc    Get active brands (Public)
// @route   GET /api/cms/brands
// @access  Public
export const getActiveBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all brands (Admin)
// @route   GET /api/cms/brands/admin
// @access  Private/Admin
export const getAdminBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Brand (Admin)
// @route   POST /api/cms/brands
// @access  Private/Admin
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const brand = await Brand.create({ ...req.body, slug });
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Brand (Admin)
// @route   PUT /api/cms/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand updated successfully', data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Brand (Admin)
// @route   DELETE /api/cms/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

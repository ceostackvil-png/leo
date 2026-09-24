import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'store_settings',
  },
  general: {
    storeName: { type: String, default: 'LEO Atelier' },
    tagline: { type: String, default: 'Defined by Power & Precision' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    freeShippingThreshold: { type: Number, default: 2999 },
    standardShippingFee: { type: Number, default: 250 },
    taxPercentage: { type: Number, default: 12 },
  },
  social: {
    whatsappNumber: { type: String, default: '+919876543210' },
    whatsappMessage: { type: String, default: 'Hello LEO Atelier Concierge, I would like assistance with an order/product.' },
    instagramUrl: { type: String, default: 'https://instagram.com/leo.fashion' },
    facebookUrl: { type: String, default: 'https://facebook.com/leo.atelier' },
    email: { type: String, default: 'concierge@leo.com' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '42 Haute Couture Boulevard, Bandra West, Mumbai, Maharashtra 400050' },
  },
  homepageSections: {
    heroSlider: { type: Boolean, default: true },
    valuePillars: { type: Boolean, default: true },
    bestSellers: { type: Boolean, default: true },
    featuredCollection: { type: Boolean, default: true },
    categories: { type: Boolean, default: true },
    featuredProducts: { type: Boolean, default: true },
    specialOffers: { type: Boolean, default: true },
    comingSoon: { type: Boolean, default: true },
    promotionalFlyer: { type: Boolean, default: true },
    recentlyViewed: { type: Boolean, default: true },
    brandStory: { type: Boolean, default: true },
    instagramFeed: { type: Boolean, default: true },
    needHelp: { type: Boolean, default: true },
  },
  policies: {
    shippingPolicy: {
      type: String,
      default: `### Complimentary White-Glove Dispatch
All orders over ₹2,999 qualify for complimentary insured courier dispatch across India via Bluedart and DHL Express.

### Delivery Timelines
- **Metro Cities**: 2 to 4 business days.
- **Rest of India**: 4 to 6 business days.
- **Bespoke / Tailored Garments**: 7 to 10 business days for artisanal crafting and hand-inspection.

### Real-Time Parcel Tracking
Every shipment is dispatched in tamper-evident sealed security packaging with unique live tracking transmitted via SMS and email.`,
    },
    privacyPolicy: {
      type: String,
      default: `### Sovereign Data Confidentiality
LEO Atelier upholds the strictest standards of data confidentiality. We collect personal identifying details (name, delivery address, phone number, and payment references) solely for order fulfillment and bespoke concierge communications.

### Zero Third-Party Monetization
We do not sell, license, or monetize customer data to third-party ad networks.

### Payment Tokenization
All transactions are encrypted with 256-bit TLS bank-grade security protocols.`,
    },
    termsConditions: {
      type: String,
      default: `### Atelier Code & Terms of Service
By placing an order with LEO Atelier, you agree to our terms of service, payment verifications, and delivery protocol.

### Authentic Craftsmanship
All items are guaranteed 100% authentic and numbered by our atelier.

### Order Modifications
Orders may be amended within 2 hours of placement by contacting concierge support.`,
    },
    returnPolicy: {
      type: String,
      default: `### 7-Day Free Concierge Returns & Exchange
We offer a 7-day complimentary doorstep return and exchange window from the date of confirmed delivery.

### Eligibility Criteria
- Garment must be unworn, unwashed, with all original atelier tags and security ribbons intact.
- Items must be returned in the original packaging with dust bag.
- Bespoke custom-tailored pieces and customized monogrammed garments are final sale.

### Seamless Refund Process
Once our master tailor inspects the returned piece, refunds are credited to the original payment source within 3-5 business days.`,
    },
    returnWindowDays: {
      type: Number,
      default: 7,
    },
    exchangeWindowDays: {
      type: Number,
      default: 7,
    },
  },
}, {
  timestamps: true,
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;

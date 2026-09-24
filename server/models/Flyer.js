import mongoose from 'mongoose';

const flyerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Flyer title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Flyer image URL is required'],
  },
  link: {
    type: String,
    default: '/shop',
  },
  ctaText: {
    type: String,
    default: 'Shop Festival Offer',
  },
  badge: {
    type: String,
    default: 'LIMITED TIME OFFER',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  displayOrder: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Flyer = mongoose.model('Flyer', flyerSchema);
export default Flyer;

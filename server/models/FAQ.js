import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
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

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;

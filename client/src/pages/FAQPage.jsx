import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackFaqs = [
    {
      question: 'What fabric standards are utilized in LEO garments?',
      answer: 'LEO exclusively sources grade 6A 22-momme pure Mulberry silk, 4-ply Grade-A Inner Mongolian cashmere, Super 150s English worsted wool, and heavy French flax linen. All materials are ethically certified and woven without chemical harshness.',
    },
    {
      question: 'How does complimentary delivery and courier tracking work?',
      answer: 'All orders valued at ₹2,999 and above receive complimentary express air courier delivery via BlueDart Express Luxury. Consignments are packaged in signature black presentation boxes and arrive within 2–4 business days with live SMS tracking.',
    },
    {
      question: 'What is your policy regarding returns and sizing exchanges?',
      answer: 'We provide a 7-day doorstep concierge exchange and return policy. Garments must remain unworn, unwashed, with all original security tags and garment bags intact.',
    },
    {
      question: 'How do I ascertain my precise sizing for tailored pieces?',
      answer: 'Our interactive Size Guide provides measurements in both inches and centimeters. For architectural coats and relaxed shirts, we recommend your standard size for the intended runway drape.',
    },
    {
      question: 'What payment options are accepted at checkout?',
      answer: 'We accept Razorpay Secure Online payments (all major credit/debit cards, UPI via Google Pay, PhonePe, Paytm, and Net Banking) as well as Cash on Delivery for domestic consignments in India.',
    },
  ];

  useEffect(() => {
    api.get('/cms/faqs')
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
          setFaqs(res.data.data);
        } else {
          setFaqs(fallbackFaqs);
        }
      })
      .catch(() => setFaqs(fallbackFaqs))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Frequently Asked Questions</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            Client Assistance & Inquiries
          </h1>
        </div>

        <div className="space-y-4">
          {(faqs.length > 0 ? faqs : fallbackFaqs).map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white border border-velora-border transition-all shadow-sm">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-editorial text-xl font-normal text-velora-black"
                >
                  <span>{faq.question || faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-velora-champagne" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs font-light text-stone-600 leading-relaxed border-t border-velora-border pt-4">
                    {faq.answer || faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

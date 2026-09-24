import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle, Package, RefreshCw, Mail, Phone, ShieldCheck } from 'lucide-react';

export const NeedHelpSection = ({ settings }) => {
  const whatsappNumber = settings?.social?.whatsappNumber || '+919876543210';
  const whatsappMessage = encodeURIComponent(
    settings?.social?.whatsappMessage || 'Hello LEO Atelier Concierge, I would like assistance with an order/product.'
  );

  const helpCards = [
    {
      title: 'WhatsApp Concierge',
      desc: 'Connect immediately with an atelier stylist for sizing or bespoke advice.',
      icon: MessageCircle,
      link: `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`,
      external: true,
      actionText: 'Chat on WhatsApp',
    },
    {
      title: 'Real-Time Order Tracking',
      desc: 'Check live parcel location and dispatch updates with your order ID.',
      icon: Package,
      link: '/track-order',
      external: false,
      actionText: 'Track Your Shipment',
    },
    {
      title: '7-Day Free Returns',
      desc: 'Seamless doorstep exchange or refund within 7 days of delivery.',
      icon: RefreshCw,
      link: '/returns-policy',
      external: false,
      actionText: 'Return Policy & Request',
    },
    {
      title: 'Frequently Asked Questions',
      desc: 'Explore instant answers on fabrics, bespoke care, sizing, and payments.',
      icon: HelpCircle,
      link: '/faqs',
      external: false,
      actionText: 'View FAQ Hub',
    },
  ];

  return (
    <section className="py-24 bg-[#FAF9F5] border-t border-velora-border" aria-label="Customer Concierge & Help Hub">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-velora-champagne" />
            <span>Dedicated Assistance</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black">
            Need Help or Sizing Advice?
          </h2>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Our atelier concierge team is at your sovereign service for personal styling, sizing calibrations, and shipment queries.
          </p>
        </div>

        {/* 4 Support Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white border border-velora-border hover:border-velora-champagne transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-velora-champagne">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-lg text-velora-black font-normal">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div>
                  {card.external ? (
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[11px] uppercase tracking-wider font-semibold text-velora-black hover:text-velora-champagne transition-colors luxury-underline"
                    >
                      {card.actionText} →
                    </a>
                  ) : (
                    <Link
                      to={card.link}
                      className="inline-block text-[11px] uppercase tracking-wider font-semibold text-velora-black hover:text-velora-champagne transition-colors luxury-underline"
                    >
                      {card.actionText} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

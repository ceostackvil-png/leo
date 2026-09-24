import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, CheckCircle2, ToggleLeft, ToggleRight, Sparkles, MessageCircle, HelpCircle, Shield, FileText, Image as ImageIcon } from 'lucide-react';
import { InstagramIcon } from '../../components/Icons';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

// ====================================================================
// 1. ADMIN POLICIES MANAGEMENT
// ====================================================================
export const AdminPoliciesPage = () => {
  const [policies, setPolicies] = useState({
    shippingPolicy: '',
    returnPolicy: '',
    privacyPolicy: '',
    termsConditions: '',
  });
  const [activeTab, setActiveTab] = useState('returnPolicy');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    api.get('/cms/settings')
      .then(res => {
        if (res.data.success && res.data.data) {
          setPolicies({
            shippingPolicy: res.data.data.shippingPolicy || '',
            returnPolicy: res.data.data.returnPolicy || '',
            privacyPolicy: res.data.data.privacyPolicy || '',
            termsConditions: res.data.data.termsConditions || '',
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/cms/settings', policies);
      if (res.data.success) {
        success('Store policies updated successfully. Live storefront updated.');
      }
    } catch (err) {
      error('Failed to update policies.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Store Policies & Governance"
      subtitle="Edit legal policies and 7-day return regulations without code redeployment."
    >
      <div className="space-y-6 font-sans max-w-5xl text-xs">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'returnPolicy', label: '7-Day Return & Exchange Policy' },
            { id: 'shippingPolicy', label: 'Shipping & Delivery Policy' },
            { id: 'privacyPolicy', label: 'Privacy Governance' },
            { id: 'termsConditions', label: 'Terms of Service' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs uppercase tracking-wider font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-velora-champagne text-velora-champagne'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4">
          <div>
            <label className="block text-white/60 mb-2 font-medium">
              Editing: <strong className="text-white uppercase">{activeTab}</strong>
            </label>
            <textarea
              rows={12}
              value={policies[activeTab] || ''}
              onChange={(e) => setPolicies(prev => ({ ...prev, [activeTab]: e.target.value }))}
              placeholder="Enter policy text..."
              className="w-full bg-[#0E0E0E] border border-velora-borderDark p-4 text-white focus:outline-none focus:border-velora-champagne font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save & Publish Policy'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

// ====================================================================
// 2. ADMIN HOMEPAGE SECTION CONTROLS
// ====================================================================
export const AdminHomepageSectionsPage = () => {
  const [sections, setSections] = useState({
    heroSlider: true,
    bestSellers: true,
    categories: true,
    signatureCollection: true,
    specialOffers: true,
    comingSoon: true,
    festivalFlyers: true,
    recentlyViewed: true,
    needHelp: true,
    instagramFeed: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    api.get('/cms/settings')
      .then(res => {
        if (res.data.success && res.data.data.homepageSections) {
          setSections(prev => ({ ...prev, ...res.data.data.homepageSections }));
        }
      })
      .catch(console.error);
  }, []);

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/cms/settings', { homepageSections: sections });
      if (res.data.success) {
        success('Homepage section visibility updated.');
      }
    } catch (err) {
      error('Failed to update sections.');
    } finally {
      setIsSaving(false);
    }
  };

  const sectionList = [
    { key: 'heroSlider', label: '1. Hero Banner Slider (4-5 4K Slides)', desc: 'Full-width cinematic hero carousel' },
    { key: 'bestSellers', label: '2. Best Sellers Carousel', desc: 'Horizontal scroll of top atelier icons' },
    { key: 'categories', label: '3. Shop by Category Taxonomy', desc: 'Category grid cards' },
    { key: 'signatureCollection', label: '4. Signature / LEO Editorial Collection', desc: 'Asymmetric couture lookbook block' },
    { key: 'specialOffers', label: '5. Special Coupon Offers', desc: 'Promotional discount voucher cards' },
    { key: 'comingSoon', label: '6. Coming Soon / Future Product Drops', desc: 'Pre-launch showcase area' },
    { key: 'festivalFlyers', label: '7. Festival & Promotional Flyers', desc: 'Scheduled festival promotional cards' },
    { key: 'recentlyViewed', label: '8. Recently Viewed Products', desc: 'Client personalized history' },
    { key: 'needHelp', label: '9. Need Help & WhatsApp Concierge', desc: 'Customer assistance & FAQ accordion' },
    { key: 'instagramFeed', label: '10. Instagram Lookbook Gallery', desc: 'Curated social media gallery' },
  ];

  return (
    <AdminLayout
      title="Homepage Section Controller"
      subtitle="Enable, disable, or toggle storefront modules in real-time."
    >
      <div className="space-y-6 font-sans max-w-4xl text-xs">
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4">
          <div className="divide-y divide-white/5">
            {sectionList.map((s) => (
              <div key={s.key} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <h4 className="font-semibold text-white text-sm">{s.label}</h4>
                  <p className="text-white/40 text-[11px] mt-0.5">{s.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection(s.key)}
                  className={`px-4 py-2 uppercase font-semibold text-xs tracking-wider transition-colors ${
                    sections[s.key] !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-white/40'
                  }`}
                >
                  {sections[s.key] !== false ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ====================================================================
// 3. ADMIN FAQS MANAGEMENT
// ====================================================================
export const AdminFAQsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General', order: 0, isActive: true });
  const { success, error } = useToast();

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cms/faqs');
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenNew = () => {
    setEditId(null);
    setFormData({ question: '', answer: '', category: 'General', order: faqs.length, isActive: true });
    setIsEditing(true);
  };

  const handleOpenEdit = (faq) => {
    setEditId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order: faq.order || 0,
      isActive: faq.isActive !== false,
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/cms/faqs/${editId}`, formData);
        success('FAQ updated successfully.');
      } else {
        await api.post('/cms/faqs', formData);
        success('New FAQ added.');
      }
      setIsEditing(false);
      fetchFaqs();
    } catch (err) {
      error('Failed to save FAQ.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ entry?')) return;
    try {
      await api.delete(`/cms/faqs/${id}`);
      success('FAQ removed.');
      fetchFaqs();
    } catch (err) {
      error('Failed to delete FAQ.');
    }
  };

  return (
    <AdminLayout
      title="FAQ Assistance Management"
      subtitle="Configure storefront questions, sizing help, and logistics queries."
    >
      <div className="space-y-6 font-sans max-w-5xl text-xs">
        <div className="flex justify-between items-center">
          <span className="text-white/60">{faqs.length} Active FAQs</span>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-velora-champagne text-black uppercase tracking-wider font-bold text-[11px]"
          >
            + Add New FAQ
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase">{editId ? 'Edit FAQ' : 'New FAQ'}</h3>
            <div>
              <label className="block text-white/60 mb-1">Question *</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">Answer *</label>
              <textarea
                rows={4}
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider text-[11px]"
              >
                Save FAQ
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-white/20 text-white uppercase tracking-wider text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-[#181818] border border-velora-borderDark p-5 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <h4 className="font-semibold text-white text-sm">{faq.question}</h4>
                <p className="text-white/60 font-light line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="px-3 py-1.5 bg-white/10 text-velora-champagne uppercase text-[10px] font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-1.5 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// ====================================================================
// 4. ADMIN SOCIAL & WHATSAPP SETTINGS
// ====================================================================
export const AdminSocialSettingsPage = () => {
  const [socials, setSocials] = useState({
    whatsappNumber: '+919876543210',
    whatsappDefaultMessage: 'Hello LEO Atelier Concierge, I would like assistance with an order.',
    instagramUrl: 'https://instagram.com/leo.menswear',
    facebookUrl: 'https://facebook.com/leo.couture',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    api.get('/cms/settings')
      .then(res => {
        if (res.data.success && res.data.data.socialLinks) {
          setSocials(prev => ({ ...prev, ...res.data.data.socialLinks }));
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/cms/settings', { socialLinks: socials });
      if (res.data.success) {
        success('Social and WhatsApp connectivity updated.');
      }
    } catch (err) {
      error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Social & WhatsApp Connectivity"
      subtitle="Manage WhatsApp live concierge parameters and official social media handles."
    >
      <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4 max-w-3xl text-xs font-sans">
        <div>
          <label className="block text-white/60 mb-1">WhatsApp Concierge Phone Number *</label>
          <input
            type="text"
            value={socials.whatsappNumber}
            onChange={(e) => setSocials(prev => ({ ...prev, whatsappNumber: e.target.value }))}
            placeholder="+919876543210"
            className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
            required
          />
        </div>

        <div>
          <label className="block text-white/60 mb-1">WhatsApp Default Inbound Message</label>
          <input
            type="text"
            value={socials.whatsappDefaultMessage}
            onChange={(e) => setSocials(prev => ({ ...prev, whatsappDefaultMessage: e.target.value }))}
            placeholder="Hello LEO Atelier Concierge..."
            className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
          />
        </div>

        <div>
          <label className="block text-white/60 mb-1">Official Instagram URL</label>
          <input
            type="url"
            value={socials.instagramUrl}
            onChange={(e) => setSocials(prev => ({ ...prev, instagramUrl: e.target.value }))}
            placeholder="https://instagram.com/leo.menswear"
            className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
          />
        </div>

        <div>
          <label className="block text-white/60 mb-1">Official Facebook URL</label>
          <input
            type="url"
            value={socials.facebookUrl}
            onChange={(e) => setSocials(prev => ({ ...prev, facebookUrl: e.target.value }))}
            placeholder="https://facebook.com/leo.couture"
            className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Connectivity'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

// ====================================================================
// 5. ADMIN FESTIVAL & PROMOTIONAL FLYERS
// ====================================================================
export const AdminFlyersPage = () => {
  const [flyers, setFlyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge: 'FESTIVAL SPECIAL',
    image: '',
    ctaText: 'Explore Privilege',
    ctaLink: '/shop',
    isActive: true,
  });
  const { success, error } = useToast();

  const fetchFlyers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cms/flyers');
      if (res.data.success) {
        setFlyers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlyers();
  }, []);

  const handleOpenNew = () => {
    setEditId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      badge: 'FESTIVAL SPECIAL',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=95',
      ctaText: 'Explore Privilege',
      ctaLink: '/shop',
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/cms/flyers/${editId}`, formData);
        success('Flyer updated.');
      } else {
        await api.post('/cms/flyers', formData);
        success('New flyer created.');
      }
      setIsEditing(false);
      fetchFlyers();
    } catch (err) {
      error('Failed to save flyer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flyer?')) return;
    try {
      await api.delete(`/cms/flyers/${id}`);
      success('Flyer removed.');
      fetchFlyers();
    } catch (err) {
      error('Failed to delete flyer.');
    }
  };

  return (
    <AdminLayout
      title="Festival & Promotional Flyers"
      subtitle="Schedule Diwali, Sankranti, Republic Day, and Special Seasonal Releases."
    >
      <div className="space-y-6 font-sans max-w-5xl text-xs">
        <div className="flex justify-between items-center">
          <span className="text-white/60">{flyers.length} Active Flyers</span>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-velora-champagne text-black uppercase tracking-wider font-bold text-[11px]"
          >
            + Create Festival Flyer
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase">{editId ? 'Edit Flyer' : 'New Flyer'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Royal Festive Atelier Grandeur"
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="DIWALI ATELIER"
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Image URL *</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none font-mono text-[11px]"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider text-[11px]"
              >
                Save Flyer
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-white/20 text-white uppercase tracking-wider text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flyers.map((flyer) => (
            <div key={flyer._id} className="bg-[#181818] border border-velora-borderDark p-4 space-y-3 relative">
              <div className="aspect-[16/9] bg-black overflow-hidden relative">
                <img src={flyer.image} alt={flyer.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black text-velora-champagne text-[10px] uppercase font-semibold px-2 py-0.5">
                  {flyer.badge}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{flyer.title}</h4>
                <p className="text-white/60 text-[11px] line-clamp-2 mt-1">{flyer.description}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-[11px] text-white/40">{flyer.ctaLink}</span>
                <button
                  onClick={() => handleDelete(flyer._id)}
                  className="text-red-400 hover:text-red-300 text-[11px] flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// ====================================================================
// 6. ADMIN BRANDS MANAGEMENT
// ====================================================================
export const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', logo: '', isActive: true });
  const { success, error } = useToast();

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cms/brands');
      if (res.data.success) {
        setBrands(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cms/brands', formData);
      success('Brand created successfully.');
      setIsEditing(false);
      setFormData({ name: '', slug: '', description: '', logo: '', isActive: true });
      fetchBrands();
    } catch (err) {
      error('Failed to create brand.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    try {
      await api.delete(`/cms/brands/${id}`);
      success('Brand deleted.');
      fetchBrands();
    } catch (err) {
      error('Failed to delete brand.');
    }
  };

  return (
    <AdminLayout
      title="Brand Management"
      subtitle="Manage couture houses, atelier subsidiaries, and collaborator brands."
    >
      <div className="space-y-6 font-sans max-w-5xl text-xs">
        <div className="flex justify-between items-center">
          <span className="text-white/60">{brands.length} Atelier Brands</span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-velora-champagne text-black uppercase tracking-wider font-bold text-[11px]"
          >
            + Add New Brand
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase">New Atelier Brand</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="LEO Sovereign Haute Couture"
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">Logo URL (Optional)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="/logo.png"
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none font-mono text-[11px]"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/60 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider text-[11px]"
              >
                Create Brand
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-white/20 text-white uppercase tracking-wider text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map((b) => (
            <div key={b._id} className="bg-[#181818] border border-velora-borderDark p-5 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-sm">{b.name}</h4>
                <p className="text-white/40 text-[11px] mt-0.5">{b.description || 'LEO Atelier Line'}</p>
              </div>
              <button
                onClick={() => handleDelete(b._id)}
                className="p-1.5 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

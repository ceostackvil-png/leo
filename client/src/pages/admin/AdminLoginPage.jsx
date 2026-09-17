import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@velora.com');
  const [password, setPassword] = useState('Admin@12345');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res?.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F7F5F0] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#141414] border border-velora-borderDark p-8 md:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-velora-champagne/10 border border-velora-champagne/30 text-velora-champagne rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-velora-champagne font-semibold block">
            Authorized Personnel Only
          </span>
          <h1 className="font-editorial text-3xl font-normal text-white">VELORA Master Atelier</h1>
          <p className="text-xs font-light text-white/50">Enter administrative credentials to access store controls.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/70 mb-1">Admin Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-velora-borderDark p-3 pl-10 text-xs text-white focus:outline-none focus:border-velora-champagne"
                required
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1">Master Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-velora-borderDark p-3 pl-10 text-xs text-white focus:outline-none focus:border-velora-champagne"
                required
              />
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-velora-champagne text-black py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Authorize Access</span>}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-xs">
          <Link to="/" className="text-white/40 hover:text-white underline font-light">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

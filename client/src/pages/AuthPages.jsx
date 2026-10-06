import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendFirebasePhoneOtp, verifyFirebasePhoneOtp } from '../firebase/phoneAuth';
import api from '../services/api';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Mobile OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isFirebaseSession, setIsFirebaseSession] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithOtp, loginWithFirebase } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = location.state?.from || '/';

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res?.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectUrl);
      }
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);

    try {
      // 1. Attempt Firebase Phone SMS OTP
      const fbRes = await sendFirebasePhoneOtp(phone, 'recaptcha-container');
      if (fbRes.success) {
        setConfirmationResult(fbRes.confirmationResult);
        setIsFirebaseSession(true);
        setOtpSent(true);
        success(`Firebase verification code dispatched to ${fbRes.formattedPhone}`);
      } else {
        console.warn('Firebase Phone Auth response:', fbRes.error);
        if (fbRes.code === 'auth/operation-not-allowed') {
          error('SMS delivery blocked: Please enable India (+91) in Firebase Console > Authentication > Settings > SMS Region Policy');
        } else {
          error(fbRes.error || 'Failed to dispatch Firebase OTP.');
        }

        // Also offer local fallback session for testing
        const res = await api.post('/auth/send-otp', { phone });
        if (res.data.success) {
          setIsFirebaseSession(false);
          setOtpSent(true);
          setDemoOtpHint(res.data.demoOtp || '123456');
        }
      }
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to dispatch OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      error('Please enter the verification code.');
      return;
    }
    setIsLoading(true);

    try {
      if (isFirebaseSession && confirmationResult) {
        // Verify with Firebase Phone Auth
        const verifyRes = await verifyFirebasePhoneOtp(confirmationResult, otp);
        if (verifyRes.success) {
          const res = await loginWithFirebase(phone, `Client ${phone.slice(-4)}`, verifyRes.uid, verifyRes.idToken);
          if (res?.success) {
            navigate(res.user.role === 'admin' ? '/admin' : redirectUrl);
          }
        } else {
          // Check if fallback demo code was used
          if (otp === '123456') {
            const fallbackRes = await loginWithOtp(phone, otp);
            if (fallbackRes?.success) {
              navigate(fallbackRes.user.role === 'admin' ? '/admin' : redirectUrl);
              return;
            }
          }
          error(verifyRes.error || 'Invalid Firebase OTP code.');
        }
      } else {
        // Verify with standard OTP service
        const res = await loginWithOtp(phone, otp);
        if (res?.success) {
          navigate(res.user.role === 'admin' ? '/admin' : redirectUrl);
        }
      }
    } catch (err) {
      error(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    setAuthMode('email');
    if (role === 'admin') {
      setEmail('admin@leo.com');
      setPassword('Admin@12345');
    } else {
      setEmail('customer@leo.com');
      setPassword('Customer@12345');
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      {/* Invisible Firebase Recaptcha Container */}
      <div id="recaptcha-container"></div>

      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full border border-black/10 p-1 flex items-center justify-center mx-auto shadow-sm">
              <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Welcome Back</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Sign In to LEO</h1>
            <p className="text-xs font-light text-velora-muted">Access your order history, wishlist, and concierge returns.</p>
          </div>

          {/* Tab Switcher: Mobile OTP vs Email */}
          <div className="flex border-b border-velora-border">
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`flex-1 pb-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                authMode === 'otp'
                  ? 'border-b-2 border-black text-black font-semibold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Firebase Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 pb-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                authMode === 'email'
                  ? 'border-b-2 border-black text-black font-semibold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Email & Password
            </button>
          </div>

          {/* MOBILE OTP LOGIN FORM */}
          {authMode === 'otp' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={14}
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                      required
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !phone || phone.length < 10}
                    className="px-4 py-3 bg-stone-800 text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-black disabled:opacity-50"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-stone-500 font-light mt-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured with Firebase Phone Authentication</span>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {demoOtpHint && !isFirebaseSession && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                      <span>Demo Mode OTP: <strong>{demoOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpHint)}
                        className="underline font-medium hover:text-black"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-600 mb-1">Enter 6-Digit Verification Code *</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-center tracking-[0.5em] text-sm font-semibold focus:outline-none focus:border-velora-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 4}
                    className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Sign In</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Fill (Client only) */}
          {authMode === 'email' && (
            <div className="p-3 bg-[#F0EDE6] border border-velora-border text-xs flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-velora-muted font-semibold">Client Demo:</span>
              <button
                type="button"
                onClick={() => handleDemoFill('customer')}
                className="px-4 py-1.5 bg-white border border-stone-300 text-[11px] font-medium hover:border-black transition-colors"
              >
                Auto-fill Client Demo
              </button>
            </div>
          )}

          {/* EMAIL LOGIN FORM */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@leo.com"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-stone-600">Password *</label>
                  <Link to="/forgot-password" className="text-stone-500 hover:text-black underline text-[11px]">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-velora-border text-center text-xs font-light text-stone-600">
            <span>New to LEO? </span>
            <Link to="/register" className="text-velora-black font-semibold underline hover:text-velora-champagne">
              Create Client Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'email'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Mobile OTP Registration state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isFirebaseSession, setIsFirebaseSession] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, loginWithOtp, loginWithFirebase } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await register(formData.name, formData.email, formData.password, formData.phone);
    setIsLoading(false);
    if (res?.success) {
      navigate('/');
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpPhone || otpPhone.length < 10) {
      error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!otpName.trim()) {
      error('Please enter your full name.');
      return;
    }
    setIsLoading(true);

    try {
      // 1. Attempt Firebase Phone SMS OTP
      const fbRes = await sendFirebasePhoneOtp(otpPhone, 'recaptcha-register-container');
      if (fbRes.success) {
        setConfirmationResult(fbRes.confirmationResult);
        setIsFirebaseSession(true);
        setOtpSent(true);
        success(`Firebase verification code dispatched to ${fbRes.formattedPhone}`);
      } else {
        // 2. Fallback to backend OTP
        console.info('Falling back to Atelier backend SMS service:', fbRes.error);
        const res = await api.post('/auth/send-otp', { phone: otpPhone });
        if (res.data.success) {
          setIsFirebaseSession(false);
          setOtpSent(true);
          setDemoOtpHint(res.data.demoOtp || '123456');
          success(res.data.message || 'OTP dispatched to your mobile number.');
        }
      }
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to dispatch OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      error('Please enter the verification code.');
      return;
    }
    setIsLoading(true);

    try {
      if (isFirebaseSession && confirmationResult) {
        const verifyRes = await verifyFirebasePhoneOtp(confirmationResult, otp);
        if (verifyRes.success) {
          const res = await loginWithFirebase(otpPhone, otpName, verifyRes.uid, verifyRes.idToken);
          if (res?.success) {
            navigate('/');
          }
        } else {
          if (otp === '123456') {
            const fallbackRes = await loginWithOtp(otpPhone, otp, otpName);
            if (fallbackRes?.success) {
              navigate('/');
              return;
            }
          }
          error(verifyRes.error || 'Invalid Firebase OTP code.');
        }
      } else {
        const res = await loginWithOtp(otpPhone, otp, otpName);
        if (res?.success) {
          navigate('/');
        }
      }
    } catch (err) {
      error(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      {/* Invisible Firebase Recaptcha Container */}
      <div id="recaptcha-register-container"></div>

      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Join the House</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Create Account</h1>
            <p className="text-xs font-light text-velora-muted">Unlock exclusive releases, saved measurements, and concierge tracking.</p>
          </div>

          {/* Tab Switcher: Firebase Mobile OTP vs Standard */}
          <div className="flex border-b border-velora-border">
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`flex-1 pb-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                authMode === 'otp'
                  ? 'border-b-2 border-black text-black font-semibold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Firebase Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 pb-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                authMode === 'email'
                  ? 'border-b-2 border-black text-black font-semibold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Email Sign Up
            </button>
          </div>

          {/* MOBILE OTP REGISTRATION FORM */}
          {authMode === 'otp' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={otpName}
                    onChange={(e) => setOtpName(e.target.value)}
                    placeholder="Alexander Wright"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={14}
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                      required
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !otpPhone || otpPhone.length < 10 || !otpName.trim()}
                    className="px-4 py-3 bg-stone-800 text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-black disabled:opacity-50"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-stone-500 font-light mt-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured with Firebase Phone Authentication</span>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {demoOtpHint && !isFirebaseSession && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                      <span>Demo Mode OTP: <strong>{demoOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpHint)}
                        className="underline font-medium hover:text-black"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-600 mb-1">Enter 6-Digit Verification Code *</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-center tracking-[0.5em] text-sm font-semibold focus:outline-none focus:border-velora-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 4}
                    className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Create Account</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STANDARD EMAIL FORM */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Elena Rostova"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="elena@example.com"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Create Password * (Min. 6 chars)</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-velora-border text-center text-xs font-light text-stone-600">
            <span>Already registered? </span>
            <Link to="/login" className="text-velora-black font-semibold underline hover:text-velora-champagne">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoToken, setDemoToken] = useState('');
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        success(res.data.message);
        setDemoToken(res.data.demoToken || 'demo_token');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to dispatch reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Security</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Password Recovery</h1>
            <p className="text-xs font-light text-velora-muted">Enter your registered email to receive recovery instructions.</p>
          </div>

          {demoToken ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-3">
              <p className="font-semibold">Reset Link Generated</p>
              <p className="font-light">In live production this is sent via email. For instant preview testing, proceed below:</p>
              <Link
                to={`/reset-password/${demoToken}`}
                className="block text-center py-2 bg-emerald-700 text-white font-medium uppercase tracking-wider text-[11px]"
              >
                Reset Password Now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@leo.com"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Transmit Instructions</span>}
              </button>
            </form>
          )}

          <div className="text-center text-xs">
            <Link to="/login" className="text-stone-500 hover:text-black underline font-light">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        success('Password updated successfully. Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Invalid or expired password reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">New Credentials</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Reset Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 mb-1">New Password (Min. 6 chars) *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

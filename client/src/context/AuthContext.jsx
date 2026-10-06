import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('velora_token') || null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('velora_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      localStorage.removeItem('velora_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('velora_token', newToken);
        localStorage.setItem('leo_token', newToken);
        setToken(newToken);
        setUser(userData);
        success(`Welcome back, ${userData.name}`);
        return { success: true, user: userData };
      }
    } catch (err) {
      // Offline / Static deployment fallback
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail === 'admin@leo.com' && password === 'Admin@12345') {
        const mockAdmin = {
          _id: 'admin_1',
          name: 'Alexander Vance',
          email: 'admin@leo.com',
          role: 'admin',
          phone: '+91 98765 43210',
        };
        const mockToken = 'mock_jwt_admin_token_leo';
        localStorage.setItem('velora_token', mockToken);
        localStorage.setItem('leo_token', mockToken);
        setToken(mockToken);
        setUser(mockAdmin);
        success(`Welcome back, ${mockAdmin.name}`);
        return { success: true, user: mockAdmin };
      }

      if (cleanEmail === 'customer@leo.com' && password === 'Customer@12345') {
        const mockCust = {
          _id: 'cust_1',
          name: 'Elena Rostova',
          email: 'customer@leo.com',
          role: 'customer',
          phone: '+91 98111 22334',
        };
        const mockToken = 'mock_jwt_cust_token_leo';
        localStorage.setItem('velora_token', mockToken);
        localStorage.setItem('leo_token', mockToken);
        setToken(mockToken);
        setUser(mockCust);
        success(`Welcome back, ${mockCust.name}`);
        return { success: true, user: mockCust };
      }

      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('leo_token', newToken);
        setToken(newToken);
        setUser(userData);
        success('Your LEO Atelier account has been created.');
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithOtp = async (phone, otp, name) => {
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp, name });
      if (res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('velora_token', newToken);
        localStorage.setItem('leo_token', newToken);
        setToken(newToken);
        setUser(userData);
        success(`Welcome, ${userData.name}`);
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithFirebase = async (phone, name, uid, idToken) => {
    try {
      const res = await api.post('/auth/firebase-login', { phone, name, uid, idToken });
      if (res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('velora_token', newToken);
        localStorage.setItem('leo_token', newToken);
        setToken(newToken);
        setUser(userData);
        success(`Welcome, ${userData.name}`);
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Firebase login failed.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    localStorage.removeItem('leo_token');
    localStorage.removeItem('velora_token');
    setToken(null);
    setUser(null);
    success('You have signed out of LEO Atelier.');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(prev => ({ ...prev, ...res.data.data }));
        success('Profile updated successfully.');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await api.post('/auth/address', addressData);
      if (res.data.success) {
        setUser(prev => ({ ...prev, addresses: res.data.data }));
        success('Shipping address added.');
        return { success: true, addresses: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add address.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      if (res.data.success) {
        setUser(prev => ({ ...prev, addresses: res.data.data }));
        success('Address removed.');
        return { success: true, addresses: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove address.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        loginWithOtp,
        loginWithFirebase,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

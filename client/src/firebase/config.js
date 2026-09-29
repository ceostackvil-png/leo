import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForLeoMenswearAtelier2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'leo-fashion-atelier.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'leo-fashion-atelier',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'leo-fashion-atelier.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '102938475612',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:102938475612:web:9a8b7c6d5e4f3a2b1c',
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;

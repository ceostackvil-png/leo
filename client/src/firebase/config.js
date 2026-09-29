import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBe3S1oUqnSvr7CY1RgDntJEhuRIJlAAyE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'leofashion-8a80c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'leofashion-8a80c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'leofashion-8a80c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '307031957749',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:307031957749:web:1e695a4989a1ff9a43e5bc',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-G43E29J7RP',
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;

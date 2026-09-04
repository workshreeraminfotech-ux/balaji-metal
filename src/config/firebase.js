import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_7oCwWC_7B1lZZD02-Ii332udoKEsaoA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "balaji-metal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "balaji-metal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "balaji-metal.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "416246372436",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:416246372436:web:e277c6df7e6c1e790f35c1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z0Z942ELFW"
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'YOUR_API_KEY'
  );
};

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialized for project:', firebaseConfig.projectId);
  } catch (error) {
    console.error('⚠️ Firebase initialization error:', error);
  }
} else {
  console.info('ℹ️ Firebase config missing. Using local cache fallback.');
}

export { app, db, storage, auth };

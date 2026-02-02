import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Note: Firebase Storage is NOT used anymore - using Cloudinary instead!
// This saves costs and avoids CORS issues

// Firebase configuration
// TODO: Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:dummy',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DUMMY',
};

// Validate required environment variables (only in browser)
const isProduction = process.env.NODE_ENV === 'production';
const hasRealConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'dummy-api-key';

if (typeof window !== 'undefined' && !hasRealConfig && isProduction) {
    console.warn("⚠️ Firebase not configured. Admin features will not work.");
}

// Initialize Firebase (prevent re-initialization in development)
let app;
try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Create a minimal mock app for build time
    app = null;
}

// Initialize services (with null check for build time)
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
// export const storage = getStorage(app); // NOT USED - using Cloudinary instead!

export default app;

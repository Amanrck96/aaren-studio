import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBYSs_xIhwazMSIVNPrktPOaXFjBDeVMsA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aarenintpro-1c09f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aarenintpro-1c09f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aarenintpro-1c09f.firebasestorage.app",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aarenintpro-1c09f-default-rtdb.firebaseio.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "603871066511",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:603871066511:web:722509e20111c88b20b3fa",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0V3GH1CEQH",
};

// Initialize Firebase (singleton pattern for Next.js SSR / Fast Refresh)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const storage = getStorage(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDkvahubexFIVgN-gi0TwoDbecNO3Ky3YE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eco-cycle-a9d38.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eco-cycle-a9d38",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eco-cycle-a9d38.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1074672732503",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1074672732503:web:338478c847653917a19612",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TYFBQBB3QJ",
};

// Validate Firebase configuration properties
const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId"
] as const;

for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    console.warn(`[Firebase Initialization Warning] Missing config property: ${key}. Using fallback values.`);
  }
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("[Firebase Initialization Error]", error);
  // Fallback to default config if initialization fails
  app = initializeApp({
    apiKey: "AIzaSyDkvahubexFIVgN-gi0TwoDbecNO3Ky3YE",
    authDomain: "eco-cycle-a9d38.firebaseapp.com",
    projectId: "eco-cycle-a9d38",
    storageBucket: "eco-cycle-a9d38.firebasestorage.app",
    messagingSenderId: "1074672732503",
    appId: "1:1074672732503:web:338478c847653917a19612"
  }, "fallback-app");
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

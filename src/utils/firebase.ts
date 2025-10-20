import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig as prodConfig } from '../config/firebase-config'

// Use environment variables in development, fallback to production config
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || prodConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || prodConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || prodConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || prodConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || prodConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || prodConfig.appId,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

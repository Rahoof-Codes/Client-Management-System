import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzEA2tQGRsKgAKAQmSVkb8y_CXFev04kM",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "client-management-system-4da11.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "client-management-system-4da11",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "client-management-system-4da11.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1024746719778",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:1024746719778:web:87cc5470a7b9999ae6987b",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P55RT82XV4",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics — safe initialization
let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {})
}
export { analytics }

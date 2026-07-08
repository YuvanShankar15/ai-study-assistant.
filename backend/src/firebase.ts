import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

let firestoreDb = null;
let firebaseAuth = null;
let firebaseStorage = null;

try {
  const serviceAccount = require('../../serviceAccountKey.json');
  
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  firestoreDb = getFirestore();
  firebaseAuth = getAuth();
  firebaseStorage = getStorage();
} catch (error) {
  console.warn("Firebase Admin SDK not initialized: serviceAccountKey.json missing. Using in-memory fallback.");
}

// In-memory fallback database for local development
const mockProfiles = new Map();

export const db = firestoreDb || {
  collection: (name: string) => ({
    doc: (id: string) => ({
      set: async (data: any, options?: { merge: boolean }) => {
        if (name === 'profiles') {
          const existing = mockProfiles.get(id) || {};
          mockProfiles.set(id, options?.merge ? { ...existing, ...data } : data);
        }
      },
      get: async () => {
        if (name === 'profiles') {
          const data = mockProfiles.get(id);
          return { exists: !!data, data: () => data };
        }
        return { exists: false, data: () => null };
      }
    })
  })
} as any;

export const auth = firebaseAuth;
export const storage = firebaseStorage;

// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIYXwSufm3kHkuzALeF7yqVfQILRRLLU4",
  authDomain: "practical-11-eda72.firebaseapp.com",
  projectId: "practical-11-eda72",
  storageBucket: "practical-11-eda72.firebasestorage.app",
  messagingSenderId: "662094062639",
  appId: "1:662094062639:web:06cb2b6e3d0546a2ee52da",
  measurementId: "G-0QEKJQZKKF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

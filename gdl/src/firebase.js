// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9GTVDiklpENWm0p8TZBAYMDyN571dJ74",
  authDomain: "gdl-inauguration.firebaseapp.com",
  projectId: "gdl-inauguration",
  storageBucket: "gdl-inauguration.firebasestorage.app",
  messagingSenderId: "662999745672",
  appId: "1:662999745672:web:04a49f14db7bc6520e4b3d",
  measurementId: "G-FWMNVN9WQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("Firebase initialized:", app);

export { app, analytics, db };

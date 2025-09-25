// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkyOHDPn1368WIkxi6iSDhEH5KsHjaT4A",
  authDomain: "cvaproto.firebaseapp.com",
  projectId: "cvaproto",
  storageBucket: "cvaproto.firebasestorage.app",
  messagingSenderId: "1065194260738",
  appId: "1:1065194260738:web:fda11909f348a0276c1a1b",
  measurementId: "G-92GVRN6EB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

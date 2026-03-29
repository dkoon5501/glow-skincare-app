import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAssnN4WsUMkSzt3nRQdxFk2LmBu0-_qe8",
  authDomain: "glow-skincare-a022a.firebaseapp.com",
  projectId: "glow-skincare-a022a",
  storageBucket: "glow-skincare-a022a.firebasestorage.app",
  messagingSenderId: "609560044384",
  appId: "1:609560044384:web:3558c192ead7f7782eb405"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

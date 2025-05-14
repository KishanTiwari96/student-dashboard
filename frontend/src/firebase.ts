import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAgghJExBDK-aqf8t7qW-EmaniNvt9iKYA",
  authDomain: "studentdashboard-e519f.firebaseapp.com",
  projectId: "studentdashboard-e519f",
  storageBucket: "studentdashboard-e519f.firebasestorage.app",
  messagingSenderId: "1048087849641",
  appId: "1:1048087849641:web:babbc78e0d6e87f7dbd7b8"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider(); 
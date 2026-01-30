// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9F-Xw2Bu0PLBKlKgyoC4UxCU9AcZ8srU",
  authDomain: "campusmarket-487cd.firebaseapp.com",
  projectId: "campusmarket-487cd",
  storageBucket: "campusmarket-487cd.firebasestorage.app",
  messagingSenderId: "668529500706",
  appId: "1:668529500706:web:8ef7c16ab83b63fd22a07b"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
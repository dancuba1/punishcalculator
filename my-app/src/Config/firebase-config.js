// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTmR2vwcKrUQ2VzOayJK7zfI7T6mysYeQ",
  authDomain: "punish-calculator.firebaseapp.com",
  projectId: "punish-calculator",
  storageBucket: "punish-calculator.appspot.com",
  messagingSenderId: "25218283809",
  appId: "1:25218283809:web:8ceeb7950a405639f0a660"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
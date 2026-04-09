// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD....",
  authDomain: "valentine-gift-generator.firebaseapp.com",
  projectId: "valentine-gift-generator",
  storageBucket: "valentine-gift-generator.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
export const db = getFirestore(app);


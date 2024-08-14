// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE1msoZNHJ1OXkZJ3iqcLCOz2Un62a6O0",
  authDomain: "inventory-managment-e8b81.firebaseapp.com",
  projectId: "inventory-managment-e8b81",
  storageBucket: "inventory-managment-e8b81.appspot.com",
  messagingSenderId: "622470647323",
  appId: "1:622470647323:web:5cdac7e81890c19b1f32be",
  measurementId: "G-Z5H9NJLT8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (typeof window !== 'undefined' && isSupported()) {
  getAnalytics(app);
}
const firestore = getFirestore(app)

export {firestore}
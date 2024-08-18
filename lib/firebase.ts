// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADUqPrF4H8--P9e882BiTBf9pCjs-qGcM",
  authDomain: "plant-diary-357fb.firebaseapp.com",
  projectId: "plant-diary-357fb",
  storageBucket: "plant-diary-357fb.appspot.com",
  messagingSenderId: "429125695992",
  appId: "1:429125695992:web:7205cf6b02b52d1bb6fe0d",
  measurementId: "G-00DXHG6709"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app)
export const storage = getStorage()
// export const vapidKeys = webpush.generateVAPIDKeys();
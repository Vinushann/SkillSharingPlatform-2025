// Import Firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Your Firebase Config (Replace with your own Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBJDHfgYiiv7k_bNhw1n3IDL-E5GLQjUU4",
  authDomain: "skillshare-db.firebaseapp.com",
  projectId: "skillshare-db",
  storageBucket: "skillshare-db.firebasestorage.app",
  messagingSenderId: "235194109565",
  appId: "1:235194109565:web:1b902464fe6339ac1e2b14",
  measurementId: "G-VZ2JD84L9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };
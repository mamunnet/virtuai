import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCO4uV5BR3ktC8Bq9AJ0hKMvAb0m1eCcWU",
  authDomain: "virtuai-789ec.firebaseapp.com",
  projectId: "virtuai-789ec",
  storageBucket: "virtuai-789ec.firebasestorage.app",
  messagingSenderId: "362502600290",
  appId: "1:362502600290:web:14f6ae82481afc19fa833b",
  measurementId: "G-VP3E8EX6S3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
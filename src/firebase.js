// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkuH0p4cCgiliAELbVvVLMn1j3ihHCD7U",
    authDomain: "resolute-b6883.firebaseapp.com",
    projectId: "resolute-b6883",
    storageBucket: "resolute-b6883.appspot.com",
    messagingSenderId: "497774562004",
    appId: "1:497774562004:web:0459d61c65d83b73a3c941",
    measurementId: "G-L1DVT6SRVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
export { auth, firestore, db };
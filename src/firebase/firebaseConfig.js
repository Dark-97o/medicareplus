import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAUCZZXpiOfZVgjmIrNAnn_LF0SOm1WwhA",
    authDomain: "healthcare-scheduler-5b242.firebaseapp.com",
    projectId: "healthcare-scheduler-5b242",
    storageBucket: "healthcare-scheduler-5b242.firebasestorage.app",
    messagingSenderId: "28196196047",
    appId: "1:28196196047:web:262b5a5020cd37f64b31ba"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
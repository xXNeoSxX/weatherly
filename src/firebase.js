// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDBJh8xVwWwLl54XOaiY33RAbz54FBTvjQ",
    authDomain: "weatherly-8546c.firebaseapp.com",
    projectId: "weatherly-8546c",
    storageBucket: "weatherly-8546c.firebasestorage.app",
    messagingSenderId: "628688193152",
    appId: "1:628688193152:web:158d677617a3442dc30865",
    measurementId: "G-M7S1MTDMK9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Inicio de sesión anónimo
signInAnonymously(auth).catch(console.error);

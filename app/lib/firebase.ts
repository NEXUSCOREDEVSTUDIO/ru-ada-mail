import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// ⚠️ IMPORTANTE: REEMPLAZA ESTOS VALORES CON TU CONFIGURACIÓN DE FIREBASE
// Puedes encontrar esto en tu consola de Firebase: Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyC-F0Z6PkUS1Gvdc77Kc7w1lo0t5Z9WCsM",
    authDomain: "runadamail.firebaseapp.com",
    databaseURL: "https://runadamail-default-rtdb.firebaseio.com",
    projectId: "runadamail",
    storageBucket: "runadamail.firebasestorage.app",
    messagingSenderId: "605422239798",
    appId: "1:605422239798:web:32545f7af9b5c0d5d35897",
    measurementId: "G-0YNMV4M3SK"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
export const auth = getAuth(app);

// Initialize Analytics safely (client-side only)
if (typeof window !== "undefined") {
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
        isSupported().then((yes) => {
            if (yes) {
                getAnalytics(app);
            }
        });
    });
}

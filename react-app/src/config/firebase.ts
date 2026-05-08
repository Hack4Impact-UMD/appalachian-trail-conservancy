// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { connectAuthEmulator, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD82HS3ovdxxQkMc7dTUoNUsIsHOxHz6fQ",
  authDomain: "atc-training-aa43c.firebaseapp.com",
  projectId: "atc-training-aa43c",
  storageBucket: "atc-training-aa43c.firebasestorage.app",
  messagingSenderId: "545476594455",
  appId: "1:545476594455:web:95e24010a92fba50bb4552",
  measurementId: "G-VVNLT1GTFC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-east4");
export const auth = getAuth(app);

const useFirebaseEmulators =
  import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

if (useFirebaseEmulators) {
  const emulatorHost =
    import.meta.env.VITE_FIREBASE_EMULATOR_HOST || "127.0.0.1";

  // Ignore duplicate emulator wiring during hot reloads.
  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, {
      disableWarnings: true,
    });
  } catch (error) {
    console.warn("Auth emulator already connected", error);
  }

  try {
    connectFirestoreEmulator(db, emulatorHost, 8080);
  } catch (error) {
    console.warn("Firestore emulator already connected", error);
  }

  try {
    connectFunctionsEmulator(functions, emulatorHost, 5001);
  } catch (error) {
    console.warn("Functions emulator already connected", error);
  }
}

export default app;

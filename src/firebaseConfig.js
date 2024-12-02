import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import configuration from firebase-key.json
import firebaseKey from './firebase-key.json';

const app = initializeApp(firebaseKey); // Initialize Firebase app
const auth = getAuth(app);             // Set up Firebase Authentication
const db = getFirestore(app);          // Set up Firestore database
const googleProvider = new GoogleAuthProvider(); // Google Auth provider

// Authentication helper functions
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // Return the authenticated user
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { auth, db, signInWithGoogle, logOut };

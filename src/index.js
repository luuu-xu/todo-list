import "./style.css";
import initialize from "./initialize";
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from "./firebase/firebase-config";
import { initFirebaseAuth } from "./firebase/auth";

// Initialize Firebase.
const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

// Initialize Firebase Authentication and get a reference to the service.
initFirebaseAuth();

initialize.start();

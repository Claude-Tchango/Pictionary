import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDUvtTGFjxXNKnfaVhCAdNxTw0PJauOpZM",
  authDomain: "pictionary-d84b8.firebaseapp.com",
  projectId: "pictionary-d84b8",
  storageBucket: "pictionary-d84b8.appspot.com",
  messagingSenderId: "805816931222",
  appId: "1:805816931222:web:eaf34959efcc3d077bc3b7",
  measurementId: "G-1P3D6WM210",
  databaseURL: "https://pictionary-d84b8-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);
// Configure la persistance avec AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, database, firestore };

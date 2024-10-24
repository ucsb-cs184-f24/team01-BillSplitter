import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';  // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyDblRQzTRhryR0jOapmRUW74lEKHNR4o3k",
  authDomain: "split-7020d.firebaseapp.com",
  projectId: "split-7020d",
  storageBucket: "split-7020d.appspot.com", // This is important for storage
  messagingSenderId: "258394255642",
  appId: "1:258394255642:web:aad4f86d2dcbef39343ca3"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const db = firebase.firestore();
export const storage = firebase.storage(); // Add this line

export default firebase;
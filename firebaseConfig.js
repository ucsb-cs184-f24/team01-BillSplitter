import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDblRQzTRhryR0jOapmRUW74lEKHNR4o3k",
    authDomain: "split-7020d.firebaseapp.com",
    projectId: "split-7020d",
    storageBucket: "split-7020d.appspot.com",
    messagingSenderId: "258394255642",
    appId: "1:258394255642:web:aad4f86d2dcbef39343ca3"
  };
  
// initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

export default firebase;
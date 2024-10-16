import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB-xcKAeN0Am-4DUMFwsbNJxQSL4gpSHlc",
  authDomain: "bill-splitter-925f6.firebaseapp.com",
  projectId: "bill-splitter-925f6",
  storageBucket: "bill-splitter-925f6.appspot.com",
  messagingSenderId: "155521107910",
  appId: "1:155521107910:web:834c1994202e52f6af94c7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

import { 
  REACT_APP_FIREBASE_API_KEY, 
  REACT_APP_FIREBASE_AUTH_DOMAIN, 
  REACT_APP_FIREBASE_PROJECT_ID, 
  REACT_APP_FIREBASE_STORAGE_BUCKET, 
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID, 
  REACT_APP_FIREBASE_APP_ID 
} from '@env';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

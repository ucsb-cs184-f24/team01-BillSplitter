import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCg1npbClH-0SxsRrffFSEPMwLHRRgWTys",
  authDomain: "auth-and-nav.firebaseapp.com",
  projectId: "auth-and-nav",
  storageBucket: "auth-and-nav.appspot.com",
  messagingSenderId: "767388186853",
  appId: "1:767388186853:ios:8c4c9fc5f0f132119b7c0c",
};

// initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

export default firebase;

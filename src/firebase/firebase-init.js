import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  authDomain: "react-movies-77c32.firebaseapp.com",
  projectId: "react-movies-77c32",
  storageBucket: "react-movies-77c32.appspot.com",
  messagingSenderId: "176065143277",
  appId: "1:176065143277:web:c52bbd38d624fd6b4cc7e4",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init firestore
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectStorage, timestamp };

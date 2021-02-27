import * as firebase from "firebase";
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDzRg1sdfaqg74jYLcLuqppA90npZxhZe8",
    authDomain: "book-scanner-library.firebaseapp.com",
    projectId: "book-scanner-library",
    storageBucket: "book-scanner-library.appspot.com",
    messagingSenderId: "531675208669",
    appId: "1:531675208669:web:7166b978d1cba249e8b434"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()
// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/firestore";
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlPJUBR5pXVDCWKBTeWTOfVW4Uj0qtTEI",
  authDomain: "restaurantreactnative-d88ed.firebaseapp.com",
  projectId: "restaurantreactnative-d88ed",
  storageBucket: "restaurantreactnative-d88ed.appspot.com",
  messagingSenderId: "738075878250",
  appId: "1:738075878250:web:b803de562e3cbc26993b13"
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const authentication = firebase.auth();
const fireDB = app.firestore();

export { authentication, fireDB };
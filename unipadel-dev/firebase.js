// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6On-46wUdqCnPws9wSbrJb15arBqAetw",
  authDomain: "unipadel-eec04.firebaseapp.com",
  projectId: "unipadel-eec04",
  storageBucket: "unipadel-eec04.appspot.com",
  messagingSenderId: "754407571145",
  appId: "1:754407571145:web:03e41f65b4e6f1465a5718"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();

export { auth };
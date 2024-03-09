// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMMUyLiC2Xmqfi4wJ2NYYmQ5BeXjTSDVU",
    authDomain: "paulo-junior-98c95.firebaseapp.com",
    databaseURL: "https://paulo-junior-98c95-default-rtdb.firebaseio.com",
    projectId: "paulo-junior-98c95",
    storageBucket: "paulo-junior-98c95.appspot.com",
    messagingSenderId: "1014816035519",
    appId: "1:1014816035519:web:4dc2b80ce9df8b5f7d2c0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const auth = getAuth(app)

export {
    db,
    auth
}
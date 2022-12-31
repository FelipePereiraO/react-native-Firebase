// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtZk4XRTOIo7GQ42N8LOr4uOPzjSD1Cng",
    authDomain: "paulomaq-app.firebaseapp.com",
    databaseURL: "https://paulomaq-app-default-rtdb.firebaseio.com",
    projectId: "paulomaq-app",
    storageBucket: "paulomaq-app.appspot.com",
    messagingSenderId: "9099212141",
    appId: "1:9099212141:web:02405bc973cbf6d0815664",
    measurementId: "G-WS4BED1HEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app)
const auth = getAuth(app)

export {
    db,
    auth
}
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCOJ7DTsE7XKkagOjDrk-YdqKHyQ5sZ8A",
  authDomain: "mayanagri001.firebaseapp.com",
  projectId: "mayanagri001",
  storageBucket: "mayanagri001.firebasestorage.app",
  messagingSenderId: "195574695846",
  appId: "1:195574695846:web:955ab52a5a153cf69c7167"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9l4_7gCDNoVAuky6VaC7mW_ksAmCW8H8",
  authDomain: "gen-lang-client-0390401818.firebaseapp.com",
  projectId: "gen-lang-client-0390401818",
  storageBucket: "gen-lang-client-0390401818.firebasestorage.app",
  messagingSenderId: "416820105726",
  appId: "1:416820105726:web:f1f4c384bf6414b7d7f0af",
  measurementId: "G-MQKNJ7WZ4K"
};

let db: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Salus Intelligence: Firebase Connection Established");
} catch (e) {
  console.warn("Salus Intelligence: Firestore is unavailable. Operating in local-only mode.", e);
}

export { db };
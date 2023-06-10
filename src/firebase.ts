import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1a7Pi0314IZVt3fpBe3zHGE_c31bd2g0",
  authDomain: "yusuf-demo-9c7c8.firebaseapp.com",
  projectId: "yusuf-demo-9c7c8",
  storageBucket: "yusuf-demo-9c7c8.appspot.com",
  messagingSenderId: "294503325448",
  appId: "1:294503325448:web:6b11137343b2f6c3f0d6bd",
  measurementId: "G-YZQBPL4G2L",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

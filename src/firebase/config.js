import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//  CREDENCIALES DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDaXAP2IP8YZBxesYZrOs3dmqaDDqDhhKg",
  authDomain: "lista-peliculas-react.firebaseapp.com",
  projectId: "lista-peliculas-react",
  storageBucket: "lista-peliculas-react.firebasestorage.app",
  messagingSenderId: "101949137465",
  appId: "1:101949137465:web:4c7eacd657070dad08e3e8"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore y exporta la referencia
export const db = getFirestore(app);

// Exporta la app por si se necesita en otros archivos
export default app;
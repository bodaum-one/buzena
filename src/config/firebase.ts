// filepath: src/config/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

// Configuração do Firebase - Credenciais do projeto Buzena
const firebaseConfig = {
  apiKey: "AIzaSyBMD1-kgLxLTQ75Sqxh2jfjkspPmZf1Puw",
  authDomain: "buzena-2d814.firebaseapp.com",
  projectId: "buzena-2d814",
  storageBucket: "buzena-2d814.firebasestorage.app",
  messagingSenderId: "823378031830",
  appId: "1:823378031830:web:55ba2ee6b6abff8fb30577",
  measurementId: "G-FVN77BKZMG",
  databaseURL: "https://buzena-2d814-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Serviços do Firebase
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const realtimeDb: Database = getDatabase(app);

// Messaging (apenas se suportado)
export const initMessaging = async (): Promise<Messaging | null> => {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  return null;
};

export default app;
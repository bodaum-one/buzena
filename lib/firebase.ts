import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken as getFcmToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔔 Função correta para pegar token
export const getFCMToken = async () => {
  try {
    if (typeof window === 'undefined') return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const messaging = getMessaging(app);

    const token = await getFcmToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.log('Erro ao obter token de notificação:', error);
    return null;
  }
};

export type UserType = 'cliente' | 'entregador' | 'empresa_admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  companyId?: string;
  fcmToken?: string;
  rating: {
    average: number;
    count: number;
  };
  avatarUrl?: string;
  createdAt: string;
}

export interface DeliveryProfile {
  userId: string;
  companyId: string;
  cpf: string;
  vehicle: 'moto' | 'carro' | 'bike';
  plate?: string;
  selfieUrl: string;
  documentUrl: string;
  verificationStatus: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
  };
  logoUrl?: string;
  active: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
}
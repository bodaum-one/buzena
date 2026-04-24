// filepath: src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'delivery' | 'client';
  createdAt: any;
  fcmToken: string | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  initializing: boolean;
  signUp: (email: string, password: string, name: string, role: 'delivery' | 'client') => Promise<{ success: boolean; user?: FirebaseUser; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: FirebaseUser; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  updateUserFCMToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'delivery' | 'client'
  ): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      await updateProfile(auth.currentUser, {
        displayName: name
      });

      const userDataToSave: UserData = {
        uid,
        email,
        name,
        role,
        createdAt: serverTimestamp(),
        fcmToken: null
      };

      await setDoc(doc(db, 'users', uid), userDataToSave);
      setUserData(userDataToSave);
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserFCMToken = async (token: string): Promise<void> => {
    if (user && userData) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          fcmToken: token
        }, { merge: true });
      } catch (error) {
        console.log('Error updating FCM token:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    initializing,
    signUp,
    signIn,
    logout,
    updateUserFCMToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
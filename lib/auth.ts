import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, UserType, DeliveryProfile } from '@/lib/firebase';

export async function registerUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  userType: UserType
) {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Atualizar perfil do usuário
    await updateProfile(firebaseUser, {
      displayName: name
    });

    // Criar documento do usuário no Firestore
    const userData = {
      name,
      email,
      phone,
      type: userType,
      rating: {
        average: 0,
        count: 0
      },
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return { success: true, userId: firebaseUser.uid };
  } catch (error: any) {
    console.error('Erro no registro:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao criar conta' 
    };
  }
}

export async function registerDeliveryProfile(
  userId: string,
  cpf: string,
  vehicle: 'moto' | 'carro' | 'bike',
  plate: string,
  selfieUrl: string,
  documentUrl: string,
  companyId: string
) {
  try {
    const profileData: DeliveryProfile = {
      userId,
      companyId,
      cpf,
      vehicle,
      plate: plate || undefined,
      selfieUrl,
      documentUrl,
      verificationStatus: 'pendente',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'deliveryProfiles', userId), profileData);

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar perfil de entregador:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao criar perfil' 
    };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, userId: userCredential.user.uid };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { 
      success: false, 
      error: error.message || 'Email ou senha incorretos' 
    };
  }
}

export async function getDeliveryProfile(userId: string) {
  try {
    const profileDoc = await getDoc(doc(db, 'deliveryProfiles', userId));
    if (profileDoc.exists()) {
      return { data: profileDoc.data() as DeliveryProfile };
    }
    return { data: null };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return { data: null };
  }
}

export async function createUserInFirestore(firebaseUser: any) {
  const userData = {
    name: firebaseUser.displayName || 'Usuário',
    email: firebaseUser.email || '',
    phone: '',
    type: 'cliente' as UserType,
    rating: {
      average: 0,
      count: 0
    },
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);
}
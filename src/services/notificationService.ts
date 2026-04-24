// filepath: src/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, set, onValue, off } from 'firebase/database';
import { db, realtimeDb } from '../config/firebase';
import * as Haptics from 'expo-haptics';
import { Audio, Sound } from 'expo-av';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface BuzinaPayload {
  type: 'buzina';
  deliveryId: string;
  deliveryPersonId: string;
  clientId: string;
  clientName: string;
  address: string;
  orderNumber: string;
  soundType: string;
  timestamp: number;
}

export interface DeliveryData {
  clientName: string;
  address: string;
  orderNumber: string;
}

export const requestNotificationPermissions = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('buzina', {
      name: 'Buzina',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFD700',
      sound: 'default',
    });
  }

  return await Notifications.getExpoPushTokenAsync();
};

export const setupNotificationHandlers = (
  onBuzinaReceived?: (data: BuzinaPayload) => void
): Notifications.Subscription => {
  const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
    const data = notification.request.content.data as BuzinaPayload;
    
    if (data && data.type === 'buzina') {
      // Feedback háptico
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      // Tocar som local
      await playBuzinaSound(data.soundType || 'classic_horn');
      
      if (onBuzinaReceived) {
        onBuzinaReceived(data);
      }
    }
  });

  return subscription;
};

export const playBuzinaSound = async (soundType: string): Promise<void> => {
  try {
    // Configurar áudio para reprodução imediata
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Reproduzir som baseado no tipo
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/buzina.mp3'),
      { shouldPlay: true, volume: 1.0 }
    );

    // Descarregar após reprodução
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing sound:', error);
    // Fallback: vibração
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
};

export const triggerBuzina = async (
  deliveryPersonId: string,
  clientId: string,
  deliveryData: DeliveryData,
  soundType: string
): Promise<{ success: boolean; deliveryId?: string; error?: string }> => {
  try {
    const deliveryId = `delivery_${Date.now()}`;
    
    // 1. Criar evento no Realtime Database para baixa latência
    await set(ref(realtimeDb, `buzina/${deliveryId}`), {
      triggeredBy: deliveryPersonId,
      clientId: clientId,
      deliveryId: deliveryId,
      clientName: deliveryData.clientName,
      address: deliveryData.address,
      orderNumber: deliveryData.orderNumber,
      soundType: soundType,
      triggeredAt: serverTimestamp(),
      status: 'triggered'
    });

    // 2. Enviar notificação push via Firestore
    const notificationData = {
      type: 'buzina',
      deliveryId,
      deliveryPersonId,
      clientId,
      clientName: deliveryData.clientName,
      address: deliveryData.address,
      orderNumber: deliveryData.orderNumber,
      soundType,
      timestamp: Date.now()
    };

    // Salvar no histórico de notificações
    await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: serverTimestamp(),
      delivered: false
    });

    // Feedback háptico para o entregador
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    return { success: true, deliveryId };
  } catch (error: any) {
    console.error('Error triggering buzina:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToBuzinaEvents = (
  deliveryId: string,
  callback: (data: any) => void
): (() => void) => {
  const buzinaRef = ref(realtimeDb, `buzina/${deliveryId}`);
  
  onValue(buzinaRef, (snapshot) => {
    const data = snapshot.val();
    if (data && callback) {
      callback(data);
    }
  });

  return () => off(buzinaRef);
};

export const getNotificationHistory = async (
  userId: string,
  role: string
): Promise<any[]> => {
  try {
    let q;
    
    if (role === 'client') {
      q = query(
        collection(db, 'notifications'),
        where('clientId', '==', userId),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'notifications'),
        where('deliveryPersonId', '==', userId),
        orderBy('timestamp', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const notifications: any[] = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return notifications;
  } catch (error) {
    console.error('Error getting notification history:', error);
    return [];
  }
};

export default {
  requestNotificationPermissions,
  setupNotificationHandlers,
  playBuzinaSound,
  triggerBuzina,
  subscribeToBuzinaEvents,
  getNotificationHistory
};
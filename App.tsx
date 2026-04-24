// filepath: App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DeliveryListScreen from './src/screens/DeliveryListScreen';
import BuzinaScreen from './src/screens/BuzinaScreen';
import ClientHomeScreen from './src/screens/ClientHomeScreen';

// Services
import { 
  requestNotificationPermissions, 
  setupNotificationHandlers 
} from './src/services/notificationService';

// Constants
import colors from './src/constants/colors';
import { Delivery } from './src/components/DeliveryCard';

// Tipos de navegação
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  DeliveryList: undefined;
  ClientHome: undefined;
  Buzina: { delivery: Delivery };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente de loading enquanto verifica auth
const AuthLoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingIcon}>📢</Text>
    <Text style={styles.loadingText}>BUZENA</Text>
  </View>
);

// Navigator principal com auth
const AppNavigator: React.FC = () => {
  const { user, userData, loading, initializing } = useAuth();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const initNotifications = async (): Promise<void> => {
      try {
        // Solicitar permissões de notificação
        await requestNotificationPermissions();
        
        // Configurar handlers de notificação
        setupNotificationHandlers((notification) => {
          console.log('Notificação recebida:', notification);
        });
      } catch (error) {
        console.log('Error initializing notifications:', error);
      }
    };

    if (!initializing) {
      initNotifications();
      setIsReady(true);
    }
  }, [initializing]);

  if (loading || initializing || !isReady) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {user ? (
        // Usuário logado - mostrar tela baseada no role
        <>
          {userData?.role === 'delivery' ? (
            <Stack.Screen name="DeliveryList" component={DeliveryListScreen} />
          ) : (
            <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
          )}
          <Stack.Screen name="Buzina" component={BuzinaScreen} />
        </>
      ) : (
        // Usuário não logado
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// App principal
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
});
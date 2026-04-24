// filepath: src/screens/BuzinaScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import BuzinaButton from '../components/BuzinaButton';
import SoundPicker from '../components/SoundPicker';
import { triggerBuzina } from '../services/notificationService';
import colors from '../constants/colors';
import { Delivery } from '../components/DeliveryCard';

type RootStackParamList = {
  Buzina: { delivery: Delivery };
};

const BuzinaScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Buzina'>>();
  const { user, userData } = useAuth();
  const [selectedSound, setSelectedSound] = useState<string>('classic_horn');
  const [isBuzining, setIsBuzining] = useState<boolean>(false);
  const [buzinaCount, setBuzinaCount] = useState<number>(0);

  const delivery: Delivery = route.params?.delivery || {
    id: 'demo',
    orderNumber: '0000',
    clientName: 'Cliente Demo',
    address: 'Endereço Demo',
    status: 'pending',
    createdAt: { seconds: Date.now() / 1000 }
  };

  const handleBuzina = async (): Promise<void> => {
    if (isBuzining) return;

    setIsBuzining(true);
    
    try {
      const result = await triggerBuzina(
        user?.uid || 'unknown',
        delivery.clientId || 'demo-client',
        {
          clientName: delivery.clientName,
          address: delivery.address,
          orderNumber: delivery.orderNumber
        },
        selectedSound
      );

      if (result.success) {
        setBuzinaCount(prev => prev + 1);
        Alert.alert(
          '✅ Buzina Enviada!',
          `Notificação enviada para ${delivery.clientName}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', result.error || 'Falha ao enviar buzina');
      }
    } catch (error) {
      console.error('Buzina error:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a buzina');
    } finally {
      setIsBuzining(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Buzinar</Text>
          <Text style={styles.headerSubtitle}>
            Toque para avisar o cliente
          </Text>
        </View>
      </View>

      {/* Info do Cliente */}
      <View style={styles.clientInfo}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Pedido</Text>
          <Text style={styles.infoValue}>#{delivery.orderNumber}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Cliente</Text>
          <Text style={styles.infoValue}>{delivery.clientName}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Endereço</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {delivery.address}
          </Text>
        </View>
      </View>

      {/* Seletor de Som */}
      <SoundPicker
        selectedSound={selectedSound}
        onSelectSound={setSelectedSound}
      />

      {/* Botão Principal */}
      <View style={styles.buttonContainer}>
        <BuzinaButton 
          onPress={handleBuzina}
          disabled={isBuzining}
          size="large"
        />
        <Text style={styles.hint}>
          Toque para enviar a buzina
        </Text>
      </View>

      {/* Contador */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterLabel}>Buzinas enviadas hoje</Text>
        <Text style={styles.counterValue}>{buzinaCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  clientInfo: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  counterLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  counterValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BuzinaScreen;
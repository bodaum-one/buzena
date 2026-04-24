// filepath: src/screens/ClientHomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import NotificationItem, { AppNotification } from '../components/NotificationItem';
import { getNotificationHistory } from '../services/notificationService';
import colors from '../constants/colors';

type RootStackParamList = {
  ClientHome: undefined;
};

const ClientHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, userData, logout } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (): Promise<void> => {
    try {
      // Carregar histórico de notificações
      const history = await getNotificationHistory(user?.uid || '', 'client');
      
      // Usar dados de exemplo se não houver histórico
      if (history.length === 0) {
        const mockNotifications: AppNotification[] = [
          {
            id: '1',
            type: 'buzina',
            orderNumber: '1001',
            clientName: 'Entregador João',
            address: 'Sua casa',
            timestamp: { seconds: Date.now() / 1000 },
            delivered: true
          },
          {
            id: '2',
            type: 'buzina',
            orderNumber: '1002',
            clientName: 'Entregadora Maria',
            address: 'Sua casa',
            timestamp: { seconds: Date.now() / 1000 - 3600 },
            delivered: true
          }
        ];
        setNotifications(mockNotifications);
      } else {
        setNotifications(history);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = (notification: AppNotification): void => {
    Alert.alert(
      'Detalhes da Entrega',
      `Pedido: #${notification.orderNumber}\nEntregador: ${notification.clientName}\nEndereço: ${notification.address}`,
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: async () => await logout() }
      ]
    );
  };

  const renderNotification = ({ item }: { item: AppNotification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userData?.name || 'Cliente'}!</Text>
          <Text style={styles.subtitle}>
            {notifications.length} notificações
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>🟢 Online</Text>
        </View>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusIcon}>🔔</Text>
        <View style={styles.statusInfo}>
          <Text style={styles.statusTitle}>Pronto para receber</Text>
          <Text style={styles.statusSubtitle}>
            Você será notificado quando o entregador buzinar
          </Text>
        </View>
      </View>

      {/* Lista de Notificações */}
      <Text style={styles.sectionTitle}>Histórico</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>Nenhuma notificação ainda</Text>
            <Text style={styles.emptySubtext}>
              Aguarde o entregador buzinar
            </Text>
          </View>
        }
      />

      {/* Botão de Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default ClientHomeScreen;
// filepath: src/screens/DeliveryListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import DeliveryCard, { Delivery } from '../components/DeliveryCard';
import colors from '../constants/colors';

type RootStackParamList = {
  DeliveryList: undefined;
  Buzina: { delivery: Delivery };
};

const DeliveryListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, userData, logout } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async (): Promise<void> => {
    try {
      // Carregar entregas do Firestore
      // Por agora, usar dados de exemplo
      const mockDeliveries: Delivery[] = [
        {
          id: '1',
          orderNumber: '1001',
          clientName: 'João Silva',
          address: 'Rua das Flores, 123 - Centro',
          status: 'pending',
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: '2',
          orderNumber: '1002',
          clientName: 'Maria Santos',
          address: 'Av. Principal, 456 - Jardim',
          status: 'pending',
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: '3',
          orderNumber: '1003',
          clientName: 'Pedro Costa',
          address: 'Rua do Comércio, 789 - Bairro',
          status: 'pending',
          createdAt: { seconds: Date.now() / 1000 }
        }
      ];
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadDeliveries();
  };

  const handleSelectDelivery = (delivery: Delivery): void => {
    navigation.navigate('Buzina', { delivery });
  };

  const handleAddDelivery = async (): Promise<void> => {
    Alert.prompt(
      'Nova Entrega',
      'Digite o número do pedido:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: async (orderNumber) => {
            if (orderNumber) {
              Alert.prompt(
                'Nome do Cliente',
                'Digite o nome do cliente:',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Adicionar',
                    onPress: async (clientName) => {
                      if (clientName) {
                        Alert.prompt(
                          'Endereço',
                          'Digite o endereço de entrega:',
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Adicionar',
                              onPress: async (address) => {
                                if (address) {
                                  const newDelivery: Delivery = {
                                    id: Date.now().toString(),
                                    orderNumber,
                                    clientName,
                                    address,
                                    status: 'pending',
                                    createdAt: { seconds: Date.now() / 1000 }
                                  };
                                  setDeliveries(prev => [newDelivery, ...prev]);
                                }
                              }
                            }
                          ],
                          'plain-text'
                        );
                      }
                    }
                  }
                ],
                'plain-text'
              );
            }
          }
        }
      ],
      'plain-text'
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

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <DeliveryCard
      delivery={item}
      onPress={handleSelectDelivery}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userData?.name || 'Entregador'}!</Text>
          <Text style={styles.subtitle}>{deliveries.length} entregas pendentes</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDelivery}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Entregas */}
      <FlatList
        data={deliveries}
        renderItem={renderDelivery}
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
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Nenhuma entrega encontrada</Text>
            <Text style={styles.emptySubtext}>Toque em + para adicionar uma entrega</Text>
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
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: colors.black,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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

export default DeliveryListScreen;
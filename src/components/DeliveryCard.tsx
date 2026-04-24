// filepath: src/components/DeliveryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import colors from '../constants/colors';

export interface Delivery {
  id: string;
  orderNumber: string;
  clientName: string;
  address: string;
  status: 'pending' | 'arrived' | 'completed';
  createdAt: { seconds: number };
}

interface DeliveryCardProps {
  delivery: Delivery;
  onPress?: (delivery: Delivery) => void;
  isSelected?: boolean;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ 
  delivery, 
  onPress, 
  isSelected = false 
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'arrived': return colors.success;
      case 'completed': return colors.info;
      default: return colors.textMuted;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'arrived': return 'Chegou';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    isSelected && styles.selectedCard
  ];

  return (
    <TouchableOpacity 
      style={cardStyle}
      onPress={() => onPress && onPress(delivery)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderBadge}>
          <Text style={styles.orderNumber}>#{delivery.orderNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
          <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.clientName}>{delivery.clientName}</Text>
        <Text style={styles.address}>{delivery.address}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {delivery.createdAt ? new Date(delivery.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : ''}
        </Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>✓ Selecionado</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderNumber: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    marginBottom: 12,
  },
  clientName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 12,
  },
  selectedIndicator: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DeliveryCard;
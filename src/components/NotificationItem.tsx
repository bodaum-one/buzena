// filepath: src/components/NotificationItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

export interface AppNotification {
  id: string;
  type: string;
  orderNumber?: string;
  clientName: string;
  address: string;
  timestamp?: { seconds: number };
  createdAt?: { seconds: number };
  delivered?: boolean;
}

interface NotificationItemProps {
  notification: AppNotification;
  onPress?: (notification: AppNotification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress 
}) => {
  const formatDate = (timestamp?: { seconds: number }): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔔</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {notification.type === 'buzina' ? 'Buzina Recebida!' : 'Notificação'}
        </Text>
        <Text style={styles.clientName}>{notification.clientName || notification.orderNumber}</Text>
        <Text style={styles.address}>{notification.address}</Text>
        <Text style={styles.timestamp}>
          {formatDate(notification.timestamp || notification.createdAt)}
        </Text>
      </View>

      <View style={styles.statusIndicator}>
        {notification.delivered ? (
          <Text style={styles.statusDelivered}>✓</Text>
        ) : (
          <View style={styles.statusPending} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clientName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  address: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
  },
  statusIndicator: {
    marginLeft: 8,
  },
  statusDelivered: {
    color: colors.success,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusPending: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.warning,
  },
});

export default NotificationItem;
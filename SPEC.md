# Buzena - Especificação Técnica

## 1. Visão Geral do Projeto

**Nome:** Buzena  
**Tipo:** Aplicativo Mobile Híbrido (React Native + Expo)  
**Objetivo:** Buzina virtual para entregadores avisarem clientes que o pedido chegou

## 2. Stack Tecnológico

- **Frontend:** React Native com Expo SDK 52
- **Backend:** Firebase (Auth, Firestore, Cloud Messaging)
- **Notificações:** Expo Notifications + Firebase Cloud Messaging
- **Navegação:** React Navigation v6
- **Estado:** Context API + AsyncStorage
- **Áudio:** expo-av para sons de buzina
- **Vibração:** expo-haptics para feedback háptico

## 3. Estrutura de Dados Firebase

### Collections Firestore:

```
users/
  - {uid}
    - email: string
    - name: string
    - role: "delivery" | "client"
    - fcmToken: string
    - createdAt: timestamp

deliveries/
  - {deliveryId}
    - deliveryPersonId: string
    - clientId: string
    - clientName: string
    - address: string
    - orderNumber: string
    - status: "pending" | "arrived" | "completed"
    - createdAt: timestamp
    - arrivedAt: timestamp | null
```

### Realtime Database - Buzina Events:

```
buzina/
  - {deliveryId}
    - triggeredBy: string (deliveryPersonId)
    - triggeredAt: timestamp
    - soundType: string
    - status: "triggered" | "received"
```

## 4. Arquitetura de Componentes

### Telas:
1. **SplashScreen** - Logo e loading
2. **LoginScreen** - Autenticação Firebase
3. **RegisterScreen** - Cadastro de usuários
4. **DeliveryListScreen** - Lista de entregas (Entregador)
5. **BuzinaScreen** - Tela principal de buzinar
6. **ClientHomeScreen** - Home do cliente
7. **NotificationsScreen** - Histórico de notificações

### Componentes Reutilizáveis:
- `BuzinaButton` - Botão grande de buzina
- `DeliveryCard` - Card de entrega
- `NotificationItem` - Item de notificação
- `CustomInput` - Input estilizado
- `LoadingSpinner` - Loading indicator

## 5. Fluxo de Usuário

### Fluxo Entregador:
1. Login → Lista de Entregas → Seleciona Entrega → Tela Buzina → Clica Buzina → Notificação enviada

### Fluxo Cliente:
1. Login → Home → Recebe Notificação → Toca som/vibração → Histórico disponível

## 6. Sons de Buzina

- `classic_horn` - Buzina clássica
- `car_horn` - Buzina de carro
- `bike_bell` - Campainha de bike
- `electronic` - Buzina eletrônica
- `melody` - Melodia customizada

## 7. Requisitos Não-Funcionais

- Latência < 500ms para notificação
- Funcionamento offline parcial
- Feedback visual + haptic + áudio
- Interface acessível (cores, tamanhos)
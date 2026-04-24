# Buzena - Aplicativo de Buzina Virtual

📱 **Buzena** é um aplicativo mobile que funciona como uma "buzina virtual" para entregadores avisarem clientes que o pedido chegou à porta.

## 🚀 Funcionalidades Principais

- 🔔 **Buzina Digital**: Toque uma buzina alta e personalizada paraavisar clientes
- 📲 **Notificações em Tempo Real**: O cliente recebe notificação instantânea
- 🎵 **Múltiplos Sons**: Escolha entre diferentes sons de buzina
- 📦 **Gestão de Entregas**: Lista de entregas com informações do cliente
- 📋 **Histórico**: Visualize o histórico de notificações
- 📳 **Vibração**: Feedback háptico forte no cliente

## 🛠️ Tecnologias

- **Frontend**: React Native com Expo SDK 52
- **Backend**: Firebase (Auth, Firestore, Realtime Database)
- **Notificações**: Expo Notifications + Firebase Cloud Messaging
- **Navegação**: React Navigation v6
- **Estado**: Context API + AsyncStorage

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase
- Expo CLI (`npm install -g expo`)

## 🔧 Configuração

### 1. Clone o repositório
```bash
cd app-buzena
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** (Email/Password)
4. Ative **Cloud Firestore**
5. Ative **Realtime Database**
6. Copie as credenciais e configure em `src/config/firebase.js`

### 4. Execute o app

```bash
npx expo start
```

## 📱 Estrutura do Projeto

```
app-buzena/
├── App.js                    # App principal
├── app.json                  # Configurações Expo
├── package.json              # Dependências
├── src/
│   ├── config/
│   │   └── firebase.js       # Configuração Firebase
│   ├── constants/
│   │   ├── colors.js         # Cores do app
│   │   └── sounds.js         # Sons de buzina
│   ├── context/
│   │   └── AuthContext.js    # Contexto de autenticação
│   ├── components/
│   │   ├── BuzinaButton.js   # Botão de buzina
│   │   ├── DeliveryCard.js   # Card de entrega
│   │   ├── NotificationItem.js
│   │   ├── CustomInput.js
│   │   ├── LoadingSpinner.js
│   │   └── SoundPicker.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DeliveryListScreen.js
│   │   ├── BuzinaScreen.js
│   │   └── ClientHomeScreen.js
│   └── services/
│       └── notificationService.js
└── assets/
    └── sounds/
        └── buzina.mp3        # Som da buzina
```

## 🔔 Fluxo de Uso

### Para Entregadores:
1. Faça login/cadastro como "Entregador"
2. See a lista de entregas pendentes
3. Selecione um cliente/pedido
4. Toque no botão "BUZINAR"
5. O cliente recebe a notificação

### Para Clientes:
1. Faça login/cadastro como "Cliente"
2. Aguarde a notificação quando o entregador buzinar
3. Receba som + vibração
4. Veja o histórico de entregas

## 🎨 Design

- Interface minimalista e escura
- Botão principal grande (estilo buzina)
- Cores: Amarelo (#FFD700) e Vermelho (#FF4444)
- Fundo escuro (#1A1A1A)

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!"# buzena" 

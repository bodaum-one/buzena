// filepath: src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type UserRole = 'delivery' | 'client';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { signUp, loading } = useAuth();
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('delivery');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;
    
    const result = await signUp(email, password, name, role);
    
    if (result.success) {
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => {} }
      ]);
    } else {
      Alert.alert('Erro', result.error || 'Falha ao criar conta');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Criando conta..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Escolha seu tipo de usuário</Text>
        </View>

        {/* Seleção de Tipo de Usuário */}
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'delivery' && styles.roleCardSelected]}
            onPress={() => setRole('delivery')}
          >
            <Text style={styles.roleIcon}>🚚</Text>
            <Text style={[styles.roleTitle, role === 'delivery' && styles.roleTitleSelected]}>
              Entregador
            </Text>
            <Text style={styles.roleDescription}>
              Faça entregas e buzine para os clientes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, role === 'client' && styles.roleCardSelected]}
            onPress={() => setRole('client')}
          >
            <Text style={styles.roleIcon}>👤</Text>
            <Text style={[styles.roleTitle, role === 'client' && styles.roleTitleSelected]}>
              Cliente
            </Text>
            <Text style={styles.roleDescription}>
              Receba notificações quando chegar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            autoCapitalize="words"
            error={errors.name}
            icon="👤"
          />
          
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon="📧"
          />
          
          <CustomInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
            icon="🔒"
          />
          
          <CustomInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.confirmPassword}
            icon="🔒"
          />

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Criando...' : 'CRIAR CONTA'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}> Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  roleIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleTitleSelected: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
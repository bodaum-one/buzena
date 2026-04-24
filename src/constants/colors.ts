// filepath: src/constants/colors.ts
export const colors = {
  // Cores principais
  primary: '#FFD700',        // Amarelo vibrante
  primaryDark: '#E6C200',    // Amarelo escuro
  secondary: '#FF4444',       // Vermelho alerta
  secondaryDark: '#CC0000',   // Vermelho escuro
  
  // Cores neutras
  background: '#1A1A1A',      // Fundo escuro
  surface: '#2D2D2D',         // Superfície
  surfaceLight: '#3D3D3D',    // Superfície clara
  
  // Cores de texto
  textPrimary: '#FFFFFF',     // Texto principal
  textSecondary: '#B0B0B0',  // Texto secundário
  textMuted: '#707070',      // Texto muted
  
  // Cores de estado
  success: '#4CAF50',        // Verde sucesso
  warning: '#FF9800',        // Laranja aviso
  error: '#F44336',          // Vermelho erro
  info: '#2196F3',           // Azul info
  
  // Cores adicionais
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type Colors = typeof colors;
export default colors;
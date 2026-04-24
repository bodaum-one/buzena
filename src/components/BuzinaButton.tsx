// filepath: src/components/BuzinaButton.tsx
import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../constants/colors';

interface BuzinaButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  size?: 'large' | 'medium' | 'small';
}

const BuzinaButton: React.FC<BuzinaButtonProps> = ({ 
  onPress, 
  disabled = false, 
  size = 'large' 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async (): Promise<void> => {
    if (disabled) return;
    
    // Feedback háptico
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (onPress) {
      onPress();
    }
  };

  const getButtonSize = (): number => {
    switch (size) {
      case 'large': return 200;
      case 'medium': return 150;
      case 'small': return 100;
      default: return 200;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'large': return 28;
      case 'medium': return 22;
      case 'small': return 16;
      default: return 28;
    }
  };

  const buttonSize = getButtonSize();
  const fontSize = getFontSize();

  const buttonStyle: StyleProp<ViewStyle> = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          disabled && styles.disabled
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.innerCircle}>
          <Text style={[styles.hornIcon, { fontSize }]}>📢</Text>
          <Text style={[styles.buttonText, { fontSize }]}>BUZINAR</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: colors.white,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hornIcon: {
    marginBottom: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: colors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  disabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  }
});

export default BuzinaButton;
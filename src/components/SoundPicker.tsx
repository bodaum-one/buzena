// filepath: src/components/SoundPicker.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../constants/colors';
import buzinaSounds, { BuzinaSound } from '../constants/sounds';

interface SoundPickerProps {
  selectedSound: string;
  onSelectSound: (soundId: string) => void;
}

const SoundPicker: React.FC<SoundPickerProps> = ({ 
  selectedSound, 
  onSelectSound 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o Som</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {buzinaSounds.map((sound: BuzinaSound) => (
          <TouchableOpacity
            key={sound.id}
            style={[
              styles.soundCard,
              selectedSound === sound.id && styles.selectedSound
            ]}
            onPress={() => onSelectSound(sound.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.soundIcon}>{sound.icon}</Text>
            <Text style={[
              styles.soundName,
              selectedSound === sound.id && styles.selectedText
            ]}>
              {sound.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingRight: 16,
  },
  soundCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSound: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  soundIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  soundName: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SoundPicker;
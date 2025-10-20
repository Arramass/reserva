import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

export default function Card({ children, onPress, style, elevated = true }) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

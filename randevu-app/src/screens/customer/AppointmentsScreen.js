import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import Card from '../../components/Card';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Randevularım</Text>
        <Card style={styles.placeholderCard}>
          <Ionicons name="calendar-outline" size={48} color={colors.primary} />
          <Text style={styles.placeholderTitle}>Randevular</Text>
          <Text style={styles.placeholderText}>Adım 3'te eklenecek</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  placeholderCard: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  placeholderTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

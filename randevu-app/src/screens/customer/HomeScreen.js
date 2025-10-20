import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import Card from '../../components/Card';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ana Sayfa</Text>
        <Text style={styles.subtitle}>Müşteri Görünümü</Text>

        <Card style={styles.placeholderCard}>
          <Ionicons name="construct-outline" size={48} color={colors.primary} />
          <Text style={styles.placeholderTitle}>Yakında Gelecek</Text>
          <Text style={styles.placeholderText}>
            Bu ekran Adım 3'te geliştirilecek
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
    marginBottom: spacing.sm,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

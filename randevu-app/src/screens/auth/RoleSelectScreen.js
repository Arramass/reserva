import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

export default function RoleSelectScreen({ navigation }) {
  const handleRoleSelect = (role) => {
    navigation.navigate('Register', { role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Nasıl kullanacaksınız?</Text>
        <Text style={styles.subtitle}>
          Size en uygun seçeneği belirleyin
        </Text>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          <RoleCard
            icon="person"
            title="Müşteri"
            description="Randevu almak ve yönetmek için"
            features={[
              'Randevu oluştur',
              'Favori işletmeler',
              'Geçmiş randevular',
            ]}
            onPress={() => handleRoleSelect('customer')}
            color={colors.primary}
          />

          <RoleCard
            icon="business"
            title="İşletme Sahibi"
            description="Randevuları yönetmek için"
            features={[
              'Randevu yönetimi',
              'Müsait saatler',
              'İstatistikler',
            ]}
            onPress={() => handleRoleSelect('business')}
            color={colors.secondary}
          />
        </View>

        <Text style={styles.footerText}>
          Zaten hesabınız var mı?{' '}
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('Login')}
          >
            Giriş yapın
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function RoleCard({ icon, title, description, features, onPress, color }) {
  return (
    <TouchableOpacity
      style={[styles.roleCard, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>

      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  rolesContainer: {
    flex: 1,
    gap: spacing.md,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  roleTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roleDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresContainer: {
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.caption,
    color: colors.text,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

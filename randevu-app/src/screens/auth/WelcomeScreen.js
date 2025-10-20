import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            {/* İkonlar için placeholder - İleride logo eklenebilir */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoEmoji}>📅</Text>
            </View>
          </View>

          <Text style={styles.title}>Randevunu Kolayca Yönet</Text>
          <Text style={styles.subtitle}>
            İşletmeler ve müşteriler için hızlı, modern randevu yönetim sistemi
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            emoji="⚡"
            text="Hızlı randevu oluşturma"
          />
          <FeatureItem
            emoji="🔔"
            text="Otomatik hatırlatmalar"
          />
          <FeatureItem
            emoji="📊"
            text="Detaylı istatistikler"
          />
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Başlayalım"
            onPress={() => navigation.navigate('RoleSelect')}
            size="large"
          />

          <Button
            title="Zaten hesabım var"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            size="large"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ emoji, text }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
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
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  featuresContainer: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  buttonContainer: {
    gap: spacing.md,
  },
});

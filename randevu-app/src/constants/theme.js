import { DefaultTheme } from 'react-native-paper';

export const colors = {
  // Ana renkler
  primary: '#6366F1',      // İndigo - Modern ve profesyonel
  secondary: '#EC4899',    // Pink - Vurgular için
  accent: '#10B981',       // Yeşil - Başarı mesajları

  // Nötr renkler
  background: '#F8FAFC',   // Açık gri arka plan
  surface: '#FFFFFF',      // Kartlar için beyaz
  text: '#1E293B',         // Koyu gri - Ana metin
  textSecondary: '#64748B', // Orta gri - İkincil metin

  // Durum renkleri
  success: '#10B981',      // Yeşil
  warning: '#F59E0B',      // Turuncu
  error: '#EF4444',        // Kırmızı
  info: '#3B82F6',         // Mavi

  // Sınırlar
  border: '#E2E8F0',
  divider: '#F1F5F9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

// React Native Paper tema konfigürasyonu
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
  },
  roundness: borderRadius.md,
};

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'M'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="person-outline"
            title="Kişisel Bilgiler"
            onPress={() => {}}
          />
          <MenuItem
            icon="notifications-outline"
            title="Bildirimler"
            onPress={() => {}}
          />
          <MenuItem
            icon="settings-outline"
            title="Ayarlar"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            title="Yardım"
            onPress={() => {}}
          />
          <MenuItem
            icon="log-out-outline"
            title="Çıkış Yap"
            onPress={handleLogout}
            destructive
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, onPress, destructive }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={24}
        color={destructive ? colors.error : colors.text}
      />
      <Text style={[styles.menuItemText, destructive && styles.menuItemTextDestructive]}>
        {title}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
      />
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
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  userCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: 'white',
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.md,
  },
  menuItemTextDestructive: {
    color: colors.error,
  },
});

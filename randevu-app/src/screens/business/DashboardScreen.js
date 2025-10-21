import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import Card from '../../components/Card';
import appointmentService from '../../services/appointmentService';
import businessService from '../../services/businessService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalAppointments: 0,
    completedAppointments: 0,
  });
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // İşletme bilgilerini getir
      const businessData = await businessService.getMyBusiness();
      setBusiness(businessData.business);

      // Randevu istatistiklerini getir
      const appointmentsData = await appointmentService.getBusinessAppointments();
      const appointments = appointmentsData.appointments || [];

      // İstatistikleri hesapla
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length;

      const pendingCount = appointments.filter((apt) => apt.status === 'pending').length;
      const completedCount = appointments.filter((apt) => apt.status === 'completed').length;

      setStats({
        todayAppointments: todayCount,
        pendingAppointments: pendingCount,
        totalAppointments: appointments.length,
        completedAppointments: completedCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Hata', error.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        <Text style={styles.title}>İşletme Paneli</Text>
        {business && <Text style={styles.subtitle}>{business.businessName}</Text>}

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="calendar"
            color={colors.primary}
            label="Bugünkü Randevular"
            value={stats.todayAppointments}
          />
          <StatCard
            icon="time"
            color={colors.warning}
            label="Bekleyen Onay"
            value={stats.pendingAppointments}
          />
          <StatCard
            icon="checkmark-circle"
            color={colors.success}
            label="Tamamlanan"
            value={stats.completedAppointments}
          />
          <StatCard
            icon="list"
            color={colors.info}
            label="Toplam Randevu"
            value={stats.totalAppointments}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <Card style={styles.actionCard}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Yeni randevu oluşturmak için müşterilerin sizi bulması gerekiyor.</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, color, label, value }) {
  return (
    <Card style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  actionText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
});

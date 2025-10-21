import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import appointmentService from '../../services/appointmentService';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const statusConfig = {
  pending: {
    label: 'Bekliyor',
    color: colors.warning,
    icon: 'time-outline',
  },
  confirmed: {
    label: 'Onaylandı',
    color: colors.success,
    icon: 'checkmark-circle-outline',
  },
  cancelled: {
    label: 'İptal Edildi',
    color: colors.error,
    icon: 'close-circle-outline',
  },
  completed: {
    label: 'Tamamlandı',
    color: colors.info,
    icon: 'checkmark-done-outline',
  },
};

export default function AppointmentManageScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [filter])
  );

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filter === 'pending') {
        params.status = 'pending';
      } else if (filter === 'confirmed') {
        params.status = 'confirmed';
      } else if (filter === 'completed') {
        params.status = 'completed';
      }

      const response = await appointmentService.getBusinessAppointments(params);
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Hata', error.message || 'Randevular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleConfirmAppointment = (appointmentId) => {
    Alert.alert(
      'Randevuyu Onayla',
      'Bu randevuyu onaylamak istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            try {
              await appointmentService.confirmAppointment(appointmentId);
              Alert.alert('Başarılı', 'Randevu onaylandı');
              fetchAppointments();
            } catch (error) {
              Alert.alert('Hata', error.message || 'Randevu onaylanırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: async () => {
            try {
              await appointmentService.cancelAppointment(appointmentId, 'İşletme tarafından iptal edildi');
              Alert.alert('Başarılı', 'Randevu iptal edildi');
              fetchAppointments();
            } catch (error) {
              Alert.alert('Hata', error.message || 'Randevu iptal edilirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const handleCompleteAppointment = (appointmentId) => {
    Alert.alert(
      'Randevuyu Tamamla',
      'Bu randevuyu tamamlandı olarak işaretlemek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Tamamla',
          onPress: async () => {
            try {
              await appointmentService.completeAppointment(appointmentId);
              Alert.alert('Başarılı', 'Randevu tamamlandı');
              fetchAppointments();
            } catch (error) {
              Alert.alert('Hata', error.message || 'Randevu güncellenirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const renderAppointmentCard = ({ item }) => {
    const status = statusConfig[item.status] || statusConfig.pending;
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <Card style={styles.appointmentCard}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Ionicons name={status.icon} size={16} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        {/* Customer Info */}
        {item.customer && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Müşteri:</Text>
            <Text style={styles.infoValue}>{item.customer.name || item.customer.email}</Text>
          </View>
        )}

        {/* Service Info */}
        {item.service && (
          <View style={styles.infoRow}>
            <Ionicons name="cut-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Hizmet:</Text>
            <Text style={styles.infoValue}>{item.service.name}</Text>
          </View>
        )}

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Tarih:</Text>
          <Text style={styles.infoValue}>{formattedDate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Saat:</Text>
          <Text style={styles.infoValue}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => handleConfirmAppointment(item._id)}
              >
                <Ionicons name="checkmark" size={18} color={colors.surface} />
                <Text style={styles.actionButtonText}>Onayla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelAppointment(item._id)}
              >
                <Ionicons name="close" size={18} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  İptal
                </Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === 'confirmed' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleCompleteAppointment(item._id)}
              >
                <Ionicons name="checkmark-done" size={18} color={colors.surface} />
                <Text style={styles.actionButtonText}>Tamamla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelAppointment(item._id)}
              >
                <Ionicons name="close" size={18} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  İptal
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Notes */}
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Not:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </Card>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Randevu Yönetimi</Text>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              Tümü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterTabText, filter === 'pending' && styles.filterTabTextActive]}>
              Bekleyen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'confirmed' && styles.filterTabActive]}
            onPress={() => setFilter('confirmed')}
          >
            <Text style={[styles.filterTabText, filter === 'confirmed' && styles.filterTabTextActive]}>
              Onaylı
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterTabText, filter === 'completed' && styles.filterTabTextActive]}>
              Tamamlanan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        renderItem={renderAppointmentCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            message="Henüz randevu yok."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: colors.surface,
  },
  listContent: {
    padding: spacing.lg,
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
    minWidth: 60,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  completeButton: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  notesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
});

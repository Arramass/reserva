import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';
import appointmentService from '../../../services/appointmentService';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import LoadingSpinner from '../../../components/LoadingSpinner';

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

export default function AppointmentDetailScreen({ navigation, route }) {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [appointmentId]);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(response.appointment);
    } catch (error) {
      console.error('Error fetching appointment detail:', error);
      Alert.alert('Hata', error.message || 'Randevu bilgileri yüklenirken bir hata oluştu');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: confirmCancellation,
        },
      ]
    );
  };

  const confirmCancellation = async () => {
    try {
      setCancelLoading(true);
      await appointmentService.cancelAppointment(appointmentId, 'Müşteri tarafından iptal edildi');

      Alert.alert(
        'Başarılı',
        'Randevunuz iptal edildi',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Alert.alert('Hata', error.message || 'Randevu iptal edilirken bir hata oluştu');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return null;
  }

  const status = statusConfig[appointment.status] || statusConfig.pending;
  const date = new Date(appointment.date);
  const formattedDate = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Detayı</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status */}
        <Card style={styles.section}>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Ionicons name={status.icon} size={24} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </Card>

        {/* Business Info */}
        {appointment.business && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>İşletme Bilgileri</Text>
            <Text style={styles.businessName}>{appointment.business.businessName}</Text>
            {appointment.business.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {appointment.business.address.street && `${appointment.business.address.street}, `}
                  {appointment.business.address.city}
                </Text>
              </View>
            )}
            {appointment.business.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{appointment.business.phone}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Appointment Details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Randevu Bilgileri</Text>

          {appointment.service && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hizmet:</Text>
              <Text style={styles.detailValue}>{appointment.service.name}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tarih:</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Saat:</Text>
            <Text style={styles.detailValue}>
              {appointment.startTime} - {appointment.endTime}
            </Text>
          </View>

          {appointment.service && appointment.service.duration && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Süre:</Text>
              <Text style={styles.detailValue}>{appointment.service.duration} dakika</Text>
            </View>
          )}

          {appointment.service && appointment.service.price && (
            <View style={[styles.detailRow, styles.priceRow]}>
              <Text style={styles.detailLabel}>Ücret:</Text>
              <Text style={styles.priceValue}>₺{appointment.service.price}</Text>
            </View>
          )}

          {appointment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.detailLabel}>Notlar:</Text>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}
        </Card>

        {/* Cancellation Info */}
        {appointment.status === 'cancelled' && (
          <Card style={[styles.section, styles.cancelCard]}>
            <Text style={styles.cancelTitle}>İptal Bilgileri</Text>
            {appointment.cancelledBy && (
              <Text style={styles.cancelText}>
                İptal eden: {appointment.cancelledBy === 'customer' ? 'Müşteri' : 'İşletme'}
              </Text>
            )}
            {appointment.cancellationReason && (
              <Text style={styles.cancelText}>Sebep: {appointment.cancellationReason}</Text>
            )}
          </Card>
        )}
      </ScrollView>

      {/* Cancel Button */}
      {canCancel && (
        <View style={styles.footer}>
          <Button
            title="Randevuyu İptal Et"
            onPress={handleCancelAppointment}
            loading={cancelLoading}
            variant="outline"
            style={styles.cancelButton}
            textStyle={{ color: colors.error }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  statusText: {
    ...typography.h2,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  businessName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  priceRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    borderBottomWidth: 0,
  },
  priceValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 24,
  },
  cancelCard: {
    backgroundColor: colors.error + '10',
  },
  cancelTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    borderColor: colors.error,
  },
});

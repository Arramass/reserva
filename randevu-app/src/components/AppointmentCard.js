import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

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
  'no-show': {
    label: 'Gelmedi',
    color: colors.textSecondary,
    icon: 'alert-circle-outline',
  },
};

export default function AppointmentCard({ appointment, onPress, showBusiness = true }) {
  const status = statusConfig[appointment.status] || statusConfig.pending;
  const date = new Date(appointment.date);
  const formattedDate = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
        <Ionicons name={status.icon} size={16} color={status.color} />
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.label}
        </Text>
      </View>

      {/* Business Name */}
      {showBusiness && appointment.business && (
        <Text style={styles.businessName} numberOfLines={1}>
          {appointment.business.businessName}
        </Text>
      )}

      {/* Customer Name (for business view) */}
      {!showBusiness && appointment.customer && (
        <Text style={styles.businessName} numberOfLines={1}>
          {appointment.customer.name}
        </Text>
      )}

      {/* Service */}
      {appointment.service && (
        <View style={styles.serviceRow}>
          <Ionicons name="cut-outline" size={16} color={colors.primary} />
          <Text style={styles.serviceText}>{appointment.service.name}</Text>
          <Text style={styles.priceText}>₺{appointment.service.price}</Text>
        </View>
      )}

      {/* Date & Time */}
      <View style={styles.infoRow}>
        <View style={styles.info}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
      </View>

      {/* Duration */}
      {appointment.service && appointment.service.duration && (
        <View style={styles.durationRow}>
          <Ionicons name="hourglass-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.durationText}>{appointment.service.duration} dakika</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  businessName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  serviceText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  priceText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  durationText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});

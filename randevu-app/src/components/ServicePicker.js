import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function ServicePicker({ services, selectedService, onSelect }) {
  if (!services || services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz hizmet eklenmemiş.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {services.map((service, index) => {
        const isSelected = selectedService?._id === service._id;

        return (
          <TouchableOpacity
            key={service._id || index}
            style={[
              styles.serviceCard,
              isSelected && styles.serviceCardSelected,
            ]}
            onPress={() => onSelect(service)}
            activeOpacity={0.7}
          >
            <View style={styles.serviceHeader}>
              <View style={styles.serviceInfo}>
                <Text
                  style={[
                    styles.serviceName,
                    isSelected && styles.serviceNameSelected,
                  ]}
                >
                  {service.name}
                </Text>
                {service.description && (
                  <Text
                    style={[
                      styles.serviceDescription,
                      isSelected && styles.serviceDescriptionSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {service.description}
                  </Text>
                )}
              </View>

              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </View>

            <View style={styles.serviceFooter}>
              <View style={styles.serviceDetail}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.serviceDetailText,
                    isSelected && styles.serviceDetailTextSelected,
                  ]}
                >
                  {service.duration} dakika
                </Text>
              </View>

              <Text
                style={[
                  styles.servicePrice,
                  isSelected && styles.servicePriceSelected,
                ]}
              >
                ₺{service.price}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  serviceName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  serviceNameSelected: {
    color: colors.primary,
  },
  serviceDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  serviceDescriptionSelected: {
    color: colors.text,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceDetailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  serviceDetailTextSelected: {
    color: colors.primary,
  },
  servicePrice: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  servicePriceSelected: {
    color: colors.primary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

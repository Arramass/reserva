import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function TimeSlotPicker({ slots, selectedSlot, onSelect, loading = false }) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Müsait saatler yükleniyor...</Text>
      </View>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bu gün için müsait saat bulunmamaktadır.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {slots.map((slot, index) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.slotButton,
              isSelected && styles.slotButtonSelected,
            ]}
            onPress={() => onSelect(slot)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.slotText,
                isSelected && styles.slotTextSelected,
              ]}
            >
              {slot.startTime}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  slotButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  slotButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  slotTextSelected: {
    color: colors.surface,
  },
  loadingContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: spacing.md,
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

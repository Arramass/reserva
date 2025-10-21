import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function BusinessCard({ business, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image */}
      {business.images && business.images.length > 0 ? (
        <Image
          source={{ uri: business.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="business" size={40} color={colors.textSecondary} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.businessName} numberOfLines={1}>
          {business.businessName}
        </Text>

        {business.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{business.category}</Text>
          </View>
        )}

        {business.address && business.address.city && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>{business.address.city}</Text>
          </View>
        )}

        {/* Rating */}
        {business.rating && business.rating.count > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>
              {business.rating.average.toFixed(1)}
            </Text>
            <Text style={styles.ratingCount}>
              ({business.rating.count})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.md,
  },
  businessName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  ratingCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

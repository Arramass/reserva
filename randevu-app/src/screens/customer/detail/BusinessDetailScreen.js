import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';
import businessService from '../../../services/businessService';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Card from '../../../components/Card';

export default function BusinessDetailScreen({ navigation, route }) {
  const { businessId } = route.params;
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessDetail();
  }, [businessId]);

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);
      const response = await businessService.getBusinessById(businessId);
      setBusiness(response.business);
    } catch (error) {
      console.error('Error fetching business detail:', error);
      Alert.alert('Hata', error.message || 'İşletme bilgileri yüklenirken bir hata oluştu');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigation.navigate('AppointmentBooking', { business });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!business) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Image */}
        {business.images && business.images.length > 0 ? (
          <Image
            source={{ uri: business.images[0] }}
            style={styles.headerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.headerImage, styles.placeholderImage]}>
            <Ionicons name="business" size={60} color={colors.textSecondary} />
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Business Info */}
          <View style={styles.header}>
            <Text style={styles.businessName}>{business.businessName}</Text>

            {business.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{business.category}</Text>
              </View>
            )}

            {/* Rating */}
            {business.rating && business.rating.count > 0 && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={20} color={colors.warning} />
                <Text style={styles.ratingText}>
                  {business.rating.average.toFixed(1)}
                </Text>
                <Text style={styles.ratingCount}>
                  ({business.rating.count} değerlendirme)
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {business.description && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Hakkında</Text>
              <Text style={styles.description}>{business.description}</Text>
            </Card>
          )}

          {/* Contact Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

            {business.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  {business.address.street && `${business.address.street}, `}
                  {business.address.city}
                  {business.address.state && `, ${business.address.state}`}
                </Text>
              </View>
            )}

            {business.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>{business.phone}</Text>
              </View>
            )}

            {business.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>{business.email}</Text>
              </View>
            )}
          </Card>

          {/* Services */}
          {business.services && business.services.length > 0 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Hizmetler</Text>
              {business.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>₺{service.price}</Text>
                  </View>
                  {service.description && (
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  )}
                  <Text style={styles.serviceDuration}>
                    <Ionicons name="time-outline" size={14} />
                    {' '}{service.duration} dakika
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Working Hours */}
          {business.workingHours && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
              {Object.entries(business.workingHours).map(([day, hours]) => (
                <View key={day} style={styles.workingHourRow}>
                  <Text style={styles.dayName}>
                    {getDayName(day)}
                  </Text>
                  <Text style={styles.hours}>
                    {hours.isClosed ? 'Kapalı' : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <Button
          title="Randevu Al"
          onPress={handleBookAppointment}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}

function getDayName(day) {
  const days = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar',
  };
  return days[day] || day;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  businessName: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  ratingCount: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  serviceItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  serviceName: {
    ...typography.h3,
    color: colors.text,
  },
  servicePrice: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  serviceDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  serviceDuration: {
    ...typography.small,
    color: colors.textSecondary,
  },
  workingHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  dayName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  hours: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

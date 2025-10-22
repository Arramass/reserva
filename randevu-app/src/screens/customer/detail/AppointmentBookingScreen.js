import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';
import appointmentService from '../../../services/appointmentService';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import ServicePicker from '../../../components/ServicePicker';
import TimeSlotPicker from '../../../components/TimeSlotPicker';

export default function AppointmentBookingScreen({ navigation, route }) {
  const { business } = route.params;
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      setSelectedSlot(null);

      const dateStr = selectedDate.toISOString().split('T')[0];
      const duration = selectedService.duration || 60;

      const response = await appointmentService.getAvailableSlots(
        business._id,
        dateStr,
        duration
      );

      setAvailableSlots(response.availableSlots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedSlot(null);
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      Alert.alert('Eksik Bilgi', 'Lütfen hizmet, tarih ve saat seçin');
      return;
    }

    try {
      setLoading(true);

      const appointmentData = {
        businessId: business._id,
        service: {
          name: selectedService.name,
          duration: selectedService.duration,
          price: selectedService.price,
        },
        date: selectedDate.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      };

      await appointmentService.createAppointment(appointmentData);

      Alert.alert(
        'Başarılı',
        'Randevunuz başarıyla oluşturuldu!',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Appointments'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Hata', error.message || 'Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = selectedDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Oluştur</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Business Info */}
        <Card style={styles.section}>
          <Text style={styles.businessName}>{business.businessName}</Text>
          {business.address && business.address.city && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{business.address.city}</Text>
            </View>
          )}
        </Card>

        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmet Seçin</Text>
          <ServicePicker
            services={business.services || []}
            selectedService={selectedService}
            onSelect={handleServiceSelect}
          />
        </View>

        {/* Date Selection */}
        {selectedService && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarih Seçin</Text>
            <Card>
              <View style={styles.dateSelector}>
                <TouchableOpacity
                  onPress={() => handleDateChange(-1)}
                  disabled={isToday(selectedDate)}
                  style={styles.dateButton}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={isToday(selectedDate) ? colors.border : colors.primary}
                  />
                </TouchableOpacity>

                <View style={styles.dateDisplay}>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDateChange(1)}
                  style={styles.dateButton}
                >
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Time Slot Selection */}
        {selectedService && selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saat Seçin</Text>
            <Card>
              <TimeSlotPicker
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                loading={loadingSlots}
              />
            </Card>
          </View>
        )}

        {/* Summary */}
        {selectedService && selectedSlot && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Özet</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hizmet:</Text>
              <Text style={styles.summaryValue}>{selectedService.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tarih:</Text>
              <Text style={styles.summaryValue}>{formattedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Saat:</Text>
              <Text style={styles.summaryValue}>{selectedSlot.startTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Süre:</Text>
              <Text style={styles.summaryValue}>{selectedService.duration} dakika</Text>
            </View>
            <View style={[styles.summaryRow, styles.priceRow]}>
              <Text style={styles.summaryLabel}>Ücret:</Text>
              <Text style={styles.priceValue}>₺{selectedService.price}</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Randevu Oluştur"
          onPress={handleBookAppointment}
          loading={loading}
          disabled={!selectedService || !selectedSlot}
          size="large"
        />
      </View>
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  businessName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dateButton: {
    padding: spacing.sm,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    ...typography.h3,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  priceRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  priceValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

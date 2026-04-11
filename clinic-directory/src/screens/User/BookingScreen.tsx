import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM',
  '01:30 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
];

const UNAVAILABLE_SLOTS = ['10:00 AM', '11:30 AM', '04:00 PM'];

function getDatesForWeek(): { date: Date; label: string }[] {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({ date: d, label: d.toISOString().split('T')[0] });
  }
  return dates;
}

export default function BookingScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [selectedDate, setSelectedDate] = useState(getDatesForWeek()[0].label);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentType, setAppointmentType] = useState<'in_person' | 'teleconsult'>('in_person');
  const [patientName, setPatientName] = useState(user?.nameAr || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const doctor = MOCK_DOCTORS.find(d => d.id === route.params?.doctorId) || MOCK_DOCTORS[0];
  const doctorName = language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`;
  const dates = getDatesForWeek();

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const names = language === 'ar'
      ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return names[d.getDay()];
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      Alert.alert(isRTL ? 'تنبيه' : 'Warning', t('booking.selectSlot'));
      return;
    }
    if (!patientName || !patientPhone) {
      Alert.alert(isRTL ? 'تنبيه' : 'Warning', isRTL ? 'الرجاء إدخال بياناتك' : 'Please enter your info');
      return;
    }
    setLoading(true);
    // Simulate booking
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setBooked(true);
  };

  if (booked) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.successGrad}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color={Colors.textWhite} />
          </View>
          <Text style={styles.successTitle}>{t('booking.bookingSuccess')}</Text>
          <Text style={styles.successDesc}>{t('booking.bookingSuccessDesc')}</Text>
          <View style={styles.successDetails}>
            <View style={styles.successRow}>
              <Ionicons name="person-outline" size={16} color={Colors.secondary} />
              <Text style={styles.successRowText}>{doctorName}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.secondary} />
              <Text style={styles.successRowText}>{selectedDate} • {selectedSlot}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="cash-outline" size={16} color={Colors.secondary} />
              <Text style={styles.successRowText}>{doctor.consultationFee} {isRTL ? 'ج.م' : 'EGP'}</Text>
            </View>
          </View>
          <Button
            title={isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            onPress={() => navigation.navigate('Home')}
            variant="gold"
            size="lg"
            style={{ marginTop: 24 }}
          />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('booking.title')}</Text>
        <Text style={styles.headerSubtitle}>{doctorName}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Date Selector */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('booking.selectDate')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
          {dates.map(({ label }) => (
            <TouchableOpacity
              key={label}
              style={[styles.dateChip, selectedDate === label && styles.dateChipActive]}
              onPress={() => setSelectedDate(label)}
            >
              <Text style={[styles.dateDayName, selectedDate === label && styles.dateTextActive]}>
                {getDayName(label)}
              </Text>
              <Text style={[styles.dateNum, selectedDate === label && styles.dateTextActive]}>
                {new Date(label).getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Appointment Type */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('booking.appointmentType')}</Text>
        <View style={styles.typeRow}>
          {(['in_person', 'teleconsult'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeCard, appointmentType === type && styles.typeCardActive]}
              onPress={() => setAppointmentType(type)}
            >
              <Ionicons
                name={type === 'in_person' ? 'business-outline' : 'videocam-outline'}
                size={24}
                color={appointmentType === type ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.typeLabel, appointmentType === type && styles.typeLabelActive]}>
                {t(`booking.${type}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Slots */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('booking.availableSlots')}</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map(slot => {
            const unavailable = UNAVAILABLE_SLOTS.includes(slot);
            const selected = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotChip,
                  selected && styles.slotChipSelected,
                  unavailable && styles.slotChipUnavailable,
                ]}
                onPress={() => !unavailable && setSelectedSlot(slot)}
                disabled={unavailable}
              >
                <Text style={[
                  styles.slotText,
                  selected && styles.slotTextSelected,
                  unavailable && styles.slotTextUnavailable,
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Patient Info */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('booking.yourInfo')}</Text>
        <Input
          label={t('booking.patientName')}
          value={patientName}
          onChangeText={setPatientName}
          required
          leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />}
        />
        <Input
          label={t('booking.patientPhone')}
          value={patientPhone}
          onChangeText={setPatientPhone}
          keyboardType="phone-pad"
          required
          leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textMuted} />}
        />

        {/* Notes */}
        <Text style={[styles.sectionLabel, isRTL && styles.rtlText]}>{t('booking.notes')}</Text>
        <TextInput
          style={[styles.notesInput, isRTL && { textAlign: 'right' }]}
          placeholder={t('booking.notesPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Fee Summary */}
        <View style={styles.feeSummary}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>{t('booking.fee')}</Text>
            <Text style={styles.feeValue}>{doctor.consultationFee} {isRTL ? 'ج.م' : 'EGP'}</Text>
          </View>
          <View style={[styles.feeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('booking.totalFee')}</Text>
            <Text style={styles.totalValue}>{doctor.consultationFee} {isRTL ? 'ج.م' : 'EGP'}</Text>
          </View>
        </View>

        <Button
          title={t('booking.confirmBooking')}
          onPress={handleBook}
          loading={loading}
          fullWidth
          size="lg"
          style={{ marginBottom: 32 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  backBtn: { marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textWhite },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 8 },
  rtlText: { textAlign: 'right' },

  // Date
  datesScroll: { marginBottom: 20 },
  dateChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.backgroundWhite,
    minWidth: 60,
  },
  dateChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  dateDayName: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  dateNum: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  dateTextActive: { color: Colors.textWhite },

  // Type
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundWhite,
  },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  typeLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 6, fontWeight: '500' },
  typeLabelActive: { color: Colors.primary, fontWeight: '700' },

  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  slotChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundWhite,
  },
  slotChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  slotChipUnavailable: { backgroundColor: Colors.borderLight, borderColor: Colors.borderLight },
  slotText: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' },
  slotTextSelected: { color: Colors.textWhite, fontWeight: '700' },
  slotTextUnavailable: { color: Colors.textMuted },

  // Notes
  notesInput: {
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  // Fee
  feeSummary: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  feeLabel: { fontSize: 14, color: Colors.textSecondary },
  feeValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },

  // Success
  successContainer: { flex: 1 },
  successGrad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: Colors.textWhite, marginBottom: 8 },
  successDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24 },
  successDetails: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.xl,
    padding: 20,
    width: '100%',
  },
  successRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  successRowText: { fontSize: 14, color: Colors.textWhite, marginLeft: 10 },
});

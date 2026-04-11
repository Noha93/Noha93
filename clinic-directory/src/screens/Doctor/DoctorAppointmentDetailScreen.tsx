import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, TextInput, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

type RouteParams = { appointmentId: string };

const STATUS_OPTIONS = [
  { key: 'confirmed', ar: 'مؤكد', en: 'Confirmed', variant: 'success' as const },
  { key: 'completed', ar: 'مكتمل', en: 'Completed', variant: 'primary' as const },
  { key: 'cancelled', ar: 'ملغى', en: 'Cancelled', variant: 'error' as const },
];

export default function DoctorAppointmentDetailScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { appointmentId } = route.params || { appointmentId: 'apt001' };

  const appointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId) || MOCK_APPOINTMENTS[0];
  const [status, setStatus] = useState(appointment.status);
  const [notes, setNotes] = useState(appointment.notes || '');
  const [saving, setSaving] = useState(false);

  const currentStatus = STATUS_OPTIONS.find(s => s.key === status) || STATUS_OPTIONS[0];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    Alert.alert(isRTL ? 'تم الحفظ' : 'Saved', isRTL ? 'تم تحديث بيانات الموعد' : 'Appointment updated successfully');
    navigation.goBack();
  };

  const handleCall = () => {
    Linking.openURL(`tel:${appointment.patientPhone}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'تفاصيل الموعد' : 'Appointment Details'}</Text>
        <Badge
          label={language === 'ar' ? currentStatus.ar : currentStatus.en}
          variant={currentStatus.variant}
          size="sm"
        />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Appointment ID */}
        <LinearGradient
          colors={[Colors.secondary + '25', Colors.secondary + '10']}
          style={styles.idCard}
        >
          <Text style={styles.idLabel}>{isRTL ? 'رقم الموعد' : 'Appointment ID'}</Text>
          <Text style={styles.idValue}>#{appointment.id.toUpperCase()}</Text>
          <Text style={styles.idDate}>{isRTL ? 'تاريخ الحجز:' : 'Booked on:'} {appointment.createdAt}</Text>
        </LinearGradient>

        {/* Patient Info */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'معلومات المريض' : 'Patient Information'}
          </Text>

          <View style={styles.patientHeader}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientInitial}>
                {appointment.patientName.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.patientName, isRTL && styles.rtlText]}>{appointment.patientName}</Text>
              <Text style={[styles.patientPhone, isRTL && styles.rtlText]}>{appointment.patientPhone}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Ionicons name="call" size={18} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'تفاصيل الموعد' : 'Appointment Details'}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>{isRTL ? 'التاريخ' : 'Date'}</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>{isRTL ? 'الوقت' : 'Time'}</Text>
              <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons
              name={appointment.type === 'teleconsult' ? 'videocam-outline' : 'person-outline'}
              size={18}
              color={Colors.primary}
            />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>{isRTL ? 'النوع' : 'Type'}</Text>
              <Text style={styles.detailValue}>
                {appointment.type === 'teleconsult'
                  ? (isRTL ? 'استشارة عن بُعد' : 'Teleconsultation')
                  : (isRTL ? 'زيارة شخصية' : 'In-Person')}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={18} color={Colors.success} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>{isRTL ? 'الرسوم' : 'Fee'}</Text>
              <Text style={[styles.detailValue, { color: Colors.success }]}>
                {appointment.fee} {appointment.currency}
              </Text>
            </View>
          </View>
        </View>

        {/* Update Status */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'تحديث الحالة' : 'Update Status'}
          </Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.statusChip, status === opt.key && styles.statusChipActive]}
                onPress={() => setStatus(opt.key as any)}
              >
                <Text style={[styles.statusChipText, status === opt.key && styles.statusChipTextActive]}>
                  {language === 'ar' ? opt.ar : opt.en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor Notes */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'ملاحظات الطبيب' : 'Doctor Notes'}
          </Text>
          <TextInput
            style={[styles.notesInput, isRTL && styles.rtlText]}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder={isRTL ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
            placeholderTextColor={Colors.textMuted}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={isRTL ? 'حفظ التغييرات' : 'Save Changes'}
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
          style={{ marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  content: { padding: Spacing.xl },
  rtlText: { textAlign: 'right' },

  idCard: {
    padding: 18,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.secondary + '40',
  },
  idLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  idValue: { fontSize: 22, fontWeight: '800', color: Colors.secondaryDark, marginBottom: 4 },
  idDate: { fontSize: 11, color: Colors.textMuted },

  card: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  patientHeader: { flexDirection: 'row', alignItems: 'center' },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientInitial: { fontSize: 20, fontWeight: '800', color: Colors.textWhite },
  patientName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  patientPhone: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  detailText: { marginLeft: 12, flex: 1 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 30, marginVertical: 2 },

  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  statusChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  statusChipText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  statusChipTextActive: { color: Colors.primary, fontWeight: '700' },

  notesInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    backgroundColor: Colors.background,
  },
});

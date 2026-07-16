import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import { MOCK_DOCTORS } from '../../data/mockData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

type RouteParams = { appointmentId: string };

const STATUS_MAP: Record<string, { ar: string; en: string; variant: any }> = {
  confirmed: { ar: 'مؤكد', en: 'Confirmed', variant: 'success' },
  pending:   { ar: 'قيد الانتظار', en: 'Pending', variant: 'warning' },
  cancelled: { ar: 'ملغى', en: 'Cancelled', variant: 'error' },
  completed: { ar: 'مكتمل', en: 'Completed', variant: 'primary' },
};

export default function UserAppointmentDetailScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { appointmentId } = route.params || { appointmentId: 'apt001' };

  const appointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId) || MOCK_APPOINTMENTS[0];
  const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId);
  const [status, setStatus] = useState(appointment.status);

  const handleCancel = () => {
    Alert.alert(
      isRTL ? 'إلغاء الموعد' : 'Cancel Appointment',
      isRTL ? 'هل أنت متأكد من إلغاء هذا الموعد؟' : 'Are you sure you want to cancel this appointment?',
      [
        { text: isRTL ? 'لا' : 'No', style: 'cancel' },
        {
          text: isRTL ? 'نعم، إلغاء' : 'Yes, Cancel',
          style: 'destructive',
          onPress: () => setStatus('cancelled'),
        },
      ]
    );
  };

  const statusInfo = STATUS_MAP[status] || STATUS_MAP.pending;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'تفاصيل الموعد' : 'Appointment Details'}</Text>
        <Badge
          label={language === 'ar' ? statusInfo.ar : statusInfo.en}
          variant={statusInfo.variant}
          size="sm"
        />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Appointment ID Card */}
        <View style={styles.idCard}>
          <LinearGradient
            colors={[Colors.primary + '20', Colors.primaryLight + '10']}
            style={styles.idCardGrad}
          >
            <Text style={styles.idLabel}>{isRTL ? 'رقم الموعد' : 'Booking ID'}</Text>
            <Text style={styles.idValue}>#{appointment.id.toUpperCase()}</Text>
          </LinearGradient>
        </View>

        {/* Date & Time */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'وقت الموعد' : 'Appointment Time'}
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{isRTL ? 'التاريخ' : 'Date'}</Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{appointment.date}</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="time" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{isRTL ? 'الوقت' : 'Time'}</Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{appointment.timeSlot}</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name={appointment.type === 'teleconsult' ? 'videocam' : 'person'} size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{isRTL ? 'نوع الموعد' : 'Type'}</Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {appointment.type === 'teleconsult'
                  ? (isRTL ? 'استشارة عن بُعد' : 'Teleconsultation')
                  : (isRTL ? 'زيارة شخصية' : 'In-Person Visit')}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor Info */}
        {doctor && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
              {isRTL ? 'معلومات الطبيب' : 'Doctor Information'}
            </Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-circle" size={22} color={Colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                  {language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`}
                </Text>
                <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                  {language === 'ar' ? doctor.specializationAr : doctor.specializationEn}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionIcon}
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor.id })}
              >
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.infoValue, { flex: 1 }, isRTL && styles.rtlText]}>
                {doctor.address.street}، {doctor.address.area}، {doctor.address.city}
              </Text>
            </View>
          </View>
        )}

        {/* Fee */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'تفاصيل الدفع' : 'Payment Details'}
          </Text>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, isRTL && styles.rtlText]}>{isRTL ? 'رسوم الكشف' : 'Consultation Fee'}</Text>
            <Text style={styles.feeValue}>{appointment.fee} {appointment.currency}</Text>
          </View>
          <View style={styles.feeTotalRow}>
            <Text style={[styles.feeTotalLabel, isRTL && styles.rtlText]}>{isRTL ? 'الإجمالي' : 'Total'}</Text>
            <Text style={styles.feeTotalValue}>{appointment.fee} {appointment.currency}</Text>
          </View>
        </View>

        {/* Actions */}
        {status === 'completed' && doctor && (
          <View style={styles.actions}>
            <Button
              title={isRTL ? 'تقييم الطبيب' : 'Rate Doctor'}
              onPress={() => navigation.navigate('Rating', { doctorId: doctor.id, appointmentId: appointment.id })}
              variant="gold"
              fullWidth
              size="lg"
              style={{ marginBottom: 10 }}
            />
            <Button
              title={isRTL ? 'حجز موعد جديد' : 'Rebook'}
              onPress={() => navigation.navigate('Booking', { doctorId: doctor.id })}
              variant="outline"
              fullWidth
              size="md"
            />
          </View>
        )}

        {status !== 'cancelled' && status !== 'completed' && (
          <View style={styles.actions}>
            {doctor && (
              <Button
                title={isRTL ? 'واتساب' : 'WhatsApp'}
                onPress={() => Linking.openURL(`whatsapp://send?phone=${doctor.contact.whatsapp}`)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                leftIcon={<Ionicons name="logo-whatsapp" size={18} color={Colors.success} />}
              />
            )}
            <Button
              title={isRTL ? 'إعادة حجز' : 'Rebook'}
              onPress={() => doctor && navigation.navigate('Booking', { doctorId: doctor.id })}
              variant="secondary"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={isRTL ? 'إلغاء' : 'Cancel'}
              onPress={handleCancel}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
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

  idCard: { marginBottom: 16, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  idCardGrad: {
    padding: 20,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  idLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  idValue: { fontSize: 20, fontWeight: '800', color: Colors.primary },

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
  rtlText: { textAlign: 'right' },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  dividerLine: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4, marginLeft: 50 },
  actionIcon: { padding: 4 },

  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  feeLabel: { fontSize: 14, color: Colors.textSecondary },
  feeValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  feeTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 4,
  },
  feeTotalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  feeTotalValue: { fontSize: 16, fontWeight: '800', color: Colors.primary },

  actions: { flexDirection: 'row', marginTop: 4 },
});

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import Badge from '../../components/common/Badge';

type RouteParams = { patientName?: string; patientPhone?: string };

const VISIT_HISTORY = [
  { id: 'apt001', date: '2024-03-25', time: '10:00 AM', type: 'in_person', status: 'completed', fee: 500 },
  { id: 'apt002', date: '2024-02-10', time: '11:30 AM', type: 'teleconsult', status: 'completed', fee: 500 },
  { id: 'apt003', date: '2024-01-05', time: '09:00 AM', type: 'in_person', status: 'completed', fee: 500 },
];

export default function PatientProfileScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { patientName = 'علي محمد', patientPhone = '010-55556666' } = route.params || {};

  const initials = patientName.charAt(0);
  const totalVisits = VISIT_HISTORY.length;
  const totalSpent = VISIT_HISTORY.reduce((s, v) => s + v.fee, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'ملف المريض' : 'Patient Profile'}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${patientPhone}`)}>
          <Ionicons name="call" size={22} color={Colors.secondary} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Patient Identity */}
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.patientName}>{patientName}</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => Linking.openURL(`tel:${patientPhone}`)}
          >
            <Ionicons name="call-outline" size={15} color={Colors.primary} />
            <Text style={styles.phone}>{patientPhone}</Text>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{totalVisits}</Text>
              <Text style={styles.statLbl}>{isRTL ? 'زيارات' : 'Visits'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{totalSpent}</Text>
              <Text style={styles.statLbl}>{isRTL ? 'جنيه' : 'EGP'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>5.0</Text>
              <Text style={styles.statLbl}>{isRTL ? 'التزام' : 'Loyalty'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${patientPhone}`)}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="call" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.actionLabel}>{isRTL ? 'اتصال' : 'Call'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`whatsapp://send?phone=${patientPhone}`)}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="logo-whatsapp" size={20} color={Colors.success} />
            </View>
            <Text style={styles.actionLabel}>{isRTL ? 'واتساب' : 'WhatsApp'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Booking', { doctorId: 'doctor' })}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Ionicons name="calendar-outline" size={20} color={Colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>{isRTL ? 'حجز' : 'Book'}</Text>
          </TouchableOpacity>
        </View>

        {/* Visit History */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'سجل الزيارات' : 'Visit History'}
        </Text>

        {VISIT_HISTORY.map((v, i) => (
          <View key={v.id} style={styles.visitCard}>
            <View style={[styles.visitIcon, { backgroundColor: v.type === 'teleconsult' ? Colors.info + '20' : Colors.primary + '20' }]}>
              <Ionicons
                name={v.type === 'teleconsult' ? 'videocam' : 'person'}
                size={18}
                color={v.type === 'teleconsult' ? Colors.info : Colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.visitDate, isRTL && styles.rtlText]}>{v.date} — {v.time}</Text>
              <Text style={[styles.visitType, isRTL && styles.rtlText]}>
                {v.type === 'teleconsult'
                  ? (isRTL ? 'استشارة عن بُعد' : 'Teleconsultation')
                  : (isRTL ? 'زيارة شخصية' : 'In-Person')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.visitFee}>{v.fee} EGP</Text>
              <Badge
                label={v.status === 'completed' ? (isRTL ? 'مكتمل' : 'Done') : v.status}
                variant="success"
                size="sm"
              />
            </View>
          </View>
        ))}

        {/* Notes section */}
        <View style={styles.notesCard}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { marginBottom: 8 }]}>
            {isRTL ? 'ملاحظات طبية' : 'Medical Notes'}
          </Text>
          <Text style={[styles.notesText, isRTL && styles.rtlText]}>
            {isRTL ? 'لا توجد ملاحظات مسجلة بعد.' : 'No medical notes recorded yet.'}
          </Text>
        </View>

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
  rtlText: { textAlign: 'right' },

  identityCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.textWhite },
  patientName: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  phone: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  statLbl: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  actionsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 20,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  visitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  visitIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  visitDate: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  visitType: { fontSize: 12, color: Colors.textSecondary },
  visitFee: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 4 },

  notesCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  notesText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
});

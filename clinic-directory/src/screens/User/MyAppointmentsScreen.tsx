import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../../data/mockData';
import Badge from '../../components/common/Badge';

type StatusTab = 'all' | 'upcoming' | 'past';

export default function MyAppointmentsScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<StatusTab>('all');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return isRTL ? 'مؤكد' : 'Confirmed';
      case 'pending': return isRTL ? 'قيد الانتظار' : 'Pending';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('appointments.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['all', 'upcoming', 'past'] as StatusTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? t('appointments.all') : tab === 'upcoming' ? t('appointments.upcoming') : t('appointments.past')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={MOCK_APPOINTMENTS}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const doctor = MOCK_DOCTORS.find(d => d.id === item.doctorId);
          const docName = doctor ? (language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`) : '';
          return (
            <View style={styles.aptCard}>
              <View style={styles.aptHeader}>
                <View>
                  <Text style={[styles.aptDate, isRTL && styles.rtlText]}>{item.date} • {item.timeSlot}</Text>
                  <Text style={[styles.aptDoctor, isRTL && styles.rtlText]}>{docName}</Text>
                  {doctor && <Text style={[styles.aptSpec, isRTL && styles.rtlText]}>
                    {language === 'ar' ? doctor.specializationAr : doctor.specializationEn}
                  </Text>}
                </View>
                <Badge label={getStatusLabel(item.status)} variant={getStatusVariant(item.status) as any} />
              </View>
              <View style={styles.aptFooter}>
                <View style={styles.aptType}>
                  <Ionicons
                    name={item.type === 'in_person' ? 'business-outline' : 'videocam-outline'}
                    size={14}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.aptTypeText}>
                    {item.type === 'in_person' ? t('appointments.inPerson') : t('appointments.teleconsult')}
                  </Text>
                </View>
                <Text style={styles.aptFee}>{item.fee} {isRTL ? 'ج.م' : 'EGP'}</Text>
              </View>
              {item.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => Alert.alert(t('appointments.cancel'), t('appointments.cancelConfirm'))}
                >
                  <Text style={styles.cancelText}>{t('appointments.cancel')}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={56} color={Colors.border} />
            <Text style={styles.emptyText}>{t('appointments.noAppointments')}</Text>
          </View>
        }
      />
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
    paddingBottom: 12,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textMuted },
  activeTabText: { color: Colors.primary, fontWeight: '700' },
  list: { padding: Spacing.xl, paddingBottom: 30 },
  aptCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  aptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  aptDate: { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  aptDoctor: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  aptSpec: { fontSize: 12, color: Colors.primary, marginTop: 2 },
  rtlText: { textAlign: 'right' },
  aptFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aptType: { flexDirection: 'row', alignItems: 'center' },
  aptTypeText: { fontSize: 12, color: Colors.textMuted, marginLeft: 4 },
  aptFee: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  cancelText: { fontSize: 13, color: Colors.error, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 16 },
});

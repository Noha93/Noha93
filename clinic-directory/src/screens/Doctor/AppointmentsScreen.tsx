import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import Badge from '../../components/common/Badge';

export default function AppointmentsScreen() {
  const { t, isRTL } = useLanguage();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const filtered = activeFilter === 'all'
    ? MOCK_APPOINTMENTS
    : MOCK_APPOINTMENTS.filter(a => a.status === activeFilter);

  const getStatusVariant = (s: string) => {
    if (s === 'confirmed') return 'success';
    if (s === 'pending') return 'warning';
    if (s === 'cancelled') return 'error';
    return 'info';
  };

  const getStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      confirmed: isRTL ? 'مؤكد' : 'Confirmed',
      pending: isRTL ? 'انتظار' : 'Pending',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      completed: isRTL ? 'مكتمل' : 'Completed',
    };
    return map[s] || s;
  };

  const filters = [
    { key: 'all', label: isRTL ? 'الكل' : 'All' },
    { key: 'pending', label: isRTL ? 'انتظار' : 'Pending' },
    { key: 'confirmed', label: isRTL ? 'مؤكد' : 'Confirmed' },
    { key: 'completed', label: isRTL ? 'مكتمل' : 'Completed' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('appointments.title')}</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{MOCK_APPOINTMENTS.length}</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, activeFilter === f.key && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f.key as any)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.aptCard}
            onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
            activeOpacity={0.85}
          >
            <View style={[styles.aptLeft, { borderLeftColor: item.status === 'confirmed' ? Colors.success : Colors.warning }]}>
              <Text style={styles.aptTime}>{item.timeSlot}</Text>
              <Text style={styles.aptDate}>{item.date}</Text>
            </View>
            <View style={styles.aptInfo}>
              <Text style={[styles.aptName, isRTL && styles.rtlText]}>{item.patientName}</Text>
              <Text style={[styles.aptPhone, isRTL && styles.rtlText]}>{item.patientPhone}</Text>
              <View style={[styles.aptType, isRTL && styles.rtlRow]}>
                <Ionicons
                  name={item.type === 'in_person' ? 'business-outline' : 'videocam-outline'}
                  size={12}
                  color={Colors.textMuted}
                />
                <Text style={styles.aptTypeText}>
                  {item.type === 'in_person' ? (isRTL ? 'حضور' : 'In-Person') : (isRTL ? 'أونلاين' : 'Video')}
                </Text>
              </View>
            </View>
            <View style={styles.aptRight}>
              <Badge label={getStatusLabel(item.status)} variant={getStatusVariant(item.status) as any} size="sm" />
              <Text style={styles.aptFee}>{item.fee} {isRTL ? 'ج.م' : 'EGP'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={52} color={Colors.border} />
            <Text style={styles.emptyText}>{isRTL ? 'لا توجد مواعيد' : 'No appointments'}</Text>
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
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },
  totalBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  totalText: { color: Colors.textWhite, fontWeight: '700', fontSize: 13 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  filterText: { fontSize: 12, color: Colors.textMuted },
  filterTextActive: { color: Colors.primary, fontWeight: '700' },
  list: { padding: Spacing.xl, paddingBottom: 30 },
  aptCard: {
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
  aptLeft: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginRight: 14,
    width: 80,
  },
  aptTime: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  aptDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  aptInfo: { flex: 1 },
  aptName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  aptPhone: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  aptType: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  aptTypeText: { fontSize: 11, color: Colors.textMuted, marginLeft: 3 },
  aptRight: { alignItems: 'flex-end' },
  aptFee: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 12 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { MOCK_HOSPITALS } from '../../data/mockData';
import HospitalCard from '../../components/hospitals/HospitalCard';

type HospitalType = 'all' | 'hospital' | 'medical_center' | 'clinic_complex';

export default function HospitalsScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<HospitalType>('all');

  const filters: { key: HospitalType; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'hospital', labelAr: 'مستشفيات', labelEn: 'Hospitals' },
    { key: 'medical_center', labelAr: 'مراكز طبية', labelEn: 'Medical Centers' },
    { key: 'clinic_complex', labelAr: 'مجمعات', labelEn: 'Complexes' },
  ];

  const filtered = filter === 'all' ? MOCK_HOSPITALS : MOCK_HOSPITALS.filter(h => h.type === filter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('hospitals.title')}</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search', {})}>
          <Ionicons name="search-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {language === 'ar' ? f.labelAr : f.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={h => h.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <HospitalCard
              hospital={item}
              variant="list"
              onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="business-outline" size={52} color={Colors.border} />
            <Text style={styles.emptyText}>{t('common.noData')}</Text>
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
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  rtlText: { textAlign: 'right' },
  searchBtn: { padding: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.primaryUltraLight },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  filterText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  filterTextActive: { color: Colors.primary, fontWeight: '700' },
  cardWrapper: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  listContent: { paddingBottom: 20 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 12 },
});

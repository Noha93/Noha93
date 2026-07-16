import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput, ScrollView, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS, SPECIALIZATIONS } from '../../data/mockData';
import { Doctor } from '../../types';
import DoctorCard from '../../components/doctors/DoctorCard';

export default function SearchScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [query, setQuery] = useState(route.params?.query || '');
  const [selectedSpec, setSelectedSpec] = useState(route.params?.specialization || '');
  const [openNow, setOpenNow] = useState(false);
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');
  const [results, setResults] = useState<Doctor[]>(MOCK_DOCTORS);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterDoctors();
  }, [query, selectedSpec, openNow]);

  const filterDoctors = () => {
    let filtered = [...MOCK_DOCTORS];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(d =>
        d.nameAr.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.specializationAr.includes(q) ||
        d.specializationEn.toLowerCase().includes(q)
      );
    }
    if (selectedSpec) filtered = filtered.filter(d => d.specialization === selectedSpec);
    if (openNow) filtered = filtered.filter(d => d.clinicStatus === 'open');
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options" size={22} color={showFilters ? Colors.primary : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['doctors', 'hospitals'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'doctors' ? (isRTL ? 'الأطباء' : 'Doctors') : (isRTL ? 'المستشفيات' : 'Hospitals')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {/* Specializations */}
          <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
            {t('search.specialization')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specScroll}>
            <TouchableOpacity
              style={[styles.specChip, !selectedSpec && styles.specChipActive]}
              onPress={() => setSelectedSpec('')}
            >
              <Text style={[styles.specChipText, !selectedSpec && styles.specChipTextActive]}>
                {t('search.allSpecializations')}
              </Text>
            </TouchableOpacity>
            {SPECIALIZATIONS.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.specChip, selectedSpec === s.id && styles.specChipActive]}
                onPress={() => setSelectedSpec(s.id)}
              >
                <Text style={[styles.specChipText, selectedSpec === s.id && styles.specChipTextActive]}>
                  {language === 'ar' ? s.nameAr : s.nameEn}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Open Now Toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('search.openNow')}</Text>
            <Switch
              value={openNow}
              onValueChange={setOpenNow}
              trackColor={{ false: Colors.border, true: Colors.success + '60' }}
              thumbColor={openNow ? Colors.success : Colors.textMuted}
            />
          </View>
        </View>
      )}

      {/* Results count */}
      <View style={[styles.resultsMeta, isRTL && styles.rtlRow]}>
        <Text style={styles.resultsCount}>
          {results.length} {t('search.results')}
        </Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="funnel-outline" size={16} color={Colors.primary} />
          <Text style={styles.sortText}>{t('common.sort')}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <DoctorCard
                doctor={item}
                variant="list"
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={Colors.border} />
          <Text style={styles.emptyTitle}>{t('search.noResults')}</Text>
          <Text style={styles.emptyDesc}>{t('search.tryDifferent')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 8, marginRight: 4 },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  filterToggle: { padding: 8, marginLeft: 4 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  activeTabText: { color: Colors.primary, fontWeight: '700' },

  filtersPanel: {
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: Spacing.base,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  rtlText: { textAlign: 'right' },
  specScroll: { marginBottom: 12 },
  specChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.backgroundWhite,
  },
  specChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  specChipText: { fontSize: 12, color: Colors.textSecondary },
  specChipTextActive: { color: Colors.primary, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLabel: { fontSize: 14, color: Colors.textPrimary },

  resultsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
  },
  rtlRow: { flexDirection: 'row-reverse' },
  resultsCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  sortBtn: { flexDirection: 'row', alignItems: 'center' },
  sortText: { fontSize: 13, color: Colors.primary, marginLeft: 4, fontWeight: '500' },

  cardWrapper: { paddingHorizontal: Spacing.xl },
  listContent: { paddingBottom: 20 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginTop: 16 },
  emptyDesc: { fontSize: 14, color: Colors.textMuted, marginTop: 8, textAlign: 'center' },
});

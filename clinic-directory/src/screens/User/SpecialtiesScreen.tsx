import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS, SPECIALIZATIONS } from '../../data/mockData';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.xl * 2 - 12) / 2;

const SPEC_META: Record<string, { emoji: string; colorLight: string; colorDark: string }> = {
  general:         { emoji: '🩺', colorLight: '#EAF2FF', colorDark: '#1B4F8A' },
  cardiology:      { emoji: '❤️', colorLight: '#FDEDEC', colorDark: '#E74C3C' },
  dermatology:     { emoji: '✨', colorLight: '#FEF9E7', colorDark: '#F39C12' },
  dentistry:       { emoji: '🦷', colorLight: '#EAF2FF', colorDark: '#2980B9' },
  orthopedics:     { emoji: '🦴', colorLight: '#EAFAF1', colorDark: '#27AE60' },
  pediatrics:      { emoji: '👶', colorLight: '#FDF6E3', colorDark: '#C9A84C' },
  gynecology:      { emoji: '🌸', colorLight: '#FDEDEC', colorDark: '#E91E8C' },
  ophthalmology:   { emoji: '👁️', colorLight: '#EBF5FB', colorDark: '#2980B9' },
  neurology:       { emoji: '🧠', colorLight: '#EAF2FF', colorDark: '#1B4F8A' },
  psychiatry:      { emoji: '🧘', colorLight: '#EAFAF1', colorDark: '#27AE60' },
  urology:         { emoji: '💧', colorLight: '#EBF5FB', colorDark: '#2980B9' },
  ent:             { emoji: '👂', colorLight: '#FEF9E7', colorDark: '#F39C12' },
  gastroenterology:{ emoji: '🫃', colorLight: '#FDEDEC', colorDark: '#E74C3C' },
  endocrinology:   { emoji: '⚗️', colorLight: '#FDF6E3', colorDark: '#C9A84C' },
  pulmonology:     { emoji: '🫁', colorLight: '#EBF5FB', colorDark: '#2980B9' },
  nephrology:      { emoji: '🫘', colorLight: '#EAFAF1', colorDark: '#27AE60' },
  oncology:        { emoji: '🔬', colorLight: '#FDEDEC', colorDark: '#E74C3C' },
  rheumatology:    { emoji: '🦵', colorLight: '#FDF6E3', colorDark: '#C9A84C' },
  surgery:         { emoji: '⚕️', colorLight: '#EAF2FF', colorDark: '#1B4F8A' },
  radiology:       { emoji: '🩻', colorLight: '#EBF5FB', colorDark: '#2980B9' },
  physiotherapy:   { emoji: '🏃', colorLight: '#EAFAF1', colorDark: '#27AE60' },
};

export default function SpecialtiesScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const doctorCountBySpec = SPECIALIZATIONS.reduce<Record<string, number>>((acc, spec) => {
    acc[spec.id] = MOCK_DOCTORS.filter(d => d.specialization === spec.id).length;
    return acc;
  }, {});

  const filtered = SPECIALIZATIONS.filter(spec => {
    if (!search.trim()) return true;
    const name = language === 'ar' ? spec.nameAr : spec.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (specId: string) => {
    navigation.navigate('Search', { specialization: specId });
  };

  const renderItem = ({ item: spec }: { item: typeof SPECIALIZATIONS[0] }) => {
    const meta = SPEC_META[spec.id] || { emoji: '⚕️', colorLight: '#EAF2FF', colorDark: '#1B4F8A' };
    const count = doctorCountBySpec[spec.id] || 0;
    const name = language === 'ar' ? spec.nameAr : spec.nameEn;

    return (
      <TouchableOpacity
        style={[styles.specCard, { width: CARD_SIZE }]}
        onPress={() => handleSelect(spec.id)}
        activeOpacity={0.85}
      >
        <View style={[styles.emojiCircle, { backgroundColor: meta.colorLight }]}>
          <Text style={styles.emoji}>{meta.emoji}</Text>
        </View>
        <Text
          style={[styles.specName, isRTL && styles.rtlText, { color: meta.colorDark }]}
          numberOfLines={2}
        >
          {name}
        </Text>
        {count > 0 && (
          <View style={[styles.countBadge, { backgroundColor: meta.colorLight }]}>
            <Text style={[styles.countText, { color: meta.colorDark }]}>
              {count} {isRTL ? t('specialties.doctorsCount') : t('specialties.doctorsCount')}
            </Text>
          </View>
        )}
        <View style={[styles.arrowRow, isRTL && styles.rtlRow]}>
          <Text style={[styles.seeMore, { color: meta.colorDark }]}>
            {isRTL ? 'عرض الأطباء' : 'See Doctors'}
          </Text>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={14}
            color={meta.colorDark}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.decorCircle} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons
              name={isRTL ? 'arrow-forward' : 'arrow-back'}
              size={22}
              color={Colors.textWhite}
            />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('specialties.title')}</Text>
            <Text style={[styles.headerSubtitle, isRTL && styles.rtlText]}>{t('specialties.subtitle')}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Search */}
        <View style={[styles.searchBar, isRTL && styles.rtlRow]}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtlText]}
            placeholder={isRTL ? 'ابحث عن تخصص...' : 'Search specialty...'}
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Stats bar */}
      <View style={[styles.statsBar, isRTL && styles.rtlRow]}>
        <Text style={styles.statsText}>
          {isRTL
            ? `${filtered.length} تخصص • ${MOCK_DOCTORS.length} طبيب`
            : `${filtered.length} specialties • ${MOCK_DOCTORS.length} doctors`}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
              {isRTL ? 'لا توجد تخصصات مطابقة' : 'No specialties found'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 2,
  },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.backgroundWhite,
  },
  statsText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  list: {
    padding: Spacing.xl,
    paddingTop: 14,
    paddingBottom: 40,
  },
  row: { justifyContent: 'space-between', marginBottom: 12 },

  specCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: { fontSize: 26 },
  specName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 18,
  },
  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  countText: { fontSize: 11, fontWeight: '600' },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeMore: { fontSize: 11, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted, fontWeight: '600' },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, TextInput, FlatList, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { MOCK_DOCTORS, MOCK_HOSPITALS, MOCK_ADS, SPECIALIZATIONS } from '../../data/mockData';
import DoctorCard from '../../components/doctors/DoctorCard';
import HospitalCard from '../../components/hospitals/HospitalCard';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDoctors = MOCK_DOCTORS.filter(d => d.isFeatured);
  const topDoctors = [...MOCK_DOCTORS].sort((a, b) => b.rating - a.rating);
  const featuredHospitals = MOCK_HOSPITALS.filter(h => h.isFeatured);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (isRTL) {
      if (hour < 12) return 'صباح الخير';
      if (hour < 18) return 'مساء الخير';
      return 'مساء النور';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorCircle} />
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {user ? (language === 'ar' ? user.nameAr : user.nameEn) : (isRTL ? 'بك' : 'Guest')} 👋
              </Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textWhite} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Search', {})}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <Text style={[styles.searchPlaceholder, isRTL && { textAlign: 'right' }]}>
              {t('home.searchPlaceholder')}
            </Text>
            <View style={styles.filterBtn}>
              <Ionicons name="options-outline" size={18} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Advertisement Banner */}
        {MOCK_ADS.length > 0 && (
          <View style={styles.adBanner}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {MOCK_ADS.map(ad => (
                <TouchableOpacity key={ad.id} style={styles.adCard} activeOpacity={0.9}>
                  <Image source={{ uri: ad.imageUrl }} style={styles.adImage} />
                  <LinearGradient
                    colors={['transparent', Colors.overlayDark]}
                    style={styles.adOverlay}
                  >
                    <Badge
                      label={isRTL ? 'إعلان' : 'Ad'}
                      variant="gold"
                      size="sm"
                      style={{ marginBottom: 6 }}
                    />
                    <Text style={styles.adTitle} numberOfLines={1}>
                      {isRTL ? ad.titleAr : ad.title}
                    </Text>
                    <Text style={styles.adDesc} numberOfLines={1}>
                      {isRTL ? ad.descriptionAr : ad.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            {[
              { icon: 'search', label: isRTL ? 'ابحث' : 'Search', color: Colors.primary, screen: 'Search' },
              { icon: 'location', label: isRTL ? 'القريبون' : 'Nearby', color: Colors.success, screen: 'Nearby' },
              { icon: 'calendar', label: isRTL ? 'احجز' : 'Book', color: Colors.secondary, screen: 'Search' },
              { icon: 'business', label: isRTL ? 'مستشفيات' : 'Hospitals', color: Colors.error, screen: 'Hospitals' },
            ].map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickAction}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.qaIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon as any} size={26} color={action.color} />
                </View>
                <Text style={styles.qaLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('home.specializations')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search', {})}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SPECIALIZATIONS.map(spec => (
              <TouchableOpacity
                key={spec.id}
                style={styles.specChip}
                onPress={() => navigation.navigate('Search', { specialization: spec.id })}
              >
                <Text style={styles.specEmoji}>
                  {getSpecEmoji(spec.id)}
                </Text>
                <Text style={styles.specLabel}>
                  {language === 'ar' ? spec.nameAr : spec.nameEn}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Doctors */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('home.featuredDoctors')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search', {})}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                variant="featured"
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Top Rated Doctors */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('home.topRated')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search', {})}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {topDoctors.slice(0, 3).map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              variant="list"
              onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor.id })}
            />
          ))}
        </View>

        {/* Hospitals & Centers */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('home.hospitals')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Hospitals')}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MOCK_HOSPITALS.map(hospital => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                variant="featured"
                onPress={() => navigation.navigate('HospitalDetail', { hospitalId: hospital.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function getSpecEmoji(id: string): string {
  const map: Record<string, string> = {
    general: '🩺', cardiology: '❤️', dermatology: '✨', dentistry: '🦷',
    orthopedics: '🦴', pediatrics: '👶', gynecology: '🌸', ophthalmology: '👁️',
    neurology: '🧠', psychiatry: '🧘', ent: '👂', surgery: '⚕️',
    physiotherapy: '🏃', oncology: '🔬', urology: '💧',
  };
  return map[id] || '⚕️';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 24,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textWhite },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.full,
    paddingLeft: 16,
    paddingRight: 6,
    height: 50,
    ...Shadow.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 10,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ad
  adBanner: { paddingVertical: 16, paddingLeft: Spacing.xl },
  adCard: {
    width: width * 0.75,
    height: 140,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    ...Shadow.md,
  },
  adImage: { width: '100%', height: '100%' },
  adOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    paddingTop: 30,
  },
  adTitle: { fontSize: 14, fontWeight: '700', color: Colors.textWhite },
  adDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Sections
  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  rtlRow: { flexDirection: 'row-reverse' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  rtlText: { textAlign: 'right' },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  quickAction: { alignItems: 'center', flex: 1 },
  qaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  qaLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },

  // Specializations
  specChip: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
    minWidth: 80,
  },
  specEmoji: { fontSize: 24, marginBottom: 4 },
  specLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
});

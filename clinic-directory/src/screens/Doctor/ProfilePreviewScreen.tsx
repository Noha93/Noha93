import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import Badge from '../../components/common/Badge';
import Rating from '../../components/common/Rating';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const TABS = ['about', 'schedule', 'reviews', 'media'];
const TAB_LABELS: Record<string, { ar: string; en: string }> = {
  about:    { ar: 'عن الطبيب', en: 'About' },
  schedule: { ar: 'المواعيد', en: 'Schedule' },
  reviews:  { ar: 'التقييمات', en: 'Reviews' },
  media:    { ar: 'الصور', en: 'Photos' },
};

const DAYS_AR: Record<string, string> = {
  sunday: 'الأحد', monday: 'الاثنين', tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة', saturday: 'السبت',
};
const DAYS_EN: Record<string, string> = {
  sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday',
  wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
};

export default function ProfilePreviewScreen() {
  const { isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('about');

  if (!doctor) return null;

  const name = language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`;
  const spec = language === 'ar' ? doctor.specializationAr : doctor.specializationEn;
  const about = language === 'ar' ? doctor.aboutAr : doctor.about;
  const DAYS = language === 'ar' ? DAYS_AR : DAYS_EN;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Preview Banner */}
      <View style={styles.previewBanner}>
        <Ionicons name="eye-outline" size={16} color={Colors.secondary} />
        <Text style={styles.previewBannerText}>
          {isRTL ? 'معاينة الملف — هكذا يراك المرضى' : 'Profile Preview — This is how patients see you'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {doctor.coverImage ? (
            <Image source={{ uri: doctor.coverImage }} style={styles.cover} />
          ) : (
            <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.cover} />
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.coverOverlay} />

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={Colors.textWhite} />
          </TouchableOpacity>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: doctor.clinicStatus === 'open' ? Colors.success : Colors.error }]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {doctor.clinicStatus === 'open' ? (isRTL ? 'مفتوح الآن' : 'Open Now') : (isRTL ? 'مغلق' : 'Closed')}
            </Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
            {doctor.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              </View>
            )}
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.doctorName, isRTL && styles.rtlText]}>{name}</Text>
          <Text style={[styles.spec, isRTL && styles.rtlText]}>{spec}</Text>
          <View style={styles.metaRow}>
            <Rating value={doctor.rating} size={15} />
            <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({doctor.reviewCount} {isRTL ? 'تقييم' : 'reviews'})</Text>
            <View style={styles.dot} />
            <Ionicons name="briefcase" size={13} color={Colors.textMuted} />
            <Text style={styles.expText}>{doctor.experience} {isRTL ? 'سنة' : 'yrs'}</Text>
          </View>

          {/* Fee & Book */}
          <View style={styles.feeRow}>
            <View>
              <Text style={styles.feeLabel}>{isRTL ? 'رسوم الكشف' : 'Consultation Fee'}</Text>
              <Text style={styles.feeValue}>{doctor.consultationFee} {doctor.currency}</Text>
            </View>
            <Button
              title={isRTL ? 'احجز موعداً' : 'Book Appointment'}
              onPress={() => {}}
              size="md"
              leftIcon={<Ionicons name="calendar" size={16} color={Colors.textWhite} />}
            />
          </View>

          {/* Contact icons */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="phone-portrait-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: Colors.success + '15', borderColor: Colors.success }]}>
              <Ionicons name="logo-whatsapp" size={20} color={Colors.success} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {language === 'ar' ? TAB_LABELS[tab].ar : TAB_LABELS[tab].en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        <View style={styles.tabContent}>

          {activeTab === 'about' && (
            <View>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{isRTL ? 'عن الطبيب' : 'About'}</Text>
              <Text style={[styles.aboutText, isRTL && styles.rtlText]}>{about}</Text>

              <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { marginTop: 16 }]}>{isRTL ? 'التعليم' : 'Education'}</Text>
              {doctor.education.map((edu, i) => (
                <View key={i} style={styles.eduCard}>
                  <View style={styles.eduIcon}>
                    <Ionicons name="school" size={18} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.eduDegree, isRTL && styles.rtlText]}>{edu.degree}</Text>
                    <Text style={[styles.eduInst, isRTL && styles.rtlText]}>{edu.institution} — {edu.year}</Text>
                  </View>
                </View>
              ))}

              <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { marginTop: 16 }]}>{isRTL ? 'عنوان العيادة' : 'Clinic Address'}</Text>
              <View style={styles.addressCard}>
                <Ionicons name="location" size={18} color={Colors.error} />
                <Text style={[styles.addressText, isRTL && styles.rtlText]}>
                  {doctor.address.street}، {doctor.address.area}، {doctor.address.city}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'schedule' && (
            <View>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{isRTL ? 'مواعيد العمل' : 'Working Hours'}</Text>
              {doctor.schedule.map((s, i) => (
                <View key={i} style={[styles.schedRow, isRTL && styles.rtlRow]}>
                  <Text style={[styles.schedDay, isRTL && styles.rtlText]}>{DAYS[s.day]}</Text>
                  {s.isWorking
                    ? <Text style={styles.schedTime}>{s.startTime} – {s.endTime}</Text>
                    : <Badge label={isRTL ? 'مغلق' : 'Closed'} variant="error" size="sm" />}
                </View>
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View>
              <View style={styles.ratingOverall}>
                <Text style={styles.ratingBig}>{doctor.rating.toFixed(1)}</Text>
                <Rating value={doctor.rating} size={20} />
                <Text style={styles.ratingTotal}>{doctor.reviewCount} {isRTL ? 'تقييم' : 'reviews'}</Text>
              </View>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                {isRTL ? 'لا توجد تقييمات عامة في المعاينة' : 'No public reviews in preview mode'}
              </Text>
            </View>
          )}

          {activeTab === 'media' && (
            <View>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                {isRTL ? 'لا توجد صور مضافة بعد' : 'No photos added yet'}
              </Text>
              <Button
                title={isRTL ? 'إضافة صور' : 'Add Photos'}
                onPress={() => navigation.navigate('ClinicPhotos')}
                variant="outline"
                fullWidth
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryUltraLight,
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary + '40',
    paddingTop: 46,
  },
  previewBannerText: { fontSize: 12, color: Colors.secondaryDark, fontWeight: '600' },

  hero: { height: 220, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  coverOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textWhite },
  statusText: { fontSize: 12, color: Colors.textWhite, fontWeight: '700' },
  avatarWrap: { position: 'absolute', bottom: -40, left: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: Colors.backgroundWhite,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
  },

  infoSection: { paddingTop: 48, paddingHorizontal: Spacing.xl, paddingBottom: 16, backgroundColor: Colors.backgroundWhite },
  doctorName: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  spec: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 },
  ratingText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  reviewCount: { fontSize: 12, color: Colors.textMuted },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  expText: { fontSize: 12, color: Colors.textMuted },

  feeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  feeLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  feeValue: { fontSize: 18, fontWeight: '800', color: Colors.secondaryDark },

  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabs: { backgroundColor: Colors.backgroundWhite, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },

  tabContent: { padding: Spacing.xl },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },
  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  eduCard: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  eduIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eduDegree: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  eduInst: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  addressCard: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressText: { fontSize: 14, color: Colors.textSecondary, flex: 1 },

  schedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  schedDay: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  schedTime: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  ratingOverall: { alignItems: 'center', paddingVertical: 20 },
  ratingBig: { fontSize: 48, fontWeight: '900', color: Colors.primary },
  ratingTotal: { fontSize: 13, color: Colors.textMuted, marginTop: 6 },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 },
});

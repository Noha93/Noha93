import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_HOSPITALS, MOCK_DOCTORS, DAYS_AR, DAYS_EN } from '../../data/mockData';
import DoctorCard from '../../components/doctors/DoctorCard';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';

const DAYS_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function HospitalDetailScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState<'info' | 'doctors' | 'schedule'>('info');

  const hospital = MOCK_HOSPITALS.find(h => h.id === route.params?.hospitalId) || MOCK_HOSPITALS[0];
  const hospitalDoctors = MOCK_DOCTORS.filter(d => hospital.doctorIds.includes(d.id));

  const name = language === 'ar' ? hospital.nameAr : hospital.nameEn;
  const description = language === 'ar' ? hospital.descriptionAr : hospital.description;
  const DAYS = language === 'ar' ? DAYS_AR : DAYS_EN;

  const typeLabel = () => {
    switch (hospital.type) {
      case 'hospital': return isRTL ? 'مستشفى' : 'Hospital';
      case 'medical_center': return isRTL ? 'مركز طبي' : 'Medical Center';
      case 'clinic_complex': return isRTL ? 'مجمع عيادات' : 'Clinic Complex';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: hospital.coverImage }} style={styles.coverImg} />
        <LinearGradient colors={['transparent', Colors.overlayDark]} style={styles.heroOverlay} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Badge label={typeLabel()} variant="gold" size="sm" style={{ marginBottom: 8 }} />
          <Text style={styles.heroName}>{name}</Text>
          <Rating rating={hospital.rating} size={14} showNumber reviewCount={hospital.reviewCount} />
        </View>
      </View>

      {/* Quick Info */}
      <View style={styles.quickRow}>
        <View style={styles.qiItem}>
          <Ionicons name="people-outline" size={18} color={Colors.primary} />
          <Text style={styles.qiText}>{hospital.doctorIds.length} {isRTL ? 'طبيب' : 'Doctors'}</Text>
        </View>
        {hospital.bedCount && (
          <View style={styles.qiItem}>
            <Ionicons name="bed-outline" size={18} color={Colors.secondary} />
            <Text style={styles.qiText}>{hospital.bedCount} {isRTL ? 'سرير' : 'Beds'}</Text>
          </View>
        )}
        <View style={styles.qiItem}>
          <Ionicons name="calendar-outline" size={18} color={Colors.success} />
          <Text style={styles.qiText}>{hospital.establishedYear}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'info', label: isRTL ? 'معلومات' : 'Info' },
          { key: 'doctors', label: isRTL ? 'الأطباء' : 'Doctors' },
          { key: 'schedule', label: isRTL ? 'المواعيد' : 'Schedule' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'info' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {isRTL ? 'عن المنشأة' : 'About'}
            </Text>
            <Text style={[styles.desc, isRTL && styles.rtlText]}>{description}</Text>

            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('hospitals.facilities')}
            </Text>
            <View style={styles.tagsWrap}>
              {(language === 'ar' ? hospital.facilitiesAr : hospital.facilities).map((f, i) => (
                <Badge key={i} label={f} variant="primary" style={styles.facilityTag} />
              ))}
            </View>

            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('hospitals.insurance')}
            </Text>
            <View style={styles.tagsWrap}>
              {hospital.insuranceProviders.map((ins, i) => (
                <Badge key={i} label={ins} variant="gold" style={styles.facilityTag} />
              ))}
            </View>

            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {isRTL ? 'معلومات الاتصال' : 'Contact'}
            </Text>
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={18} color={Colors.primary} />
                <Text style={styles.contactText}>{hospital.contact.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="phone-portrait-outline" size={18} color={Colors.primary} />
                <Text style={styles.contactText}>{hospital.contact.mobile}</Text>
              </View>
              {hospital.contact.email && (
                <View style={styles.contactRow}>
                  <Ionicons name="mail-outline" size={18} color={Colors.primary} />
                  <Text style={styles.contactText}>{hospital.contact.email}</Text>
                </View>
              )}
              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
                <Text style={styles.contactText}>
                  {hospital.address.street}, {hospital.address.area}, {hospital.address.city}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'doctors' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {isRTL ? `الأطباء (${hospitalDoctors.length})` : `Doctors (${hospitalDoctors.length})`}
            </Text>
            {hospitalDoctors.map(doc => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                variant="list"
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: doc.id })}
              />
            ))}
          </View>
        )}

        {activeTab === 'schedule' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('schedule.weeklySchedule')}
            </Text>
            {DAYS_ORDER.map(day => {
              const s = hospital.schedule.find(sc => sc.day === day);
              return (
                <View key={day} style={[styles.scheduleRow, !s?.isWorking && styles.closedRow]}>
                  <Text style={[styles.dayName, !s?.isWorking && styles.closedText]}>{DAYS[day]}</Text>
                  {s?.isWorking ? (
                    <View style={styles.timeRange}>
                      <Text style={styles.timeText}>
                        {s.startTime === '00:00' ? (isRTL ? 'على مدار اليوم' : '24/7') : `${s.startTime} - ${s.endTime}`}
                      </Text>
                    </View>
                  ) : (
                    <Badge label={t('schedule.closed')} variant="error" size="sm" />
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 220, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', inset: 0 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroName: { fontSize: 22, fontWeight: '800', color: Colors.textWhite, marginBottom: 6 },

  quickRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-around',
  },
  qiItem: { flexDirection: 'row', alignItems: 'center' },
  qiText: { fontSize: 13, color: Colors.textSecondary, marginLeft: 6, fontWeight: '500' },

  tabs: { flexDirection: 'row', backgroundColor: Colors.backgroundWhite, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  activeTabText: { color: Colors.primary, fontWeight: '700' },

  content: { flex: 1 },
  section: { padding: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  rtlText: { textAlign: 'right' },
  desc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 8 },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  facilityTag: { marginBottom: 4 },

  contactCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  contactText: { fontSize: 14, color: Colors.textPrimary, marginLeft: 10 },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closedRow: { opacity: 0.5 },
  dayName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, width: 90 },
  closedText: { color: Colors.textMuted },
  timeRange: {},
  timeText: { fontSize: 14, color: Colors.textPrimary },
});

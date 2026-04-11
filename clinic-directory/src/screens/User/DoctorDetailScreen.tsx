import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, Dimensions, Linking, Share, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { MOCK_DOCTORS, DAYS_AR, DAYS_EN } from '../../data/mockData';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

export default function DoctorDetailScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'reviews' | 'media'>('about');
  const [isFavorite, setIsFavorite] = useState(false);

  const doctor = MOCK_DOCTORS.find(d => d.id === route.params?.doctorId) || MOCK_DOCTORS[0];

  const name = language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`;
  const specialization = language === 'ar' ? doctor.specializationAr : doctor.specializationEn;
  const about = language === 'ar' ? doctor.aboutAr : doctor.about;

  const statusColor = doctor.clinicStatus === 'open' ? Colors.open : Colors.closed;
  const statusLabel = doctor.clinicStatus === 'open' ? t('common.open') : t('common.closed');

  const DAYS = language === 'ar' ? DAYS_AR : DAYS_EN;
  const DAYS_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const tabs = [
    { key: 'about', label: isRTL ? 'عن الطبيب' : 'About' },
    { key: 'schedule', label: isRTL ? 'المواعيد' : 'Schedule' },
    { key: 'reviews', label: isRTL ? 'التقييمات' : 'Reviews' },
    { key: 'media', label: isRTL ? 'الصور' : 'Media' },
  ];

  const handleCall = () => Linking.openURL(`tel:${doctor.contact.mobile}`);
  const handleWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${doctor.contact.whatsapp}`);
  const handleShare = () => Share.share({ message: `${name} - ${specialization}\n${doctor.contact.mobile}` });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={{ uri: doctor.coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' }}
          style={styles.coverImage}
        />
        <LinearGradient
          colors={['transparent', Colors.overlayDark]}
          style={styles.heroOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Top actions */}
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={Colors.textWhite} />
          </TouchableOpacity>
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? Colors.error : Colors.textWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Doctor info on hero */}
        <View style={styles.heroInfo}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={styles.heroText}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName} numberOfLines={1}>{name}</Text>
              {doctor.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.secondary} style={{ marginLeft: 6 }} />
              )}
            </View>
            <Text style={styles.heroSpec}>{specialization}</Text>
            <View style={styles.heroMeta}>
              <Rating rating={doctor.rating} size={14} showNumber reviewCount={doctor.reviewCount} />
              <View style={[styles.statusPill, { backgroundColor: statusColor + '25' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Info */}
      <View style={styles.quickInfo}>
        {[
          { icon: 'time-outline', label: isRTL ? `${doctor.experience} سنة` : `${doctor.experience} yrs`, color: Colors.primary },
          { icon: 'cash-outline', label: `${doctor.consultationFee} ${isRTL ? 'ج.م' : 'EGP'}`, color: Colors.secondary },
          { icon: 'location-outline', label: doctor.address.area, color: Colors.success },
          { icon: 'language-outline', label: doctor.languages.join('/'), color: Colors.info },
        ].map((item, i) => (
          <View key={i} style={styles.qiItem}>
            <View style={[styles.qiIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={styles.qiLabel} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {/* About */}
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctor.about')}</Text>
            <Text style={[styles.aboutText, isRTL && styles.rtlText]}>{about}</Text>

            {/* Education */}
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctor.education')}</Text>
            {doctor.education.map((edu, i) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduDot} />
                <View>
                  <Text style={[styles.eduDegree, isRTL && styles.rtlText]}>{edu.degree}</Text>
                  <Text style={[styles.eduInst, isRTL && styles.rtlText]}>
                    {edu.institution} • {edu.year} • {edu.country}
                  </Text>
                </View>
              </View>
            ))}

            {/* Contact */}
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctor.contactInfo')}</Text>
            <View style={styles.contactCard}>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <View style={[styles.contactIcon, { backgroundColor: Colors.success + '15' }]}>
                  <Ionicons name="call-outline" size={20} color={Colors.success} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>{isRTL ? 'الموبايل' : 'Mobile'}</Text>
                  <Text style={styles.contactValue}>{doctor.contact.mobile}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.contactDivider} />
              <TouchableOpacity style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: Colors.primary + '15' }]}>
                  <Ionicons name="call-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>{isRTL ? 'الأرضي' : 'Landline'}</Text>
                  <Text style={styles.contactValue}>{doctor.contact.phone}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Location */}
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctor.location')}</Text>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={48} color={Colors.primary} />
              <Text style={styles.mapAddress}>
                {doctor.address.street}, {doctor.address.area}, {doctor.address.city}
              </Text>
              <TouchableOpacity style={styles.directionsBtn}>
                <Ionicons name="navigate-outline" size={16} color={Colors.textWhite} />
                <Text style={styles.directionsBtnText}>{t('doctor.getDirections')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'schedule' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('schedule.weeklySchedule')}</Text>
            {DAYS_ORDER.map(day => {
              const s = doctor.schedule.find(sc => sc.day === day);
              return (
                <View key={day} style={[styles.scheduleRow, !s?.isWorking && styles.closedRow]}>
                  <Text style={[styles.dayName, !s?.isWorking && styles.closedText]}>
                    {DAYS[day]}
                  </Text>
                  {s?.isWorking ? (
                    <View style={styles.timeRange}>
                      <Text style={styles.timeText}>{s.startTime}</Text>
                      <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} style={{ marginHorizontal: 4 }} />
                      <Text style={styles.timeText}>{s.endTime}</Text>
                      {s.maxAppointments && (
                        <Badge
                          label={`${s.maxAppointments} ${isRTL ? 'حجز' : 'slots'}`}
                          variant="primary"
                          size="sm"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                  ) : (
                    <Badge label={t('schedule.closed')} variant="error" size="sm" />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
              <View style={styles.ratingBig}>
                <Text style={styles.ratingNumber}>{doctor.rating.toFixed(1)}</Text>
                <Rating rating={doctor.rating} size={20} />
                <Text style={styles.ratingTotal}>{doctor.reviewCount} {t('reviews.ratingCount')}</Text>
              </View>
            </View>

            {/* Reviews */}
            {doctor.reviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.userName[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  {review.isVerified && (
                    <Badge label={t('reviews.verified')} variant="success" size="sm" style={{ marginLeft: 'auto' }} />
                  )}
                </View>
                <Rating rating={review.rating} size={14} style={{ marginVertical: 6 } as any} />
                <Text style={[styles.reviewText, isRTL && styles.rtlText]}>
                  {language === 'ar' && review.commentAr ? review.commentAr : review.comment}
                </Text>
                <TouchableOpacity style={styles.likeBtn}>
                  <Ionicons name="thumbs-up-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.likeCount}>{review.likes}</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Button
              title={t('reviews.addReview')}
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('Reviews', { doctorId: doctor.id })}
            />
          </View>
        )}

        {activeTab === 'media' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctor.clinicPhotos')}</Text>
            <View style={styles.mediaGrid}>
              {doctor.media.map(item => (
                <TouchableOpacity key={item.id} style={styles.mediaItem}>
                  <Image source={{ uri: item.url }} style={styles.mediaImage} />
                  {item.type === 'video' && (
                    <View style={styles.playOverlay}>
                      <Ionicons name="play-circle" size={32} color={Colors.textWhite} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              {doctor.media.length === 0 && (
                <Text style={styles.noMedia}>{isRTL ? 'لا توجد صور متاحة' : 'No media available'}</Text>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color={Colors.textWhite} />
          <Text style={styles.whatsappText}>WhatsApp</Text>
        </TouchableOpacity>
        <Button
          title={t('doctor.bookAppointment')}
          onPress={() => navigation.navigate('Booking', { doctorId: doctor.id })}
          style={{ flex: 1, marginLeft: Spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: { height: 260, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', inset: 0 },
  topActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topRight: { flexDirection: 'row' },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.secondary,
    marginRight: 12,
  },
  heroText: { flex: 1 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center' },
  heroName: { fontSize: 18, fontWeight: '800', color: Colors.textWhite, flex: 1 },
  heroSpec: { fontSize: 13, color: Colors.secondary, marginBottom: 4, fontWeight: '500' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },

  // Quick info
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  qiItem: { flex: 1, alignItems: 'center' },
  qiIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  qiLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  activeTabText: { color: Colors.primary, fontWeight: '700' },

  // Content
  content: { flex: 1 },
  tabContent: { padding: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  rtlText: { textAlign: 'right' },
  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  // Education
  eduItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  eduDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5, marginRight: 12 },
  eduDegree: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  eduInst: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  // Contact
  contactCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  contactIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactLabel: { fontSize: 11, color: Colors.textMuted },
  contactValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  contactDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 66 },

  // Map
  mapPlaceholder: {
    backgroundColor: Colors.primaryUltraLight,
    borderRadius: BorderRadius.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapAddress: { fontSize: 13, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: 12,
  },
  directionsBtnText: { fontSize: 13, color: Colors.textWhite, fontWeight: '600', marginLeft: 6 },

  // Schedule
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
  timeRange: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  // Reviews
  ratingSummary: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, marginBottom: 16 },
  ratingBig: { alignItems: 'center' },
  ratingNumber: { fontSize: 48, fontWeight: '800', color: Colors.primary },
  ratingTotal: { fontSize: 13, color: Colors.textMuted, marginTop: 6 },
  reviewCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewAvatarText: { color: Colors.textWhite, fontWeight: '700', fontSize: 14 },
  reviewName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  likeCount: { fontSize: 12, color: Colors.textMuted, marginLeft: 4 },
  noMedia: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', width: '100%' },

  // Media
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mediaItem: { width: (width - 48 - 8) / 2, height: 120, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  mediaImage: { width: '100%', height: '100%' },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom
  bottomBar: {
    flexDirection: 'row',
    padding: Spacing.base,
    paddingBottom: 30,
    backgroundColor: Colors.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.xl,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    height: 52,
  },
  whatsappText: { color: Colors.textWhite, fontWeight: '700', marginLeft: 8 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import Button from '../../components/common/Button';

type RouteParams = { doctorId: string; appointmentId: string };

const STAR_LABELS: Record<number, { ar: string; en: string }> = {
  1: { ar: 'سيء',    en: 'Terrible' },
  2: { ar: 'ضعيف',  en: 'Poor' },
  3: { ar: 'مقبول', en: 'Average' },
  4: { ar: 'جيد',   en: 'Good' },
  5: { ar: 'ممتاز', en: 'Excellent' },
};

interface CategoryRating {
  key: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  value: number;
}

export default function RatingScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId, appointmentId } = (route.params || {}) as RouteParams;

  const doctor = MOCK_DOCTORS.find(d => d.id === doctorId) || MOCK_DOCTORS[0];
  const doctorName = language === 'ar'
    ? `${doctor.titleAr} ${doctor.nameAr}`
    : `${doctor.titleEn} ${doctor.nameEn}`;

  const [overallRating, setOverallRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryRating[]>([
    { key: 'waitTime',    labelAr: 'وقت الانتظار',    labelEn: 'Wait Time',             icon: 'time-outline',       value: 0 },
    { key: 'doctorComm', labelAr: 'تواصل الطبيب',     labelEn: 'Doctor Communication',  icon: 'chatbubble-outline',  value: 0 },
    { key: 'cleanliness',labelAr: 'نظافة العيادة',    labelEn: 'Clinic Cleanliness',    icon: 'sparkles-outline',    value: 0 },
  ]);

  const setCategoryValue = (key: string, val: number) => {
    setCategories(prev => prev.map(c => c.key === key ? { ...c, value: val } : c));
  };

  const activeStar = hoveredStar || overallRating;
  const starLabel = activeStar > 0 ? STAR_LABELS[activeStar] : null;

  const handleSubmit = async () => {
    if (overallRating === 0) {
      Alert.alert(
        isRTL ? 'تنبيه' : 'Warning',
        isRTL ? 'الرجاء اختيار تقييمك العام' : 'Please select your overall rating'
      );
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.successHeader}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color={Colors.textWhite} />
          </View>
        </LinearGradient>
        <View style={styles.successBody}>
          <Text style={[styles.successTitle, isRTL && styles.rtlText]}>{t('rating.thankYou')}</Text>
          <Text style={[styles.successDesc, isRTL && styles.rtlText]}>{t('rating.thankYouDesc')}</Text>

          <View style={styles.successStars}>
            {[1, 2, 3, 4, 5].map(s => (
              <Ionicons
                key={s}
                name={s <= overallRating ? 'star' : 'star-outline'}
                size={32}
                color={s <= overallRating ? Colors.star : Colors.starEmpty}
              />
            ))}
          </View>

          <Button
            title={isRTL ? 'العودة للمواعيد' : 'Back to Appointments'}
            onPress={() => navigation.navigate('MyAppointments')}
            variant="primary"
            fullWidth
            size="lg"
            style={{ marginTop: 32 }}
          />
          <Button
            title={isRTL ? 'عرض ملف الطبيب' : 'View Doctor Profile'}
            onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor.id })}
            variant="outline"
            fullWidth
            size="lg"
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
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
          <Text style={styles.headerTitle}>{t('rating.title')}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Doctor info strip */}
        <View style={[styles.doctorStrip, isRTL && styles.rtlRow]}>
          <Image source={{ uri: doctor.avatar }} style={styles.doctorAvatar} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorSpec}>
              {language === 'ar' ? doctor.specializationAr : doctor.specializationEn}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Overall rating */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('rating.overallExp')}</Text>
          <Text style={[styles.sectionSubtitle, isRTL && styles.rtlText]}>{t('rating.subtitle')}</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setOverallRating(star)}
                onPressIn={() => setHoveredStar(star)}
                onPressOut={() => setHoveredStar(0)}
                style={styles.starBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= activeStar ? 'star' : 'star-outline'}
                  size={44}
                  color={star <= activeStar ? Colors.star : Colors.starEmpty}
                />
              </TouchableOpacity>
            ))}
          </View>

          {starLabel && (
            <View style={styles.starLabelRow}>
              <Text style={styles.starLabel}>
                {language === 'ar' ? starLabel.ar : starLabel.en}
              </Text>
            </View>
          )}
        </View>

        {/* Category ratings */}
        <View style={styles.section}>
          {categories.map(cat => (
            <View key={cat.key} style={[styles.categoryRow, isRTL && styles.rtlRow]}>
              <View style={[styles.categoryLeft, isRTL && styles.rtlRow]}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.icon as any} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.categoryLabel}>
                  {language === 'ar' ? cat.labelAr : cat.labelEn}
                </Text>
              </View>
              <View style={styles.miniStars}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity key={s} onPress={() => setCategoryValue(cat.key, s)}>
                    <Ionicons
                      name={s <= cat.value ? 'star' : 'star-outline'}
                      size={22}
                      color={s <= cat.value ? Colors.star : Colors.starEmpty}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Text review */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('rating.writeReview')}</Text>
          <TextInput
            style={[
              styles.reviewInput,
              isRTL && { textAlign: 'right' },
            ]}
            multiline
            numberOfLines={5}
            placeholder={t('rating.reviewPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={review}
            onChangeText={setReview}
            maxLength={500}
          />
          <Text style={[styles.charCount, isRTL && styles.rtlText]}>
            {review.length}/500
          </Text>
        </View>

        {/* Anonymous toggle */}
        <TouchableOpacity
          style={[styles.anonRow, isRTL && styles.rtlRow]}
          onPress={() => setAnonymous(!anonymous)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, anonymous && styles.checkboxChecked]}>
            {anonymous && <Ionicons name="checkmark" size={14} color={Colors.textWhite} />}
          </View>
          <Text style={[styles.anonLabel, isRTL && { marginLeft: 0, marginRight: 10 }]}>
            {t('rating.anonymous')}
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <Button
          title={t('rating.submitRating')}
          onPress={handleSubmit}
          loading={loading}
          variant="primary"
          fullWidth
          size="lg"
          style={{ marginTop: 8 }}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
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
    alignItems: 'center',
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
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textWhite },

  doctorStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginRight: 12,
  },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: '700', color: Colors.textWhite },
  doctorSpec: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  rtlRow: { flexDirection: 'row-reverse' },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },

  section: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  rtlText: { textAlign: 'right' },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  starBtn: { padding: 4 },
  starLabelRow: { alignItems: 'center', marginTop: 8 },
  starLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.star,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  miniStars: { flexDirection: 'row', gap: 4 },

  reviewInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: Colors.backgroundLight,
  },
  charCount: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 6,
  },

  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  anonLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 10,
    fontWeight: '500',
  },

  // Success state
  successHeader: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBody: {
    flex: 1,
    padding: Spacing.xl,
    paddingTop: 32,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  successStars: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
});

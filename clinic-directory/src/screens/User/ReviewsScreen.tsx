import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function ReviewsScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const doctor = MOCK_DOCTORS.find(d => d.id === route.params?.doctorId) || MOCK_DOCTORS[0];
  const name = language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`;

  const handleSubmit = () => {
    if (newRating === 0) {
      Alert.alert(isRTL ? 'تنبيه' : 'Warning', isRTL ? 'الرجاء اختيار تقييم' : 'Please select a rating');
      return;
    }
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reviews.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.doctorName, isRTL && styles.rtlText]}>{name}</Text>

        {/* Overall Rating */}
        <View style={styles.ratingSummary}>
          <Text style={styles.ratingBig}>{doctor.rating.toFixed(1)}</Text>
          <Rating rating={doctor.rating} size={22} />
          <Text style={styles.ratingCount}>{doctor.reviewCount} {t('reviews.ratingCount')}</Text>
        </View>

        {/* Add Review */}
        {!submitted ? (
          <View style={styles.addReview}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('reviews.addReview')}</Text>
            <Rating rating={newRating} size={36} interactive onRate={setNewRating} />
            <TextInput
              style={[styles.commentInput, isRTL && { textAlign: 'right' }]}
              placeholder={t('reviews.commentPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              numberOfLines={4}
            />
            <Button title={t('reviews.submitReview')} onPress={handleSubmit} fullWidth />
          </View>
        ) : (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
            <Text style={styles.successText}>{t('reviews.reviewSuccess')}</Text>
          </View>
        )}

        {/* Existing reviews */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { marginTop: 20 }]}>
          {isRTL ? 'تقييمات المرضى' : 'Patient Reviews'}
        </Text>
        {doctor.reviews.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{review.userName[0]}</Text>
              </View>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              {review.isVerified && <Badge label={t('reviews.verified')} variant="success" size="sm" />}
            </View>
            <Rating rating={review.rating} size={14} style={{ marginVertical: 6 } as any} />
            <Text style={[styles.reviewText, isRTL && styles.rtlText]}>
              {language === 'ar' && review.commentAr ? review.commentAr : review.comment}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  content: { padding: Spacing.xl, paddingBottom: 40 },
  doctorName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  rtlText: { textAlign: 'right' },
  ratingSummary: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingBig: { fontSize: 48, fontWeight: '800', color: Colors.primary },
  ratingCount: { fontSize: 13, color: Colors.textMuted, marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  addReview: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    height: 100,
    textAlignVertical: 'top',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  successBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.xl,
    marginBottom: 20,
  },
  successText: { fontSize: 16, color: Colors.success, fontWeight: '600', marginTop: 8 },
  reviewCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: Colors.textWhite, fontWeight: '700' },
  reviewMeta: { flex: 1 },
  reviewerName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import Badge from '../../components/common/Badge';

interface Document {
  id: string;
  titleAr: string;
  titleEn: string;
  required: boolean;
  status: 'not_uploaded' | 'uploaded' | 'pending' | 'verified' | 'rejected';
  icon: string;
}

const REQUIRED_DOCS: Document[] = [
  { id: 'license', titleAr: 'الترخيص الطبي', titleEn: 'Medical License', required: true, status: 'verified', icon: 'document-text' },
  { id: 'syndicate', titleAr: 'كرت نقابة الأطباء', titleEn: 'Medical Syndicate Card', required: true, status: 'pending', icon: 'card' },
  { id: 'specialist', titleAr: 'شهادة التخصص', titleEn: 'Specialization Certificate', required: true, status: 'not_uploaded', icon: 'school' },
  { id: 'national_id', titleAr: 'بطاقة الرقم القومي', titleEn: 'National ID', required: true, status: 'uploaded', icon: 'id-card' },
  { id: 'other1', titleAr: 'زمالة أو دكتوراه', titleEn: 'Fellowship / PhD', required: false, status: 'not_uploaded', icon: 'ribbon' },
];

export default function DocumentsScreen() {
  const { t, isRTL, language } = useLanguage();
  const [docs, setDocs] = useState(REQUIRED_DOCS);

  const handleUpload = (docId: string) => {
    Alert.alert(
      isRTL ? 'رفع وثيقة' : 'Upload Document',
      isRTL ? 'اختر طريقة الرفع' : 'Choose upload method',
      [
        { text: isRTL ? 'الكاميرا' : 'Camera', onPress: () => simulateUpload(docId) },
        { text: isRTL ? 'من الجهاز' : 'From Gallery', onPress: () => simulateUpload(docId) },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const simulateUpload = (docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'pending' } : d));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'verified': return { label: isRTL ? 'تم التحقق' : 'Verified', variant: 'success' as const, icon: 'checkmark-circle' };
      case 'pending': return { label: isRTL ? 'قيد المراجعة' : 'Under Review', variant: 'warning' as const, icon: 'time' };
      case 'uploaded': return { label: isRTL ? 'تم الرفع' : 'Uploaded', variant: 'info' as const, icon: 'cloud-upload' };
      case 'rejected': return { label: isRTL ? 'مرفوض' : 'Rejected', variant: 'error' as const, icon: 'close-circle' };
      default: return { label: isRTL ? 'لم يُرفع' : 'Not Uploaded', variant: 'outline' as const, icon: 'alert-circle' };
    }
  };

  const verifiedCount = docs.filter(d => d.status === 'verified').length;
  const totalRequired = docs.filter(d => d.required).length;
  const progress = verifiedCount / totalRequired;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('documents.title')}</Text>
        <Text style={styles.headerDesc}>{t('documents.desc')}</Text>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {isRTL ? `${verifiedCount} من ${totalRequired} وثائق تم التحقق منها` : `${verifiedCount}/${totalRequired} documents verified`}
            </Text>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Verification Badge Preview */}
        {progress === 1 && (
          <View style={styles.verifiedBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.verifiedText}>
              {isRTL ? 'تم الحصول على شارة التحقق!' : 'Verification badge earned!'}
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'الوثائق المطلوبة' : 'Required Documents'}
        </Text>

        {docs.filter(d => d.required).map(doc => {
          const statusInfo = getStatusInfo(doc.status);
          return (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docLeft}>
                <View style={[styles.docIcon, {
                  backgroundColor: doc.status === 'verified' ? Colors.successLight
                    : doc.status === 'pending' ? Colors.warningLight
                    : Colors.primaryUltraLight,
                }]}>
                  <Ionicons
                    name={doc.icon as any}
                    size={24}
                    color={doc.status === 'verified' ? Colors.success
                      : doc.status === 'pending' ? Colors.warning
                      : Colors.primary}
                  />
                </View>
                <View style={styles.docInfo}>
                  <Text style={[styles.docTitle, isRTL && styles.rtlText]}>
                    {language === 'ar' ? doc.titleAr : doc.titleEn}
                  </Text>
                  <Badge label={statusInfo.label} variant={statusInfo.variant} size="sm" style={{ marginTop: 4 }} />
                </View>
              </View>

              {doc.status !== 'verified' ? (
                <TouchableOpacity style={styles.uploadBtn} onPress={() => handleUpload(doc.id)}>
                  <Ionicons name="cloud-upload-outline" size={18} color={Colors.primary} />
                  <Text style={styles.uploadText}>{t('documents.upload')}</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              )}
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { marginTop: 20 }]}>
          {isRTL ? 'وثائق اختيارية' : 'Optional Documents'}
        </Text>

        {docs.filter(d => !d.required).map(doc => {
          const statusInfo = getStatusInfo(doc.status);
          return (
            <View key={doc.id} style={[styles.docCard, styles.optionalCard]}>
              <View style={styles.docLeft}>
                <View style={[styles.docIcon, { backgroundColor: Colors.secondaryUltraLight }]}>
                  <Ionicons name={doc.icon as any} size={24} color={Colors.secondary} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={[styles.docTitle, isRTL && styles.rtlText]}>
                    {language === 'ar' ? doc.titleAr : doc.titleEn}
                  </Text>
                  <Badge label={statusInfo.label} variant={statusInfo.variant} size="sm" style={{ marginTop: 4 }} />
                </View>
              </View>
              <TouchableOpacity style={[styles.uploadBtn, { borderColor: Colors.secondary }]} onPress={() => handleUpload(doc.id)}>
                <Ionicons name="cloud-upload-outline" size={18} color={Colors.secondary} />
                <Text style={[styles.uploadText, { color: Colors.secondary }]}>{t('documents.upload')}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
          <Text style={[styles.infoText, isRTL && styles.rtlText]}>{t('documents.uploadNote')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 24, paddingHorizontal: Spacing.xl, overflow: 'hidden' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textWhite, marginBottom: 4 },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  progressPercent: { fontSize: 14, fontWeight: '700', color: Colors.secondary },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.secondary, borderRadius: 3 },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.lg,
    padding: 10,
    marginTop: 12,
  },
  verifiedText: { fontSize: 13, color: Colors.success, fontWeight: '600', marginLeft: 8 },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  rtlText: { textAlign: 'right' },

  docCard: {
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
  optionalCard: { borderStyle: 'dashed', borderColor: Colors.secondaryLight },
  docLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docInfo: { flex: 1 },
  docTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  uploadText: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginLeft: 4 },

  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginTop: 16,
  },
  infoText: { fontSize: 12, color: Colors.info, marginLeft: 8, flex: 1, lineHeight: 18 },
});

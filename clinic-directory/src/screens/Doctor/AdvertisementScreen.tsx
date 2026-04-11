import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, TextInput, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_ADS } from '../../data/mockData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function AdvertisementScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ titleAr: '', titleEn: '', descAr: '', descEn: '', type: 'banner' });

  const canAdvertise = doctor?.subscriptionPlan === 'premium' || doctor?.subscriptionPlan === 'enterprise';
  const myAds = MOCK_ADS.filter(ad => ad.doctorId === doctor?.id);

  const handleCreate = () => {
    if (!form.titleAr || !form.titleEn) {
      Alert.alert(isRTL ? 'تنبيه' : 'Warning', isRTL ? 'الرجاء إدخال عنوان الإعلان' : 'Please enter ad title');
      return;
    }
    Alert.alert(isRTL ? 'تم إنشاء الإعلان!' : 'Ad Created!', t('advertisement.adSuccess'));
    setShowCreate(false);
  };

  if (!canAdvertise) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>{t('advertisement.title')}</Text>
        </LinearGradient>
        <View style={styles.upgradeContainer}>
          <View style={styles.upgradeIcon}>
            <Ionicons name="megaphone" size={48} color={Colors.secondary} />
          </View>
          <Text style={styles.upgradeTitle}>
            {isRTL ? 'ترقية مطلوبة' : 'Upgrade Required'}
          </Text>
          <Text style={styles.upgradeDesc}>
            {isRTL
              ? 'الإعلانات متاحة للخطة المميزة والمؤسسية فقط'
              : 'Advertisements are available for Premium and Enterprise plans only'}
          </Text>
          <Button
            title={isRTL ? 'ترقية الاشتراك' : 'Upgrade Subscription'}
            onPress={() => {}}
            variant="gold"
            size="lg"
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('advertisement.title')}</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(!showCreate)}>
            <Ionicons name="add" size={20} color={Colors.textWhite} />
            <Text style={styles.createBtnText}>{t('advertisement.createAd')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.adStats}>
          <View style={styles.adStat}>
            <Text style={styles.adStatValue}>{myAds.reduce((s, a) => s + a.views, 0)}</Text>
            <Text style={styles.adStatLabel}>{t('advertisement.adViews')}</Text>
          </View>
          <View style={styles.adStatDivider} />
          <View style={styles.adStat}>
            <Text style={styles.adStatValue}>{myAds.reduce((s, a) => s + a.clicks, 0)}</Text>
            <Text style={styles.adStatLabel}>{t('advertisement.adClicks')}</Text>
          </View>
          <View style={styles.adStatDivider} />
          <View style={styles.adStat}>
            <Text style={styles.adStatValue}>{myAds.filter(a => a.isActive).length}</Text>
            <Text style={styles.adStatLabel}>{isRTL ? 'نشطة' : 'Active'}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Create Form */}
        {showCreate && (
          <View style={styles.createForm}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('advertisement.createAd')}</Text>

            {/* Ad Type */}
            <Text style={[styles.fieldLabel, isRTL && styles.rtlText]}>{t('advertisement.adType')}</Text>
            <View style={styles.typeRow}>
              {(['banner', 'featured', 'spotlight'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, form.type === type && styles.typeChipActive]}
                  onPress={() => setForm(prev => ({ ...prev, type }))}
                >
                  <Text style={[styles.typeChipText, form.type === type && styles.typeChipTextActive]}>
                    {type === 'banner' ? t('advertisement.banner')
                      : type === 'featured' ? t('advertisement.featured')
                      : t('advertisement.spotlight')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label={t('advertisement.adTitleAr')}
              value={form.titleAr}
              onChangeText={v => setForm(prev => ({ ...prev, titleAr: v }))}
              required
              leftIcon={<Ionicons name="text-outline" size={18} color={Colors.textMuted} />}
            />
            <Input
              label={t('advertisement.adTitleEn')}
              value={form.titleEn}
              onChangeText={v => setForm(prev => ({ ...prev, titleEn: v }))}
              required
              leftIcon={<Ionicons name="text-outline" size={18} color={Colors.textMuted} />}
            />

            {/* Image Upload */}
            <TouchableOpacity style={styles.imageUpload}>
              <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.imageUploadText}>{t('advertisement.adImage')}</Text>
            </TouchableOpacity>

            <View style={styles.formActions}>
              <Button title={t('common.cancel')} onPress={() => setShowCreate(false)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
              <Button title={t('advertisement.createAd')} onPress={handleCreate} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {/* My Ads */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('advertisement.myAds')}</Text>

        {myAds.length > 0 ? myAds.map(ad => (
          <View key={ad.id} style={styles.adCard}>
            <Image source={{ uri: ad.imageUrl }} style={styles.adImage} />
            <View style={styles.adInfo}>
              <View style={styles.adHeader}>
                <Text style={[styles.adTitle, isRTL && styles.rtlText]} numberOfLines={1}>
                  {language === 'ar' ? ad.titleAr : ad.title}
                </Text>
                <Badge
                  label={ad.isActive ? t('advertisement.active') : t('advertisement.inactive')}
                  variant={ad.isActive ? 'success' : 'error'}
                  size="sm"
                />
              </View>
              <Text style={[styles.adDesc, isRTL && styles.rtlText]} numberOfLines={2}>
                {language === 'ar' ? ad.descriptionAr : ad.description}
              </Text>
              <View style={styles.adMeta}>
                <View style={styles.adMetaItem}>
                  <Ionicons name="eye-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.adMetaText}>{ad.views.toLocaleString()}</Text>
                </View>
                <View style={styles.adMetaItem}>
                  <Ionicons name="hand-left-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.adMetaText}>{ad.clicks}</Text>
                </View>
                <Badge label={ad.type} variant="primary" size="sm" />
              </View>
            </View>
          </View>
        )) : (
          <View style={styles.noAds}>
            <Ionicons name="megaphone-outline" size={52} color={Colors.border} />
            <Text style={styles.noAdsText}>{t('advertisement.noAds')}</Text>
            <Text style={styles.noAdsDesc}>{t('advertisement.createAdDesc')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 20, paddingHorizontal: Spacing.xl, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textWhite },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  createBtnText: { fontSize: 13, color: Colors.textWhite, fontWeight: '700', marginLeft: 4 },
  adStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 14,
  },
  adStat: { flex: 1, alignItems: 'center' },
  adStatValue: { fontSize: 20, fontWeight: '800', color: Colors.secondary },
  adStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  adStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  rtlText: { textAlign: 'right' },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 8 },

  createForm: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.base },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  typeChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  typeChipText: { fontSize: 12, color: Colors.textMuted },
  typeChipTextActive: { color: Colors.primary, fontWeight: '600' },
  imageUpload: {
    height: 120,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    marginBottom: Spacing.base,
  },
  imageUploadText: { fontSize: 13, color: Colors.textMuted, marginTop: 8 },
  formActions: { flexDirection: 'row', marginTop: 8 },

  adCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  adImage: { width: 90, height: 110, backgroundColor: Colors.borderLight },
  adInfo: { flex: 1, padding: 12 },
  adHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  adTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  adDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  adMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adMetaItem: { flexDirection: 'row', alignItems: 'center' },
  adMetaText: { fontSize: 12, color: Colors.textMuted, marginLeft: 3 },

  upgradeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  upgradeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  upgradeTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10 },
  upgradeDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  noAds: { alignItems: 'center', paddingTop: 40 },
  noAdsText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginTop: 16 },
  noAdsDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 8, textAlign: 'center' },
});

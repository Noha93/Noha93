import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { SPECIALIZATIONS } from '../../data/mockData';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ProfileEditScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nameAr: doctor?.nameAr || '',
    nameEn: doctor?.nameEn || '',
    aboutAr: doctor?.aboutAr || '',
    aboutEn: doctor?.about || '',
    phone: doctor?.contact.phone || '',
    mobile: doctor?.contact.mobile || '',
    whatsapp: doctor?.contact.whatsapp || '',
    email: doctor?.contact.email || '',
    street: doctor?.address.street || '',
    area: doctor?.address.area || '',
    city: doctor?.address.city || '',
    consultationFee: String(doctor?.consultationFee || ''),
    experience: String(doctor?.experience || ''),
    specialization: doctor?.specialization || '',
  });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    Alert.alert(isRTL ? 'تم الحفظ' : 'Saved', t('doctorProfile.changesSaved'));
  };

  const sections = [
    {
      title: t('doctorProfile.basicInfo'),
      icon: 'person-outline',
      fields: [
        { key: 'nameAr', label: t('doctorProfile.nameAr'), icon: 'text-outline' },
        { key: 'nameEn', label: t('doctorProfile.nameEn'), icon: 'text-outline' },
        { key: 'experience', label: t('doctorProfile.experience'), icon: 'time-outline', keyboardType: 'numeric' },
        { key: 'consultationFee', label: t('doctorProfile.consultationFee'), icon: 'cash-outline', keyboardType: 'numeric' },
      ],
    },
    {
      title: t('doctorProfile.contactInfo'),
      icon: 'call-outline',
      fields: [
        { key: 'phone', label: t('doctorProfile.landline'), icon: 'call-outline', keyboardType: 'phone-pad' },
        { key: 'mobile', label: t('doctorProfile.mobile'), icon: 'phone-portrait-outline', keyboardType: 'phone-pad' },
        { key: 'whatsapp', label: t('doctorProfile.whatsapp'), icon: 'logo-whatsapp', keyboardType: 'phone-pad' },
        { key: 'email', label: t('doctorProfile.email'), icon: 'mail-outline', keyboardType: 'email-address' },
      ],
    },
    {
      title: t('doctorProfile.clinicAddress'),
      icon: 'location-outline',
      fields: [
        { key: 'street', label: t('doctorProfile.street'), icon: 'home-outline' },
        { key: 'area', label: t('doctorProfile.area'), icon: 'map-outline' },
        { key: 'city', label: t('doctorProfile.city'), icon: 'business-outline' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {doctor?.nameAr[0] || 'D'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editPhotoBtn}>
              <Ionicons name="camera" size={14} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>{t('doctorProfile.title')}</Text>
        </View>

        {/* Quick Nav */}
        <View style={styles.quickNav}>
          {[
            { icon: 'calendar-outline', label: isRTL ? 'الجدول' : 'Schedule', screen: 'WeeklySchedule' },
            { icon: 'images-outline', label: isRTL ? 'الصور' : 'Photos', screen: 'ClinicPhotos' },
            { icon: 'megaphone-outline', label: isRTL ? 'إعلان' : 'Ads', screen: 'Advertisement' },
            { icon: 'eye-outline', label: isRTL ? 'معاينة' : 'Preview', screen: 'ProfilePreview' },
            { icon: 'settings-outline', label: isRTL ? 'إعدادات' : 'Settings', screen: 'DoctorSettings' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon as any} size={20} color={Colors.secondary} />
              <Text style={styles.quickNavLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Specialization */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="medical-outline" size={18} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>{t('doctorProfile.specialization')}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SPECIALIZATIONS.map(spec => (
              <TouchableOpacity
                key={spec.id}
                style={[
                  styles.specChip,
                  form.specialization === spec.id && styles.specChipActive,
                ]}
                onPress={() => set('specialization', spec.id)}
              >
                <Text style={[styles.specText, form.specialization === spec.id && styles.specTextActive]}>
                  {language === 'ar' ? spec.nameAr : spec.nameEn}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Form Sections */}
        {sections.map((section, si) => (
          <View key={si} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name={section.icon as any} size={18} color={Colors.primary} />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>{section.title}</Text>
            </View>
            {section.fields.map((field, fi) => (
              <Input
                key={fi}
                label={field.label}
                value={(form as any)[field.key]}
                onChangeText={v => set(field.key, v)}
                keyboardType={(field as any).keyboardType || 'default'}
                leftIcon={<Ionicons name={field.icon as any} size={18} color={Colors.textMuted} />}
              />
            ))}
          </View>
        ))}

        {/* About Ar */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctorProfile.aboutAr')}</Text>
          <View style={styles.textareaWrapper}>
            <Input
              value={form.aboutAr}
              onChangeText={v => set('aboutAr', v)}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('doctorProfile.aboutEn')}</Text>
          <Input
            value={form.aboutEn}
            onChangeText={v => set('aboutEn', v)}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>

        <Button
          title={t('doctorProfile.saveChanges')}
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
          style={{ marginBottom: 40 }}
        />
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
  headerContent: { alignItems: 'center', marginBottom: 16 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: Colors.textWhite },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 12,
  },
  quickNavItem: { alignItems: 'center' },
  quickNavLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },

  sectionCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  rtlText: { textAlign: 'right' },
  textareaWrapper: { marginBottom: Spacing.base },

  specChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.backgroundWhite,
  },
  specChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  specText: { fontSize: 12, color: Colors.textSecondary },
  specTextActive: { color: Colors.primary, fontWeight: '600' },
});

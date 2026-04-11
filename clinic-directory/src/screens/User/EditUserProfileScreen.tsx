import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EditUserProfileScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    nameAr: user?.nameAr || '',
    nameEn: user?.nameEn || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
  });
  const [saving, setSaving] = useState(false);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.nameAr || !form.nameEn) {
      Alert.alert(isRTL ? 'تنبيه' : 'Warning', isRTL ? 'الرجاء إدخال الاسم' : 'Please enter your name');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    Alert.alert(isRTL ? 'تم الحفظ' : 'Saved', isRTL ? 'تم تحديث بياناتك بنجاح' : 'Profile updated successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{form.nameAr ? form.nameAr[0] : 'U'}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera-outline" size={16} color={Colors.primary} />
            <Text style={styles.changePhotoText}>{isRTL ? 'تغيير الصورة' : 'Change Photo'}</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
          </Text>

          <Input
            label={isRTL ? 'الاسم بالعربية' : 'Name in Arabic'}
            value={form.nameAr}
            onChangeText={v => update('nameAr', v)}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textMuted} />}
            required
          />
          <Input
            label={isRTL ? 'الاسم بالإنجليزية' : 'Name in English'}
            value={form.nameEn}
            onChangeText={v => update('nameEn', v)}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textMuted} />}
            required
          />
          <Input
            label={isRTL ? 'البريد الإلكتروني' : 'Email'}
            value={form.email}
            onChangeText={v => update('email', v)}
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={isRTL ? 'رقم الجوال' : 'Phone'}
            value={form.phone}
            onChangeText={v => update('phone', v)}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={isRTL ? 'تاريخ الميلاد' : 'Date of Birth'}
            value={form.dateOfBirth}
            onChangeText={v => update('dateOfBirth', v)}
            placeholder="YYYY-MM-DD"
            leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'الجنس' : 'Gender'}
          </Text>
          <View style={styles.chipsRow}>
            {(['male', 'female'] as const).map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, form.gender === g && styles.chipActive]}
                onPress={() => update('gender', g)}
              >
                <Ionicons
                  name={g === 'male' ? 'male' : 'female'}
                  size={16}
                  color={form.gender === g ? Colors.primary : Colors.textMuted}
                />
                <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>
                  {g === 'male' ? (isRTL ? 'ذكر' : 'Male') : (isRTL ? 'أنثى' : 'Female')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Blood Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'فصيلة الدم' : 'Blood Type'}
          </Text>
          <View style={styles.bloodRow}>
            {BLOOD_TYPES.map(bt => (
              <TouchableOpacity
                key={bt}
                style={[styles.bloodChip, form.bloodType === bt && styles.bloodChipActive]}
                onPress={() => update('bloodType', bt)}
              >
                <Text style={[styles.bloodChipText, form.bloodType === bt && styles.bloodChipTextActive]}>
                  {bt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={isRTL ? 'حفظ التغييرات' : 'Save Changes'}
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
          style={{ marginTop: 8, marginBottom: 40 }}
        />
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
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    marginBottom: 10,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: Colors.textWhite },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryUltraLight,
  },
  changePhotoText: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginLeft: 6 },

  section: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  rtlText: { textAlign: 'right' },

  chipsRow: { flexDirection: 'row', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  chipText: { fontSize: 14, color: Colors.textMuted, marginLeft: 6 },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },

  bloodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bloodChip: {
    width: 60,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  bloodChipActive: { borderColor: Colors.error, backgroundColor: Colors.errorLight },
  bloodChipText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  bloodChipTextActive: { color: Colors.error },
});

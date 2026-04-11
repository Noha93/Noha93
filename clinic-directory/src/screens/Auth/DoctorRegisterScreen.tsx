import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { SPECIALIZATIONS } from '../../data/mockData';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorRegister'>;
};

export default function DoctorRegisterScreen({ navigation }: Props) {
  const { t, isRTL, language } = useLanguage();
  const { registerDoctor } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    syndicateNumber: '', specialization: '', experience: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    setLoading(true);
    await registerDoctor({
      nameAr: form.name, nameEn: form.name,
      titleAr: 'دكتور', titleEn: 'Dr.',
      specialization: form.specialization as any,
      experience: parseInt(form.experience) || 0,
    });
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDark, Colors.secondaryDark]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('auth.doctorRegister')}</Text>
        <Text style={styles.subtitle}>{isRTL ? `الخطوة ${step} من 2` : `Step ${step} of 2`}</Text>
        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
        </View>
      </LinearGradient>

      <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={styles.form}>
        {step === 1 ? (
          <>
            <Text style={[styles.stepTitle, isRTL && { textAlign: 'right' }]}>
              {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
            </Text>
            <Input label={isRTL ? 'الاسم الكامل' : 'Full Name'} value={form.name}
              onChangeText={v => set('name', v)} required
              leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />} />
            <Input label={t('auth.email')} value={form.email} onChangeText={v => set('email', v)}
              keyboardType="email-address" autoCapitalize="none" required
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />} />
            <Input label={t('auth.phone')} value={form.phone} onChangeText={v => set('phone', v)}
              keyboardType="phone-pad" required
              leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textMuted} />} />
            <Input label={t('auth.password')} value={form.password} onChangeText={v => set('password', v)}
              isPassword required
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />} />
            <Button title={isRTL ? 'التالي' : 'Next'} onPress={() => setStep(2)} fullWidth size="lg"
              variant="gold" style={{ marginTop: Spacing.sm }} />
          </>
        ) : (
          <>
            <Text style={[styles.stepTitle, isRTL && { textAlign: 'right' }]}>
              {isRTL ? 'المعلومات المهنية' : 'Professional Information'}
            </Text>
            <Input label={isRTL ? 'رقم نقابة الأطباء' : 'Medical Syndicate Number'}
              value={form.syndicateNumber} onChangeText={v => set('syndicateNumber', v)} required
              leftIcon={<Ionicons name="id-card-outline" size={20} color={Colors.textMuted} />} />

            {/* Specialization Picker */}
            <Text style={[styles.pickerLabel, isRTL && { textAlign: 'right' }]}>
              {t('auth.specialization')} *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specList}>
              {SPECIALIZATIONS.map(spec => (
                <TouchableOpacity
                  key={spec.id}
                  style={[styles.specChip, form.specialization === spec.id && styles.specChipActive]}
                  onPress={() => set('specialization', spec.id)}
                >
                  <Text style={[styles.specText, form.specialization === spec.id && styles.specTextActive]}>
                    {language === 'ar' ? spec.nameAr : spec.nameEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input label={isRTL ? 'سنوات الخبرة' : 'Years of Experience'}
              value={form.experience} onChangeText={v => set('experience', v)}
              keyboardType="numeric" required
              leftIcon={<Ionicons name="time-outline" size={20} color={Colors.textMuted} />} />

            <View style={styles.termsBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
              <Text style={styles.termsText}>
                {isRTL
                  ? 'سيتم مراجعة وثائقك من قبل فريقنا قبل تفعيل الحساب'
                  : 'Your documents will be reviewed by our team before account activation'}
              </Text>
            </View>

            <Button title={isRTL ? 'إنشاء الحساب' : 'Create Account'} onPress={handleRegister}
              loading={loading} fullWidth size="lg" variant="gold" style={{ marginTop: Spacing.sm }} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 55, paddingBottom: 32, alignItems: 'center', overflow: 'hidden' },
  backBtn: { position: 'absolute', top: 52, left: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textWhite, marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  progressBg: {
    width: '70%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  form: { padding: Spacing.xl, paddingTop: 32 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 },
  pickerLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 8 },
  specList: { marginBottom: Spacing.base },
  specChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.backgroundWhite,
  },
  specChipActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryUltraLight,
  },
  specText: { fontSize: 13, color: Colors.textSecondary },
  specTextActive: { color: Colors.secondaryDark, fontWeight: '600' },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  termsText: { fontSize: 12, color: Colors.success, marginLeft: 8, flex: 1, lineHeight: 18 },
});

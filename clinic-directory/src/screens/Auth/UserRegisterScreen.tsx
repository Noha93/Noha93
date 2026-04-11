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
import { Spacing } from '../../constants/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserRegister'>;
};

export default function UserRegisterScreen({ navigation }: Props) {
  const { t, isRTL } = useLanguage();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = isRTL ? 'الاسم مطلوب' : 'Name is required';
    if (!form.email) e.email = t('auth.emailRequired');
    if (!form.phone) e.phone = isRTL ? 'الهاتف مطلوب' : 'Phone is required';
    if (!form.password) e.password = t('auth.passwordRequired');
    else if (form.password.length < 6) e.password = t('auth.passwordMin');
    if (form.password !== form.confirmPassword) e.confirmPassword = t('auth.passwordMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await registerUser({ nameAr: form.name, nameEn: form.name, email: form.email, phone: form.phone });
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('auth.register')}</Text>
        <Text style={styles.subtitle}>{isRTL ? 'أنشئ حسابك الآن' : 'Create your account'}</Text>
      </LinearGradient>

      <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={styles.form}>
        <Input label={t('auth.name')} value={form.name} onChangeText={v => set('name', v)}
          placeholder={isRTL ? 'الاسم الكامل' : 'Full Name'} required error={errors.name}
          leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />} />

        <Input label={t('auth.email')} value={form.email} onChangeText={v => set('email', v)}
          placeholder={t('auth.emailPlaceholder')} keyboardType="email-address" autoCapitalize="none"
          required error={errors.email}
          leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />} />

        <Input label={t('auth.phone')} value={form.phone} onChangeText={v => set('phone', v)}
          placeholder={isRTL ? '010-XXXXXXXX' : '010-XXXXXXXX'} keyboardType="phone-pad"
          required error={errors.phone}
          leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textMuted} />} />

        <Input label={t('auth.password')} value={form.password} onChangeText={v => set('password', v)}
          placeholder={t('auth.passwordPlaceholder')} isPassword required error={errors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />} />

        <Input label={t('auth.confirmPassword')} value={form.confirmPassword}
          onChangeText={v => set('confirmPassword', v)}
          placeholder={t('auth.passwordPlaceholder')} isPassword required error={errors.confirmPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />} />

        <Button title={t('auth.register')} onPress={handleRegister} loading={loading} fullWidth size="lg" style={{ marginTop: Spacing.sm }} />

        <View style={styles.loginRow}>
          <Text style={styles.haveAccText}>{t('auth.haveAccount')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}> {t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 55, paddingBottom: 32, alignItems: 'center', overflow: 'hidden' },
  backBtn: { position: 'absolute', top: 52, left: 20 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textWhite, marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  form: { padding: Spacing.xl, paddingTop: 32 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  haveAccText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});

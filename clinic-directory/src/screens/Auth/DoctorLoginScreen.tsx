import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorLogin'>;
};

export default function DoctorLoginScreen({ navigation }: Props) {
  const { t, isRTL } = useLanguage();
  const { loginAsDoctor } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.emailRequired'));
      return;
    }
    setLoading(true);
    const success = await loginAsDoctor(email, password);
    setLoading(false);
    if (!success) Alert.alert(t('common.error'), 'Invalid credentials');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.primaryDark, Colors.secondaryDark]}
        style={styles.headerGrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="medkit" size={40} color={Colors.textWhite} />
          </View>
          <Text style={styles.headerTitle}>{t('auth.doctorLogin')}</Text>
          <Text style={styles.headerSubtitle}>
            {isRTL ? 'ادخل إلى لوحة التحكم' : 'Access your dashboard'}
          </Text>
        </View>

        {/* Gold accent */}
        <LinearGradient
          colors={['transparent', Colors.secondary + '30']}
          style={styles.goldAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          required
          leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
        />

        <Input
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.passwordPlaceholder')}
          isPassword
          required
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />}
        />

        <TouchableOpacity style={[styles.forgotBtn, isRTL && styles.rtlAlign]}>
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={[styles.demoHint, { backgroundColor: Colors.secondaryUltraLight }]}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.secondaryDark} />
          <Text style={[styles.demoText, { color: Colors.secondaryDark }]}>
            {isRTL ? 'للتجربة: اكتب أي بريد وكلمة مرور' : 'Demo: Enter any email & password'}
          </Text>
        </View>

        <Button
          title={t('auth.login')}
          onPress={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
          variant="gold"
          style={{ marginTop: Spacing.sm }}
        />

        <View style={styles.registerRow}>
          <Text style={styles.noAccountText}>{t('auth.noAccount')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorRegister')}>
            <Text style={styles.registerLink}> {t('auth.doctorRegister')}</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          <Text style={[styles.benefitsTitle, isRTL && { textAlign: 'right' }]}>
            {isRTL ? 'مميزات الاشتراك:' : 'Subscription Benefits:'}
          </Text>
          {[
            { icon: 'stats-chart', text: isRTL ? 'لوحة إحصاءات متكاملة' : 'Full statistics dashboard' },
            { icon: 'calendar', text: isRTL ? 'إدارة المواعيد' : 'Appointment management' },
            { icon: 'megaphone', text: isRTL ? 'إنشاء إعلانات' : 'Create advertisements' },
            { icon: 'shield-checkmark', text: isRTL ? 'التحقق من الهوية' : 'Identity verification' },
          ].map((item, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={item.icon as any} size={16} color={Colors.secondary} />
              </View>
              <Text style={styles.benefitText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerGrad: {
    paddingTop: 50,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  goldAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  form: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContent: {
    padding: Spacing.xl,
    paddingTop: 32,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.base,
  },
  rtlAlign: {
    alignSelf: 'flex-start',
  },
  forgotText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  demoText: {
    fontSize: 12,
    marginLeft: 8,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  noAccountText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '700',
  },
  benefits: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  rtlText: { textAlign: 'right' },
});

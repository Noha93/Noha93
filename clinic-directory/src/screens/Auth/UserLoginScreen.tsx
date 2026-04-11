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
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserLogin'>;
};

export default function UserLoginScreen({ navigation }: Props) {
  const { t, isRTL } = useLanguage();
  const { loginAsUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = t('auth.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('auth.invalidEmail');
    if (!password) newErrors.password = t('auth.passwordRequired');
    else if (password.length < 6) newErrors.password = t('auth.passwordMin');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await loginAsUser(email, password);
    setLoading(false);
    if (!success) {
      Alert.alert(t('common.error'), 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.headerGrad}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={40} color={Colors.textWhite} />
          </View>
          <Text style={styles.headerTitle}>{t('auth.login')}</Text>
          <Text style={styles.headerSubtitle}>
            {isRTL ? 'مرحباً بعودتك!' : 'Welcome back!'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>

        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          required
          leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
        />

        <Input
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.passwordPlaceholder')}
          isPassword
          error={errors.password}
          required
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />}
        />

        <TouchableOpacity style={[styles.forgotBtn, isRTL && styles.rtlForgot]}>
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={styles.demoHint}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
          <Text style={styles.demoText}>
            {isRTL ? 'للتجربة: اكتب أي بريد وكلمة مرور' : 'Demo: Enter any email & password'}
          </Text>
        </View>

        <Button
          title={t('auth.login')}
          onPress={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.sm }}
        />

        <View style={styles.registerRow}>
          <Text style={styles.noAccountText}>{t('auth.noAccount')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserRegister')}>
            <Text style={styles.registerLink}> {t('auth.register')}</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social login */}
        <View style={styles.socialRow}>
          {['logo-google', 'logo-facebook', 'logo-apple'].map((icon, i) => (
            <TouchableOpacity key={i} style={styles.socialBtn}>
              <Ionicons name={icon as any} size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
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
  rtlForgot: {
    alignSelf: 'flex-start',
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  demoText: {
    fontSize: 12,
    color: Colors.info,
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
    color: Colors.primary,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: Colors.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
    marginHorizontal: 8,
  },
  rtlText: { textAlign: 'right' },
});

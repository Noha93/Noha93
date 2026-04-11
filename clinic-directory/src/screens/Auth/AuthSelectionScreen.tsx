import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AuthSelection'>;
};

export default function AuthSelectionScreen({ navigation }: Props) {
  const { t, isRTL } = useLanguage();

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
        <View style={styles.decor1} />
        <View style={styles.decor2} />
        <View style={styles.logo}>
          <View style={styles.crossV} />
          <View style={styles.crossH} />
        </View>
        <Text style={styles.appName}>دليل العيادات</Text>
        <Text style={styles.appNameEn}>Clinic Directory</Text>
        <Text style={styles.question}>{t('auth.whoAreYou')}</Text>
        <Text style={styles.subtitle}>{t('auth.selectRole')}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Patient Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('UserLogin')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.primaryUltraLight, Colors.backgroundWhite]}
            style={styles.roleCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.roleIcon, { backgroundColor: Colors.primary + '15' }]}>
              <Ionicons name="person" size={36} color={Colors.primary} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleTitle, isRTL && styles.rtlText]}>{t('auth.iAmPatient')}</Text>
              <Text style={[styles.roleDesc, isRTL && styles.rtlText]}>{t('auth.patientDesc')}</Text>
              <View style={styles.roleFeatures}>
                {[
                  isRTL ? 'ابحث عن أطباء' : 'Find Doctors',
                  isRTL ? 'احجز مواعيد' : 'Book Appointments',
                  isRTL ? 'آراء المرضى' : 'Patient Reviews',
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={24} color={Colors.primary} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Doctor Card */}
        <TouchableOpacity
          style={[styles.roleCard, styles.doctorCard]}
          onPress={() => navigation.navigate('DoctorLogin')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.secondaryUltraLight, Colors.backgroundWhite]}
            style={styles.roleCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.roleIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Ionicons name="medkit" size={36} color={Colors.secondaryDark} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleTitle, { color: Colors.secondaryDark }, isRTL && styles.rtlText]}>
                {t('auth.iAmDoctor')}
              </Text>
              <Text style={[styles.roleDesc, isRTL && styles.rtlText]}>{t('auth.doctorDesc')}</Text>
              <View style={styles.roleFeatures}>
                {[
                  isRTL ? 'لوحة تحكم متكاملة' : 'Full Dashboard',
                  isRTL ? 'إدارة المواعيد' : 'Manage Appointments',
                  isRTL ? 'إعلانات مدفوعة' : 'Paid Advertisements',
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={24} color={Colors.secondaryDark} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          {isRTL
            ? 'بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية'
            : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decor2: {
    position: 'absolute',
    bottom: -30,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  logo: {
    width: 52,
    height: 52,
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  crossV: { position: 'absolute', width: 8, height: 32, backgroundColor: Colors.primaryDark, borderRadius: 4 },
  crossH: { position: 'absolute', width: 32, height: 8, backgroundColor: Colors.primaryDark, borderRadius: 4 },
  appName: { fontSize: 22, fontWeight: '800', color: Colors.textWhite, marginBottom: 2 },
  appNameEn: { fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 20 },
  question: { fontSize: 24, fontWeight: '700', color: Colors.textWhite, marginBottom: 6 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  content: { flex: 1 },
  contentInner: { padding: Spacing.xl, paddingTop: 28 },

  roleCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.lg,
  },
  doctorCard: {
    borderColor: Colors.secondaryLight,
  },
  roleCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  roleInfo: { flex: 1 },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  roleFeatures: {},
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  rtlText: { textAlign: 'right' },
  terms: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 17,
  },
});

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Linking, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '100';

const FEATURES = [
  { icon: 'search', ar: 'البحث عن الأطباء والتخصصات', en: 'Search doctors and specialties' },
  { icon: 'calendar', ar: 'حجز المواعيد بسهولة', en: 'Easy appointment booking' },
  { icon: 'location', ar: 'إيجاد الأطباء القريبين', en: 'Find nearby doctors' },
  { icon: 'star', ar: 'تقييمات ومراجعات المرضى', en: 'Patient ratings and reviews' },
  { icon: 'business', ar: 'المستشفيات والمراكز الطبية', en: 'Hospitals and medical centers' },
  { icon: 'language', ar: 'دعم العربية والإنجليزية', en: 'Arabic and English support' },
];

const LINKS = [
  { icon: 'globe-outline', ar: 'الموقع الرسمي', en: 'Website', url: 'https://clinicdir.com' },
  { icon: 'shield-checkmark-outline', ar: 'سياسة الخصوصية', en: 'Privacy Policy', url: 'https://clinicdir.com/privacy' },
  { icon: 'document-text-outline', ar: 'شروط الاستخدام', en: 'Terms of Service', url: 'https://clinicdir.com/terms' },
  { icon: 'star-outline', ar: 'قيّم التطبيق', en: 'Rate the App', url: 'https://play.google.com' },
];

export default function AboutAppScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'عن التطبيق' : 'About the App'}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* App Identity */}
        <View style={styles.appIdentity}>
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            style={styles.appLogo}
          >
            <Text style={styles.appLogoIcon}>+</Text>
          </LinearGradient>
          <Text style={styles.appName}>{isRTL ? 'دليل العيادات' : 'Clinic Directory'}</Text>
          <Text style={styles.appTagline}>
            {isRTL ? 'دليلك الصحي الشامل' : 'Your Complete Health Guide'}
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v{APP_VERSION} ({BUILD_NUMBER})</Text>
          </View>
        </View>

        {/* About Text */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'عن دليل العيادات' : 'About Clinic Directory'}
          </Text>
          <Text style={[styles.aboutText, isRTL && styles.rtlText]}>
            {isRTL
              ? 'دليل العيادات هو تطبيق متكامل يساعدك على إيجاد أفضل الأطباء والمراكز الطبية في منطقتك. يوفر التطبيق تفاصيل شاملة عن كل طبيب تشمل تخصصه وتعليمه وموقع عيادته ومواعيد عمله وتقييمات المرضى.'
              : 'Clinic Directory is a comprehensive app that helps you find the best doctors and medical centers in your area. It provides complete details about each doctor including their specialty, education, clinic location, working hours, and patient reviews.'}
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'المميزات الرئيسية' : 'Key Features'}
          </Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon as any} size={18} color={Colors.primary} />
              </View>
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {language === 'ar' ? f.ar : f.en}
              </Text>
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'روابط مفيدة' : 'Useful Links'}
          </Text>
          {LINKS.map((link, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity
                style={[styles.linkRow, isRTL && styles.rtlRow]}
                onPress={() => Linking.openURL(link.url)}
              >
                <View style={styles.linkIcon}>
                  <Ionicons name={link.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.linkText, { flex: 1 }]}>
                  {language === 'ar' ? link.ar : link.en}
                </Text>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
              </TouchableOpacity>
              {i < LINKS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Tech Stack Badge */}
        <View style={styles.techRow}>
          <Text style={styles.techLabel}>{isRTL ? 'مبني بـ' : 'Built with'}</Text>
          <View style={styles.techBadge}><Text style={styles.techBadgeText}>React Native</Text></View>
          <View style={styles.techBadge}><Text style={styles.techBadgeText}>Expo</Text></View>
          <View style={styles.techBadge}><Text style={styles.techBadgeText}>TypeScript</Text></View>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2024 {isRTL ? 'دليل العيادات. جميع الحقوق محفوظة.' : 'Clinic Directory. All rights reserved.'}
        </Text>

        <View style={{ height: 40 }} />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  content: { padding: Spacing.xl },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },

  appIdentity: { alignItems: 'center', marginBottom: 24 },
  appLogo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...Shadow.md,
  },
  appLogoIcon: { fontSize: 48, fontWeight: '900', color: Colors.secondary },
  appName: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  appTagline: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  versionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryUltraLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  versionText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  card: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: { fontSize: 14, color: Colors.textSecondary, flex: 1 },

  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkText: { fontSize: 14, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 48 },

  techRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  techLabel: { fontSize: 12, color: Colors.textMuted },
  techBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  techBadgeText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  copyright: { textAlign: 'center', fontSize: 12, color: Colors.textMuted },
});

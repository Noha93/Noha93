import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon, type IconName } from '../src/components/AppIcon';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { useTheme, type ThemeMode } from '../src/context/ThemeContext';
import { useLocale, rowDir, type Dir, type Locale } from '../src/context/LocaleContext';
import { useMedical } from '../src/context/MedicalContext';
import { radius, spacing, tint, type ThemeColors } from '../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, scheme, setMode } = useTheme();
  const { locale, dir, t, setLocale } = useLocale();
  const { profile } = useMedical();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  const toggleTheme = () => setMode(scheme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLocale(locale === 'ar' ? 'en' : 'ar');

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('settings.title')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.push('/(tabs)/medical')} style={[styles.profileCard, { flexDirection: rowDir(dir) }]}>
          <View style={styles.profileAvatar}>
            <AppText weight="bodyBold" color="#fff" style={styles.profileAvatarText}>
              {(profile.name || t('medical.namePlaceholder')).trim().slice(0, 2)}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bodyBold" style={styles.profileName}>{profile.name || t('medical.namePlaceholder')}</AppText>
            <AppText color={colors.textMuted} style={styles.profileSub}>{t('settings.personalAccount')}</AppText>
          </View>
          <AppText weight="bodyBold" color={colors.primary} style={styles.profileLink}>{t('medical.header')}</AppText>
        </Pressable>

        <Group title={t('settings.preferences')} colors={colors}>
          <Toggle icon="globe-outline" color={colors.police} label={t('settings.language')} value={locale === 'ar' ? t('settings.languageArabic') : t('settings.languageEnglish')} onPress={toggleLang} dir={dir} colors={colors} />
          <Toggle icon={scheme === 'dark' ? 'moon-outline' : 'sunny-outline'} color={colors.navy} label={t('settings.appearance')} value={scheme === 'dark' ? t('settings.themeDark') : t('settings.themeLight')} onPress={toggleTheme} dir={dir} colors={colors} isSwitch on={scheme === 'dark'} />
          <Row icon="notifications-outline" color={colors.warn} label={t('settings.notifications')} onPress={() => router.push('/alerts')} dir={dir} colors={colors} />
          <Row icon="people-outline" color={colors.amb} label={t('settings.contactsHeader')} onPress={() => router.push('/contacts')} dir={dir} colors={colors} />
          <Row icon="time-outline" color={colors.primary} label={t('history.title')} onPress={() => router.push('/history')} dir={dir} colors={colors} last />
        </Group>

        <Group title={t('settings.accessibility')} colors={colors}>
          <Row icon="mic-outline" color={colors.police} label={t('settings.voiceAssistant')} dir={dir} colors={colors} />
          <Row icon="text-outline" color={colors.amb} label={t('settings.largeText')} dir={dir} colors={colors} />
          <Row icon="eye-outline" color={colors.fire} label={t('settings.colorBlindSafe')} dir={dir} colors={colors} />
          <Row icon="accessibility-outline" color={colors.primary} label={t('settings.screenReader')} dir={dir} colors={colors} />
          <Row icon="contrast-outline" color={colors.navy} label={t('settings.highContrast')} dir={dir} colors={colors} last />
        </Group>

        <Group title={t('settings.privacySupport')} colors={colors}>
          <Row icon="shield-checkmark-outline" color={colors.amb} label={t('settings.permissions')} onPress={() => router.push('/permissions')} dir={dir} colors={colors} />
          <Row icon="lock-closed-outline" color={colors.police} label={t('settings.privacy')} dir={dir} colors={colors} />
          <Row icon="document-text-outline" color={colors.textMuted} label={t('settings.terms')} dir={dir} colors={colors} />
          <Row icon="help-circle-outline" color={colors.warn} label={t('settings.support')} dir={dir} colors={colors} />
          <Row icon="star-outline" color={colors.fire} label={t('settings.rateApp')} dir={dir} colors={colors} />
          <Row icon="information-circle-outline" color={colors.primary} label={t('settings.about')} dir={dir} colors={colors} last />
        </Group>

        <AppText color={colors.textMuted} style={styles.version}>{t('brand.name')} · Tawari · v1.0.0</AppText>
      </ScrollView>
    </View>
  );
}

function Group({ title, children, colors }: { title: string; children: React.ReactNode; colors: ThemeColors }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <AppText weight="bodyBold" color={colors.textMuted} style={{ fontSize: 12, marginBottom: spacing.xs, paddingHorizontal: 2 }}>
        {title}
      </AppText>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

function Row({ icon, color, label, onPress, dir, colors, last }: {
  icon: IconName; color: string; label: string; onPress?: () => void; dir: Dir; colors: ThemeColors; last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { flexDirection: rowDir(dir), alignItems: 'center', gap: spacing.sm, padding: spacing.sm + 2 },
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <View style={{ width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: tint(color) }}>
        <AppIcon name={icon} size={18} color={color} />
      </View>
      <AppText weight="bodyMedium" style={{ flex: 1, fontSize: 13 }}>{label}</AppText>
      <AppIcon name={dir === 'rtl' ? 'chevron-back-outline' : 'chevron-forward-outline'} size={16} color={colors.textMuted} />
    </Pressable>
  );
}

function Toggle({ icon, color, label, value, onPress, dir, colors, isSwitch, on, last }: {
  icon: IconName; color: string; label: string; value: string; onPress: () => void; dir: Dir; colors: ThemeColors; isSwitch?: boolean; on?: boolean; last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { flexDirection: rowDir(dir), alignItems: 'center', gap: spacing.sm, padding: spacing.sm + 2 },
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <View style={{ width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: tint(color) }}>
        <AppIcon name={icon} size={18} color={color} />
      </View>
      <AppText weight="bodyMedium" style={{ flex: 1, fontSize: 13 }}>{label}</AppText>
      {isSwitch ? (
        <View style={{ width: 44, height: 26, borderRadius: 13, padding: 3, backgroundColor: on ? colors.primary : colors.border, alignItems: on ? (dir === 'rtl' ? 'flex-start' : 'flex-end') : (dir === 'rtl' ? 'flex-end' : 'flex-start') }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
        </View>
      ) : (
        <AppText weight="bodyBold" color={colors.primary} style={{ fontSize: 12 }}>{value}</AppText>
      )}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 40 },
    profileCard: {
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.xl,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    profileAvatar: {
      width: 52,
      height: 52,
      borderRadius: radius.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileAvatarText: { fontSize: 15 },
    profileName: { fontSize: 14 },
    profileSub: { fontSize: 11, marginTop: 2 },
    profileLink: { fontSize: 12 },
    version: { textAlign: 'center', fontSize: 11, marginTop: spacing.sm },
  });
}

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon, type IconName } from '../src/components/AppIcon';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { SheetButton } from '../src/components/SheetButton';
import { useLocale, rowDir, type Dir } from '../src/context/LocaleContext';
import { useTheme } from '../src/context/ThemeContext';
import { elevation, radius, spacing, tint, type ThemeColors } from '../src/constants/theme';
import { writeJSON, STORAGE_KEYS } from '../src/utils/storage';

const DATA_POINTS: { icon: IconName; color: string; titleKey: string; descKey: string }[] = [
  { icon: 'location-outline', color: '#2962FF', titleKey: 'consent.location', descKey: 'consent.locationDesc' },
  { icon: 'pulse-outline', color: '#00B894', titleKey: 'consent.medical', descKey: 'consent.medicalDesc' },
  { icon: 'people-outline', color: '#E53935', titleKey: 'consent.contacts', descKey: 'consent.contactsDesc' },
  { icon: 'mic-outline', color: '#FFB000', titleKey: 'consent.voice', descKey: 'consent.voiceDesc' },
];

export default function ConsentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ review?: string }>();
  const isReview = params.review === '1';
  const { dir, t } = useLocale();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [agreed, setAgreed] = useState(isReview);

  const finish = async () => {
    if (!agreed) return;
    await writeJSON(STORAGE_KEYS.consentAccepted, true);
    if (isReview) router.back();
    else router.replace('/permissions');
  };

  return (
    <View style={styles.screen}>
      {isReview ? (
        <ScreenHeader title={t('consent.title')} onBack={() => router.back()} />
      ) : (
        <View style={styles.header}>
          <AppText weight="displayExtraBold" style={styles.title}>{t('consent.title')}</AppText>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <AppText color={colors.textMuted} style={styles.subtitle}>{t('consent.subtitle')}</AppText>

        <AppText weight="bodyBold" style={styles.sectionTitle}>{t('consent.dataTitle')}</AppText>
        {DATA_POINTS.map((d) => (
          <View key={d.titleKey} style={[styles.card, elevation.sm, { flexDirection: rowDir(dir) }]}>
            <View style={[styles.iconWrap, { backgroundColor: tint(d.color) }]}>
              <AppIcon name={d.icon} size={20} color={d.color} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="bodyBold" style={styles.cardTitle}>{t(d.titleKey)}</AppText>
              <AppText color={colors.textMuted} style={styles.cardDesc}>{t(d.descKey)}</AppText>
            </View>
          </View>
        ))}

        <View style={[styles.storageNote, { flexDirection: rowDir(dir) }]}>
          <AppIcon name="shield-checkmark-outline" size={16} color={colors.success} />
          <AppText style={styles.storageNoteText}>{t('consent.storageNote')}</AppText>
        </View>

        <Pressable onPress={() => setAgreed((a) => !a)} style={[styles.agreeRow, { flexDirection: rowDir(dir) }]}>
          <View style={[styles.checkbox, { backgroundColor: agreed ? colors.success : 'transparent', borderColor: agreed ? colors.success : colors.border }]}>
            {agreed ? <AppIcon name="checkmark-outline" size={15} color="#fff" /> : null}
          </View>
          <AppText style={styles.agreeText}>{t('consent.agree')}</AppText>
        </Pressable>

        {isReview ? (
          <AppText color={colors.textMuted} style={styles.reviewNote}>{t('consent.reviewNote')}</AppText>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ opacity: agreed ? 1 : 0.5 }}>
          <SheetButton label={t('consent.continue')} color={colors.primary} onPress={finish} />
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
    title: { fontSize: 24 },
    content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
    subtitle: { fontSize: 13, lineHeight: 20, marginBottom: spacing.lg },
    sectionTitle: { fontSize: 14, marginBottom: spacing.sm },
    card: { alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.sm },
    iconWrap: { width: 44, height: 44, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 14 },
    cardDesc: { fontSize: 11.5, marginTop: 3, lineHeight: 17 },
    storageNote: {
      alignItems: 'center',
      gap: 8,
      backgroundColor: tint(colors.success, 0.12),
      borderRadius: radius.md,
      padding: spacing.sm,
      marginTop: spacing.xs,
    },
    storageNoteText: { fontSize: 11.5, flex: 1, lineHeight: 16 },
    agreeRow: { alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.lg },
    checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    agreeText: { fontSize: 12.5, flex: 1, lineHeight: 18 },
    reviewNote: { fontSize: 11, marginTop: spacing.md, textAlign: 'center' },
    footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.sm },
  });
}

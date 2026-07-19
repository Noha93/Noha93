import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../src/components/AppText';
import { AppIcon, type IconName } from '../src/components/AppIcon';
import { SheetButton } from '../src/components/SheetButton';
import { useLocale, type Dir } from '../src/context/LocaleContext';
import { useTheme } from '../src/context/ThemeContext';
import { radius, spacing, withAlpha, type ThemeColors } from '../src/constants/theme';

const SLIDES: { icon: IconName; color: string; titleKey: string; descKey: string }[] = [
  { icon: 'call-outline', color: '#E53935', titleKey: 'onboarding.s1Title', descKey: 'onboarding.s1Desc' },
  { icon: 'location-outline', color: '#2962FF', titleKey: 'onboarding.s2Title', descKey: 'onboarding.s2Desc' },
  { icon: 'pulse-outline', color: '#00B894', titleKey: 'onboarding.s3Title', descKey: 'onboarding.s3Desc' },
  { icon: 'medkit-outline', color: '#FFB000', titleKey: 'onboarding.s4Title', descKey: 'onboarding.s4Desc' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { dir, t } = useLocale();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  const next = () => (last ? router.replace('/permissions') : setI(i + 1));

  return (
    <View style={styles.screen}>
      <View style={styles.skipRow}>
        <Pressable onPress={() => router.replace('/permissions')}>
          <AppText weight="bodyMedium" color={colors.textMuted} style={styles.skipText}>{t('onboarding.skip')}</AppText>
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.haloWrap}>
          <LinearGradient
            colors={[withAlpha(slide.color, 0.16), withAlpha(slide.color, 0)]}
            style={styles.halo}
          />
          <LinearGradient
            colors={[withAlpha(slide.color, 0.9), withAlpha(slide.color, 0.65)]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.iconWrap}
          >
            <AppIcon name={slide.icon} size={72} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <AppText weight="displayExtraBold" style={styles.title}>{t(slide.titleKey)}</AppText>
        <AppText color={colors.textMuted} style={styles.desc}>{t(slide.descKey)}</AppText>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, idx) => (
            <View key={idx} style={[styles.dot, { backgroundColor: idx === i ? colors.primary : colors.border, width: idx === i ? 28 : 8 }]} />
          ))}
        </View>
        <SheetButton label={last ? t('onboarding.start') : t('onboarding.next')} color={colors.primary} onPress={next} />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    skipRow: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    skipText: { fontSize: 13 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
    haloWrap: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
    halo: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
    iconWrap: { width: 180, height: 180, borderRadius: radius.xxl + 16, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 22, marginTop: spacing.xl, textAlign: 'center' },
    desc: { fontSize: 13, marginTop: 10, textAlign: 'center', lineHeight: 19, maxWidth: 300 },
    footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
    dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: spacing.lg },
    dot: { height: 8, borderRadius: 4 },
  });
}

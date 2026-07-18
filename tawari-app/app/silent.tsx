import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon } from '../src/components/AppIcon';
import { useLocale, type Dir } from '../src/context/LocaleContext';
import { radius, spacing, type ThemeColors } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';
import { placeCall } from '../src/utils/share';

export default function SilentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <AppIcon name="close-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.center}>
        <AppText weight="displayExtraBold" color="#fff" style={styles.title}>{t('silent.title')}</AppText>
        <AppText color="rgba(255,255,255,0.8)" style={styles.sub}>{t('silent.subtitle')}</AppText>

        <Pressable onPress={() => placeCall('122')} style={[styles.bigBtn, { backgroundColor: '#fff' }]}>
          <AppIcon name="call-outline" size={54} color={colors.primary} />
          <AppText weight="displayExtraBold" color={colors.navy} style={styles.bigBtnText}>{t('silent.call')}</AppText>
        </Pressable>

        <Pressable onPress={() => router.push('/share-location')} style={[styles.bigBtn, { backgroundColor: colors.navy === colors.bg ? colors.surface : colors.navy }]}>
          <AppIcon name="location-outline" size={54} color="#fff" />
          <AppText weight="displayExtraBold" color="#fff" style={styles.bigBtnText}>{t('silent.location')}</AppText>
        </Pressable>
      </View>

      <AppText color="rgba(255,255,255,0.6)" style={styles.footer}>{t('silent.footer')}</AppText>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.primary, padding: spacing.lg },
    topRow: { alignItems: 'flex-end', paddingTop: spacing.sm },
    closeBtn: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    center: { flex: 1, justifyContent: 'center', gap: spacing.lg },
    title: { fontSize: 26, textAlign: 'center' },
    sub: { fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: spacing.sm },
    bigBtn: {
      width: '100%',
      height: 160,
      borderRadius: radius.xxl,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    bigBtnText: { fontSize: 20 },
    footer: { textAlign: 'center', fontSize: 11, paddingBottom: spacing.md },
  });
}

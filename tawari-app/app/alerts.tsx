import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon } from '../src/components/AppIcon';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { useTheme } from '../src/context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../src/context/LocaleContext';
import { elevation, radius, spacing, tint, type ThemeColors } from '../src/constants/theme';
import { alerts } from '../src/constants/alerts';

const LEVEL_COLOR = { high: '#E53935', medium: '#FFB000', low: '#2962FF' } as const;

export default function AlertsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { dir, locale, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('alerts.title')} subtitle={t('alerts.subtitle')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {alerts.map((a) => {
          const color = LEVEL_COLOR[a.level];
          return (
            <View key={a.id} style={[styles.card, elevation.sm, { flexDirection: rowDir(dir) }]}>
              <View style={[styles.iconWrap, { backgroundColor: tint(color) }]}>
                <AppIcon name={a.icon as any} size={20} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.topRow, { flexDirection: rowDir(dir) }]}>
                  <AppText weight="bodyBold" style={styles.name} numberOfLines={1}>
                    {locale === 'ar' ? a.ar : a.en}
                  </AppText>
                  <View style={[styles.badge, { backgroundColor: color }]}>
                    <AppText weight="bodyBold" color="#fff" style={styles.badgeText}>
                      {t(`alerts.level.${a.level}`)}
                    </AppText>
                  </View>
                </View>
                <AppText color={colors.textMuted} style={styles.desc}>
                  {locale === 'ar' ? a.descAr : a.descEn}
                </AppText>
                <AppText color={colors.textMuted} style={styles.time}>
                  {locale === 'ar' ? a.timeAr : a.timeEn}
                </AppText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 40, gap: spacing.sm },
    card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm, alignItems: 'flex-start' },
    iconWrap: { width: 44, height: 44, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
    topRow: { alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    name: { fontSize: 13, flexShrink: 1 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
    badgeText: { fontSize: 9.5 },
    desc: { fontSize: 11.5, marginTop: 4, lineHeight: 17 },
    time: { fontSize: 10, marginTop: 6 },
  });
}

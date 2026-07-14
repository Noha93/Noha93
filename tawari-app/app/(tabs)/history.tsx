import React, { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { AppIcon, type IconName } from '../../src/components/AppIcon';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useReports } from '../../src/context/ReportsContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir } from '../../src/context/LocaleContext';
import { sosServices, otherServices, type ServiceKey } from '../../src/constants/services';
import { mapsLink } from '../../src/utils/share';
import { glow, radius, spacing, type ThemeColors } from '../../src/constants/theme';
import type { Locale } from '../../src/i18n/strings';

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(locale === 'en' ? 'en-US' : 'ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function serviceIcon(key: ServiceKey): IconName {
  return (
    (sosServices as Record<string, { icon: IconName }>)[key]?.icon ??
    (otherServices as Record<string, { icon: IconName }>)[key]?.icon ??
    'lifebuoy'
  );
}

function serviceAccentColor(key: ServiceKey): string {
  return (
    (sosServices as Record<string, { color: string }>)[key]?.color ??
    (otherServices as Record<string, { glowColor: string }>)[key]?.glowColor ??
    '#93A0B4'
  );
}

export default function HistoryScreen() {
  const { reports } = useReports();
  const { colors, scheme } = useTheme();
  const { locale, dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const isDark = scheme === 'dark';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('history.title')} subtitle={t('history.subtitle')} icon="time-outline" />

      <View style={styles.body}>
      {reports.length === 0 ? (
        <AppText color={colors.textMuted} style={styles.empty}>
          {t('history.empty')}
        </AppText>
      ) : (
        reports.map((r) => {
          const accent = serviceAccentColor(r.serviceKey);
          const statusColor = r.resolved ? colors.success : colors.warn;
          return (
            <View key={r.id} style={styles.card}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.iconBadge,
                    isDark && {
                      backgroundColor: withAlpha(accent, 0.16),
                      borderWidth: 1,
                      borderColor: withAlpha(accent, 0.4),
                    },
                  ]}
                >
                  <AppIcon name={serviceIcon(r.serviceKey)} size={18} color={isDark ? accent : colors.text} />
                </View>
                <View style={styles.info}>
                  <AppText weight="bodyBold" style={styles.name}>
                    {t(`services.${r.serviceKey}.name`)} · #{r.id}
                  </AppText>
                  <AppText color={colors.textMuted} style={styles.date}>
                    {formatDate(r.createdAt, locale)}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: withAlpha(statusColor, 0.14), borderWidth: 1, borderColor: withAlpha(statusColor, 0.4) },
                    isDark && glow(statusColor, 0.35, 8),
                  ]}
                >
                  <AppText weight="bodyMedium" style={styles.badgeText} color={statusColor}>
                    {r.resolved ? t('history.resolvedBadge') : t('history.followUpBadge')}
                  </AppText>
                </View>
              </View>
              {r.coords ? (
                <Pressable style={styles.linkRow} onPress={() => Linking.openURL(mapsLink(r.coords!))}>
                  <AppIcon name="map-outline" size={13} color={colors.police} style={isDark ? glow(colors.police, 0.5, 6) : undefined} />
                  <AppText color={colors.police} style={styles.link}>
                    {t('history.viewLocation')}
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          );
        })
      )}
      </View>
    </ScrollView>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingBottom: 40,
    },
    body: {
      paddingTop: spacing.lg,
    },
    empty: {
      paddingHorizontal: spacing.lg,
      fontSize: 12,
    },
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    row: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 10,
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 13,
    },
    date: {
      fontSize: 10.5,
      marginTop: 2,
    },
    badge: {
      backgroundColor: colors.bg,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      fontSize: 10,
    },
    linkRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 4,
      marginTop: spacing.sm,
    },
    link: {
      fontSize: 11.5,
      textAlign: textAlignDir(dir),
    },
  });
}

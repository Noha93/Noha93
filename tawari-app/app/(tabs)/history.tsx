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
import { radius, spacing, type ThemeColors } from '../../src/constants/theme';
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

export default function HistoryScreen() {
  const { reports } = useReports();
  const { colors } = useTheme();
  const { locale, dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('history.title')} subtitle={t('history.subtitle')} icon="history" />

      <View style={styles.body}>
      {reports.length === 0 ? (
        <AppText color={colors.textMuted} style={styles.empty}>
          {t('history.empty')}
        </AppText>
      ) : (
        reports.map((r) => {
          return (
            <View key={r.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconBadge}>
                  <AppIcon name={serviceIcon(r.serviceKey)} size={18} color={colors.text} />
                </View>
                <View style={styles.info}>
                  <AppText weight="bodyBold" style={styles.name}>
                    {t(`services.${r.serviceKey}.name`)} · #{r.id}
                  </AppText>
                  <AppText color={colors.textMuted} style={styles.date}>
                    {formatDate(r.createdAt, locale)}
                  </AppText>
                </View>
                <View style={[styles.badge, { backgroundColor: r.resolved ? '#22c55e18' : '#E6394618' }]}>
                  <AppText style={styles.badgeText} color={r.resolved ? colors.success : colors.fire}>
                    {r.resolved ? t('history.resolvedBadge') : t('history.followUpBadge')}
                  </AppText>
                </View>
              </View>
              {r.coords ? (
                <Pressable style={styles.linkRow} onPress={() => Linking.openURL(mapsLink(r.coords!))}>
                  <AppIcon name="map" size={13} color={colors.police} />
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

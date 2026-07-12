import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { useReports } from '../../src/context/ReportsContext';
import { sosServices } from '../../src/constants/services';
import { mapsLink } from '../../src/utils/share';
import { colors, radius, spacing } from '../../src/constants/theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const { reports } = useReports();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText weight="displayExtraBold" style={styles.title}>
          سجل البلاغات
        </AppText>
        <AppText color={colors.textMuted} style={styles.subtitle}>
          البلاغات والمكالمات محفوظة محليًا على جهازك فقط
        </AppText>
      </View>

      {reports.length === 0 ? (
        <AppText color={colors.textMuted} style={styles.empty}>
          سجل البلاغات فارغ حاليًا
        </AppText>
      ) : (
        reports.map((r) => {
          const icon = sosServices[r.serviceKey as keyof typeof sosServices]?.icon ?? '🛟';
          return (
            <View key={r.id} style={styles.card}>
              <View style={styles.row}>
                <AppText style={styles.icon}>{icon}</AppText>
                <View style={styles.info}>
                  <AppText weight="bodyBold" style={styles.name}>
                    {r.serviceName} · #{r.id}
                  </AppText>
                  <AppText color={colors.textMuted} style={styles.date}>
                    {formatDate(r.createdAt)}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.badge,
                    r.resolved === true && { backgroundColor: '#22c55e18' },
                    r.resolved === false && { backgroundColor: '#E6394618' },
                  ]}
                >
                  <AppText
                    style={styles.badgeText}
                    color={r.resolved === true ? colors.success : r.resolved === false ? colors.fire : colors.textMuted}
                  >
                    {r.resolved === true ? 'تم الحل' : r.resolved === false ? 'محتاج متابعة' : 'بلاغ رقمي'}
                  </AppText>
                </View>
              </View>
              {r.coords ? (
                <AppText
                  color={colors.police}
                  style={styles.link}
                  onPress={() => Linking.openURL(mapsLink(r.coords!))}
                >
                  🗺️ عرض الموقع وقت البلاغ
                </AppText>
              ) : null}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
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
    borderRadius: radius.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 22,
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
  link: {
    fontSize: 11.5,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});

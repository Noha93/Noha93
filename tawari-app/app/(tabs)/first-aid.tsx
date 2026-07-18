import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { AppIcon } from '../../src/components/AppIcon';
import { BottomSheet } from '../../src/components/BottomSheet';
import { SheetButton } from '../../src/components/SheetButton';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir } from '../../src/context/LocaleContext';
import { elevation, fontForWeight, radius, spacing, tint, type ThemeColors } from '../../src/constants/theme';
import { firstAidTopics, type FirstAidTopic } from '../../src/constants/firstAid';
import { placeCall } from '../../src/utils/share';

export default function FirstAidScreen() {
  const { colors } = useTheme();
  const { dir, locale, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<FirstAidTopic | null>(null);

  const filtered = firstAidTopics.filter((f) => f.ar.includes(q) || f.en.toLowerCase().includes(q.toLowerCase()));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={[styles.headerRow, { flexDirection: rowDir(dir) }]}>
          <AppText weight="displayExtraBold" style={styles.title}>{t('firstAid.title')}</AppText>
          <View style={[styles.offlineBadge, { flexDirection: rowDir(dir) }]}>
            <AppIcon name="cloud-offline-outline" size={13} color={colors.success} />
            <AppText weight="bodyMedium" color={colors.success} style={styles.offlineText}>{t('firstAid.offlineReady')}</AppText>
          </View>
        </View>
        <View style={[styles.searchBox, { flexDirection: rowDir(dir) }]}>
          <AppIcon name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t('firstAid.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { fontFamily: fontForWeight('body', locale) }]}
            textAlign={textAlignDir(dir)}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        <View style={[styles.gridInner, { flexDirection: rowDir(dir) }]}>
          {filtered.map((f) => (
            <Pressable key={f.id} onPress={() => setOpen(f)} style={[styles.card, elevation.sm]}>
              <View style={[styles.cardIcon, { backgroundColor: tint(f.color) }]}>
                <AppIcon name={f.icon as any} size={22} color={f.color} />
              </View>
              <AppText weight="bodyBold" style={styles.cardTitle}>{locale === 'ar' ? f.ar : f.en}</AppText>
              <AppText color={colors.textMuted} style={styles.cardSub}>{t('firstAid.tapForSteps')}</AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomSheet visible={!!open} onClose={() => setOpen(null)}>
        {open ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.sheetHeader, { flexDirection: rowDir(dir) }]}>
              <View style={[styles.cardIcon, { backgroundColor: tint(open.color) }]}>
                <AppIcon name={open.icon as any} size={22} color={open.color} />
              </View>
              <AppText weight="bodyBold" style={styles.sheetTitle}>{locale === 'ar' ? open.ar : open.en}</AppText>
            </View>

            <Section title={t('firstAid.symptoms')} color={colors.police} items={open.symptoms} locale={locale} colors={colors} dir={dir} />
            <Section title={t('firstAid.treatment')} color={colors.amb} items={open.treatment} locale={locale} colors={colors} dir={dir} numbered />

            <View style={[styles.warningsBox, { backgroundColor: tint(colors.primary, 0.1) }]}>
              <View style={[styles.warningsHeader, { flexDirection: rowDir(dir) }]}>
                <AppIcon name="warning-outline" size={18} color={colors.primary} />
                <AppText weight="bodyBold" color={colors.primary} style={styles.warningsTitle}>{t('firstAid.warnings')}</AppText>
              </View>
              {open.warnings.map((w, i) => (
                <AppText key={i} style={styles.warningItem}>• {locale === 'ar' ? w.ar : w.en}</AppText>
              ))}
            </View>

            <SheetButton
              label={t('firstAid.callAmbulance')}
              color={colors.primary}
              icon="call-outline"
              onPress={() => placeCall('123')}
            />
          </ScrollView>
        ) : null}
      </BottomSheet>
    </View>
  );
}

function Section({ title, color, items, locale, colors, dir, numbered }: {
  title: string; color: string; items: { ar: string; en: string }[]; locale: string; colors: ThemeColors; dir: Dir; numbered?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: rowDir(dir), alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <AppText weight="bodyBold" style={{ fontSize: 13.5 }}>{title}</AppText>
      </View>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: rowDir(dir), gap: 10, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 10, marginBottom: 6, alignItems: 'flex-start' }}>
          {numbered ? (
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
              <AppText weight="bodyBold" color="#fff" style={{ fontSize: 10.5 }}>{i + 1}</AppText>
            </View>
          ) : (
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginTop: 6 }} />
          )}
          <AppText style={{ fontSize: 12.5, flex: 1, lineHeight: 18 }}>{locale === 'ar' ? it.ar : it.en}</AppText>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
    headerRow: { alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20 },
    offlineBadge: { alignItems: 'center', gap: 4, backgroundColor: tint(colors.success), paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
    offlineText: { fontSize: 10.5 },
    searchBox: {
      alignItems: 'center',
      gap: 8,
      marginTop: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      height: 46,
    },
    searchInput: { flex: 1, color: colors.text, fontSize: 13 },
    grid: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
    gridInner: { flexWrap: 'wrap', gap: 10 },
    card: {
      width: '47%',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.md,
      gap: 8,
    },
    cardIcon: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 13 },
    cardSub: { fontSize: 10.5 },
    sheetHeader: { alignItems: 'center', gap: 10, marginBottom: spacing.md },
    sheetTitle: { fontSize: 16 },
    warningsBox: { borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
    warningsHeader: { alignItems: 'center', gap: 8, marginBottom: 8 },
    warningsTitle: { fontSize: 13 },
    warningItem: { fontSize: 12.5, lineHeight: 18, marginBottom: 2 },
  });
}

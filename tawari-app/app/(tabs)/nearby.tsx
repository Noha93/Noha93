import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { AppIcon } from '../../src/components/AppIcon';
import { NearbyMapView } from '../../src/components/NearbyMapView';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../../src/context/LocaleContext';
import { elevation, radius, spacing, tint, type ThemeColors } from '../../src/constants/theme';
import { nearbyPlaces, placeTypeMeta, type PlaceType } from '../../src/constants/nearby';
import { placeCall } from '../../src/utils/share';

export default function NearbyScreen() {
  const { colors } = useTheme();
  const { dir, locale, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [filter, setFilter] = useState<PlaceType | 'all'>('all');

  const filtered = filter === 'all' ? nearbyPlaces : nearbyPlaces.filter((p) => p.type === filter);
  const markers = filtered.map((p) => ({ id: p.id, x: p.x, y: p.y, color: placeTypeMeta[p.type].color }));

  const filters: (PlaceType | 'all')[] = ['all', 'hospital', 'police', 'fire', 'pharmacy', 'ambulance'];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <AppText weight="displayExtraBold" style={styles.title}>{t('nearby.title')}</AppText>
        <AppText color={colors.textMuted} style={styles.subtitle}>{t('nearby.subtitle')}</AppText>
      </View>

      <View style={styles.mapWrap}>
        <NearbyMapView markers={markers} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}
            >
              <AppText weight="bodyMedium" color={active ? '#fff' : colors.textMuted} style={styles.chipText}>
                {f === 'all' ? t('nearby.all') : t(`nearby.type.${f}`)}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((p) => {
          const meta = placeTypeMeta[p.type];
          return (
            <View key={p.id} style={[styles.card, elevation.sm]}>
              <View style={[styles.cardTop, { flexDirection: rowDir(dir) }]}>
                <View style={[styles.iconWrap, { backgroundColor: tint(meta.color) }]}>
                  <AppIcon name={meta.icon as any} size={20} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[styles.nameRow, { flexDirection: rowDir(dir) }]}>
                    <AppText weight="bodyBold" style={styles.name} numberOfLines={1}>{locale === 'ar' ? p.ar : p.en}</AppText>
                    <View style={[styles.statusBadge, { backgroundColor: p.open ? tint(colors.success) : tint(colors.primary) }]}>
                      <AppText weight="bodyMedium" color={p.open ? colors.success : colors.primary} style={styles.statusText}>
                        {p.open ? t('nearby.open') : t('nearby.closed')}
                      </AppText>
                    </View>
                  </View>
                  <View style={[styles.metaRow, { flexDirection: rowDir(dir) }]}>
                    <AppText color={colors.textMuted} style={styles.metaText}>{p.distanceKm} {t('nearby.km')}</AppText>
                    <AppText color={colors.textMuted} style={styles.metaText}>· {p.etaMin} {t('nearby.min')}</AppText>
                  </View>
                </View>
              </View>
              <View style={[styles.actionsRow, { flexDirection: rowDir(dir) }]}>
                <Pressable onPress={() => placeCall(p.phone)} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                  <AppIcon name="call-outline" size={16} color="#fff" />
                  <AppText weight="bodyBold" color="#fff" style={styles.actionText}>{t('nearby.call')}</AppText>
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL(`https://maps.google.com/?q=${p.x},${p.y}`)}
                  style={[styles.actionBtn, { backgroundColor: colors.surface2 }]}
                >
                  <AppIcon name="navigate-outline" size={16} color={colors.text} />
                  <AppText weight="bodyBold" style={styles.actionText}>{t('nearby.directions')}</AppText>
                </Pressable>
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
    header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
    title: { fontSize: 20 },
    subtitle: { fontSize: 12, marginTop: 2 },
    mapWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
    filterRow: { gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    chip: { paddingHorizontal: 14, height: 34, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    chipText: { fontSize: 12 },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 40, gap: spacing.sm },
    card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md },
    cardTop: { alignItems: 'flex-start', gap: spacing.sm },
    iconWrap: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
    nameRow: { alignItems: 'center', gap: 8 },
    name: { fontSize: 13, flexShrink: 1 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
    statusText: { fontSize: 9.5 },
    metaRow: { gap: 6, marginTop: 4 },
    metaText: { fontSize: 11 },
    actionsRow: { gap: 8, marginTop: spacing.sm },
    actionBtn: { flex: 1, height: 40, borderRadius: radius.md, flexDirection: rowDir(dir), alignItems: 'center', justifyContent: 'center', gap: 6 },
    actionText: { fontSize: 12 },
  });
}

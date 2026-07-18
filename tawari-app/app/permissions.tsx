import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon, type IconName } from '../src/components/AppIcon';
import { SheetButton } from '../src/components/SheetButton';
import { useLocale, rowDir, type Dir } from '../src/context/LocaleContext';
import { useTheme } from '../src/context/ThemeContext';
import { elevation, radius, spacing, tint, type ThemeColors } from '../src/constants/theme';
import { writeJSON, STORAGE_KEYS } from '../src/utils/storage';

const PERMS: { id: string; icon: IconName; color: string; titleKey: string; descKey: string }[] = [
  { id: 'location', icon: 'location-outline', color: '#2962FF', titleKey: 'permissions.location', descKey: 'permissions.locationDesc' },
  { id: 'phone', icon: 'call-outline', color: '#E53935', titleKey: 'permissions.phone', descKey: 'permissions.phoneDesc' },
  { id: 'notifications', icon: 'notifications-outline', color: '#FFB000', titleKey: 'permissions.notifications', descKey: 'permissions.notificationsDesc' },
  { id: 'sms', icon: 'chatbubble-outline', color: '#00B894', titleKey: 'permissions.sms', descKey: 'permissions.smsDesc' },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const { dir, t } = useLocale();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [granted, setGranted] = useState<string[]>([]);

  const toggle = (id: string) => setGranted((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const finish = async () => {
    await writeJSON(STORAGE_KEYS.onboarded, true);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <AppText weight="displayExtraBold" style={styles.title}>{t('permissions.title')}</AppText>
        <AppText color={colors.textMuted} style={styles.subtitle}>{t('permissions.subtitle')}</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {PERMS.map((p) => {
          const on = granted.includes(p.id);
          return (
            <Pressable key={p.id} onPress={() => toggle(p.id)} style={[styles.card, elevation.sm, { flexDirection: rowDir(dir) }]}>
              <View style={[styles.iconWrap, { backgroundColor: tint(p.color) }]}>
                <AppIcon name={p.icon} size={22} color={p.color} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="bodyBold" style={styles.permTitle}>{t(p.titleKey)}</AppText>
                <AppText color={colors.textMuted} style={styles.permDesc}>{t(p.descKey)}</AppText>
              </View>
              <View style={[styles.check, { backgroundColor: on ? colors.success : 'transparent', borderColor: on ? colors.success : colors.border }]}>
                {on ? <AppIcon name="checkmark-outline" size={16} color="#fff" /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <SheetButton label={t('permissions.allow')} color={colors.primary} onPress={finish} />
        <Pressable onPress={finish} style={styles.laterBtn}>
          <AppText weight="bodyMedium" color={colors.textMuted} style={styles.laterText}>{t('permissions.later')}</AppText>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
    title: { fontSize: 24 },
    subtitle: { fontSize: 13, marginTop: 6 },
    list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.sm },
    card: { alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md },
    iconWrap: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
    permTitle: { fontSize: 14 },
    permDesc: { fontSize: 11, marginTop: 3, lineHeight: 16 },
    check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.sm },
    laterBtn: { alignItems: 'center', marginTop: spacing.xs, paddingVertical: spacing.xs },
    laterText: { fontSize: 13 },
  });
}

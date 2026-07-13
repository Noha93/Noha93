import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon, type IconName } from './AppIcon';
import { SheetButton } from './SheetButton';
import { fontForWeight, glow, radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir } from '../context/LocaleContext';
import { useMedical, type MedicalProfile } from '../context/MedicalContext';

const ROWS: { field: keyof MedicalProfile; icon: IconName; color: string }[] = [
  { field: 'bloodType', icon: 'water-outline', color: '#FF3B5C' },
  { field: 'allergies', icon: 'alert-circle-outline', color: '#FBBF24' },
  { field: 'chronicConditions', icon: 'medkit-outline', color: '#A78BFA' },
];

export function MedicalSection() {
  const { colors, scheme } = useTheme();
  const { dir, t } = useLocale();
  const { profile, hasData, updateProfile } = useMedical();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MedicalProfile>(profile);
  const isDark = scheme === 'dark';

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const save = async () => {
    await updateProfile(draft);
    setEditing(false);
  };

  return (
    <>
      <View style={styles.headerRow}>
        <AppIcon name="medical-outline" size={16} color={colors.textMuted} />
        <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.headerText}>
          {t('medical.header')}
        </AppText>
      </View>

      {editing ? (
        <View style={styles.card}>
          {ROWS.map((row) => (
            <TextInput
              key={row.field}
              value={draft[row.field]}
              onChangeText={(v) => setDraft((d) => ({ ...d, [row.field]: v }))}
              placeholder={t(`medical.${row.field}Placeholder`)}
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              textAlign={textAlignDir(dir)}
            />
          ))}
          <SheetButton label={t('medical.save')} color={colors.primary} onPress={save} />
        </View>
      ) : (
        <View style={styles.card}>
          <Pressable onPress={startEdit} hitSlop={10} style={styles.editLink}>
            <AppText color={colors.police} style={styles.editLinkText}>
              {t('medical.edit')}
            </AppText>
          </Pressable>
          {hasData ? (
            ROWS.map((row) => (
              <View key={row.field} style={styles.row}>
                <AppIcon
                  name={row.icon}
                  size={14}
                  color={row.color}
                  style={isDark ? glow(row.color, 0.5, 8) : undefined}
                />
                <AppText style={styles.rowText}>
                  {t(`medical.${row.field}`)}: {profile[row.field] || '—'}
                </AppText>
              </View>
            ))
          ) : (
            <AppText color={colors.textMuted} style={styles.empty}>
              {t('medical.empty')}
            </AppText>
          )}
        </View>
      )}

      <AppText color={colors.textMuted} style={styles.note}>
        {t('medical.note')}
      </AppText>
    </>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    headerRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xs,
    },
    headerText: {
      fontSize: 13,
    },
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: 8,
    },
    editLink: {
      position: 'absolute',
      top: spacing.md,
      ...(dir === 'rtl' ? { left: spacing.md } : { right: spacing.md }),
      zIndex: 1,
    },
    editLinkText: {
      fontSize: 12.5,
    },
    row: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 8,
    },
    rowText: {
      fontSize: 12.5,
      flexShrink: 1,
    },
    empty: {
      fontSize: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      fontFamily: fontForWeight('body', dir === 'rtl' ? 'ar' : 'en'),
      color: colors.text,
    },
    note: {
      paddingHorizontal: spacing.lg,
      fontSize: 11,
      lineHeight: 17,
      marginBottom: spacing.sm,
    },
  });
}

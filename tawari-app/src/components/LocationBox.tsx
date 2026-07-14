import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { glow, radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../context/LocaleContext';
import type { Coords } from '../utils/share';

interface Props {
  coords: Coords | null;
}

export function LocationBox({ coords }: Props) {
  const { colors, scheme } = useTheme();
  const { dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const isDark = scheme === 'dark';
  const statusColor = coords ? colors.success : colors.warn;
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <AppIcon
          name={coords ? 'checkmark-circle-outline' : 'alert-circle-outline'}
          size={15}
          color={statusColor}
          style={isDark ? glow(statusColor, 0.5, 8) : undefined}
        />
        <AppText weight="bodyBold" style={styles.status}>
          {coords ? t('shareLocation.locationReady') : t('shareLocation.locationOff')}
        </AppText>
      </View>
      <View style={styles.row}>
        <AppIcon
          name="location-outline"
          size={14}
          color={isDark ? colors.police : colors.textMuted}
          style={isDark ? glow(colors.police, 0.4, 6) : undefined}
        />
        <AppText color={colors.textMuted} style={styles.line}>
          {coords
            ? t('shareLocation.locationLine', { lat: coords.lat.toFixed(4), lng: coords.lng.toFixed(4) })
            : t('shareLocation.locationLineOff')}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    box: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    row: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    status: {
      fontSize: 12,
    },
    line: {
      fontSize: 12,
      flexShrink: 1,
    },
  });
}

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../context/LocaleContext';
import type { Coords } from '../utils/share';

interface Props {
  coords: Coords | null;
}

export function LocationBox({ coords }: Props) {
  const { colors } = useTheme();
  const { dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <AppIcon name={coords ? 'check-circle' : 'alert-circle'} size={15} color={coords ? colors.success : colors.warn} />
        <AppText weight="bodyBold" style={styles.status}>
          {coords ? t('shareLocation.locationReady') : t('shareLocation.locationOff')}
        </AppText>
      </View>
      <View style={styles.row}>
        <AppIcon name="map-marker" size={14} color={colors.textMuted} />
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
      backgroundColor: colors.bg,
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

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import type { Coords } from '../utils/share';

interface Props {
  coords: Coords | null;
}

export function LocationBox({ coords }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <AppIcon name={coords ? 'check-circle' : 'alert-circle'} size={15} color={coords ? colors.success : colors.warn} />
        <AppText weight="bodyBold" style={styles.status}>
          {coords ? 'الموقع جاهز للإرسال' : 'الموقع غير مفعّل'}
        </AppText>
      </View>
      <View style={styles.row}>
        <AppIcon name="map-marker" size={14} color={colors.textMuted} />
        <AppText color={colors.textMuted} style={styles.line}>
          {coords
            ? `تم تحديد موقعك بدقة (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
            : 'لم يتم تحديد الموقع بعد — فعّليه لإرسال بلاغ أدق'}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
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
      flexDirection: 'row-reverse',
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

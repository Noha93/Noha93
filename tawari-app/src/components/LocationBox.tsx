import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
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
      <AppText weight="bodyBold" style={styles.status}>
        {coords ? '✅ الموقع جاهز للإرسال' : '⚠️ الموقع غير مفعّل'}
      </AppText>
      <AppText color={colors.textMuted} style={styles.line}>
        {coords
          ? `📍 تم تحديد موقعك بدقة (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
          : '📍 لم يتم تحديد الموقع بعد — فعّليه لإرسال بلاغ أدق'}
      </AppText>
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
    status: {
      fontSize: 12,
      marginBottom: 2,
    },
    line: {
      fontSize: 12,
    },
  });
}

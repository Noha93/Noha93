import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../constants/theme';
import type { Coords } from '../utils/share';

interface Props {
  coords: Coords | null;
}

export function LocationBox({ coords }: Props) {
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

const styles = StyleSheet.create({
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

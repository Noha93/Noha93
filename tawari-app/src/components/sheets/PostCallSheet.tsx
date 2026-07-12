import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { colors, spacing } from '../../constants/theme';

interface Props {
  serviceLabel: string;
  onResolved: () => void;
  onNotResolved: () => void;
}

export function PostCallSheet({ serviceLabel, onResolved, onNotResolved }: Props) {
  return (
    <>
      <AppText weight="displayExtraBold" style={styles.title}>
        انتهيت من المكالمة؟
      </AppText>
      <AppText color={colors.textMuted} style={styles.sub}>
        هل تم حل المشكلة بعد اتصالك بـ {serviceLabel}؟
      </AppText>
      <SheetButton label="🔘 نعم، تم الحل" color={colors.success} onPress={onResolved} />
      <SheetButton label="🔘 لا، لسه محتاج مساعدة" color={colors.fire} onPress={onNotResolved} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

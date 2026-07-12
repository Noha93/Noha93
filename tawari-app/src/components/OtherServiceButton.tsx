import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../constants/theme';
import type { OtherService } from '../constants/services';

interface Props {
  service: OtherService;
  onPress: () => void;
}

export function OtherServiceButton({ service, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <AppText style={styles.icon}>{service.icon}</AppText>
      <AppText weight="bodyBold" style={styles.name}>
        {service.name}
      </AppText>
      <AppText color={colors.textMuted} style={styles.number}>
        {service.number}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 22,
  },
  name: {
    fontSize: 12.5,
    textAlign: 'center',
  },
  number: {
    fontSize: 10.5,
    textAlign: 'center',
  },
});

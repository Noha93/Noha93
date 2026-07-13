import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import type { OtherService } from '../constants/services';

interface Props {
  service: OtherService;
  onPress: () => void;
}

export function OtherServiceButton({ service, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <AppIcon name={service.icon} size={20} color={colors.text} />
      </View>
      <AppText weight="bodyBold" style={styles.name}>
        {service.name}
      </AppText>
      <AppText color={colors.textMuted} style={styles.number}>
        {service.number}
      </AppText>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    btn: {
      flexBasis: '48%',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingVertical: 16,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      gap: 8,
    },
    pressed: {
      opacity: 0.7,
    },
    badge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
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
}

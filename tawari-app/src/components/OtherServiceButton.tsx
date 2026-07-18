import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { elevation, glow, radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import type { OtherService } from '../constants/services';

interface Props {
  service: OtherService;
  onPress: () => void;
}

export function OtherServiceButton({ service, onPress }: Props) {
  const { colors, scheme } = useTheme();
  const { t } = useLocale();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;
  const isDark = scheme === 'dark';

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  };

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.btn,
          isDark && pressed && { borderColor: service.glowColor, ...glow(service.glowColor, 0.55, 18) },
          !isDark && pressed && styles.pressedLight,
        ]}
      >
        <View
          style={[
            styles.badge,
            {
              backgroundColor: withAlpha(service.glowColor, isDark ? 0.16 : 0.12),
              borderWidth: 1,
              borderColor: withAlpha(service.glowColor, isDark ? 0.4 : 0),
            },
          ]}
        >
          <AppIcon name={service.icon} size={20} color={service.glowColor} />
        </View>
        <AppText weight="bodyBold" style={styles.name}>
          {t(`services.${service.key}.name`)}
        </AppText>
        <AppText color={colors.textMuted} style={styles.number}>
          {service.number}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      flexBasis: '48%',
    },
    btn: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingVertical: 16,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      gap: 8,
      ...elevation.sm,
    },
    pressedLight: {
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

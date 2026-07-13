import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { AppIcon, type IconName } from './AppIcon';
import { glow, radius, spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, rowDir } from '../context/LocaleContext';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'secondary' | 'outline';
  color?: string;
  icon?: IconName;
  style?: ViewStyle;
}

export function SheetButton({ label, onPress, variant = 'solid', color, icon, style }: Props) {
  const { colors, scheme } = useTheme();
  const { dir } = useLocale();
  const bg = variant === 'solid' ? color ?? colors.police : variant === 'secondary' ? colors.bg : 'transparent';
  const textColor = variant === 'solid' ? '#fff' : colors.text;
  const border = variant === 'outline' ? colors.border : variant === 'secondary' ? colors.border : 'transparent';
  const solidGlow = variant === 'solid' && scheme === 'dark' ? glow(color ?? colors.police, 0.45, 16) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { flexDirection: rowDir(dir), backgroundColor: bg, borderColor: border, borderWidth: variant === 'solid' ? 0 : 1.5 },
        solidGlow,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <AppIcon name={icon} size={19} color={textColor} /> : null}
      <AppText weight="bodyBold" color={textColor} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    borderRadius: radius.md,
    paddingVertical: 15,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 14.5,
  },
});

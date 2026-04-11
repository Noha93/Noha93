import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'gold' | 'info' | 'outline';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'primary', size = 'md', style }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: Colors.successLight, text: Colors.success };
      case 'error': return { bg: Colors.errorLight, text: Colors.error };
      case 'warning': return { bg: Colors.warningLight, text: Colors.warning };
      case 'gold': return { bg: Colors.secondaryUltraLight, text: Colors.secondaryDark };
      case 'info': return { bg: Colors.infoLight, text: Colors.info };
      case 'outline': return { bg: 'transparent', text: Colors.primary, border: Colors.primary };
      default: return { bg: Colors.primaryUltraLight, text: Colors.primary };
    }
  };

  const colors = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: isSmall ? Spacing.xs : Spacing.sm,
          paddingVertical: isSmall ? 2 : 4,
          borderWidth: colors.border ? 1 : 0,
          borderColor: colors.border || 'transparent',
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.text, fontSize: isSmall ? 10 : 12 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

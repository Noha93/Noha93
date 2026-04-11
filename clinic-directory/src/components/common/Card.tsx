import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: number;
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = Spacing.base,
}: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding,
    ...(variant === 'default' ? Shadow.sm : {}),
    ...(variant === 'elevated' ? Shadow.lg : {}),
    ...(variant === 'outlined'
      ? { borderWidth: 1, borderColor: Colors.cardBorder }
      : {}),
    ...(variant === 'flat' ? {} : {}),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyle} activeOpacity={0.9}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

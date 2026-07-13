import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AppIcon({ name, size = 22, color, style }: Props) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={color ?? colors.text} style={style} />;
}

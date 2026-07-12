import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/theme';

type Weight = 'body' | 'bodyMedium' | 'bodyBold' | 'display' | 'displayExtraBold';

interface Props extends TextProps {
  weight?: Weight;
  color?: string;
}

export function AppText({ style, weight = 'body', color, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[styles.base, { fontFamily: fonts[weight], color: color ?? colors.text }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

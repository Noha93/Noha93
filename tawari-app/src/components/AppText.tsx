import React from 'react';
import { Text, TextProps } from 'react-native';
import { fontForWeight, type FontWeight } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, textAlignDir } from '../context/LocaleContext';

interface Props extends TextProps {
  weight?: FontWeight;
  color?: string;
}

export function AppText({ style, weight = 'body', color, ...props }: Props) {
  const { colors } = useTheme();
  const { locale, dir } = useLocale();
  return (
    <Text
      {...props}
      style={[
        { textAlign: textAlignDir(dir), writingDirection: dir },
        { fontFamily: fontForWeight(weight, locale), color: color ?? colors.text },
        style,
      ]}
    />
  );
}

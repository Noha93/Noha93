/**
 * Design System - Typography
 * Supporting Arabic (RTL) and English (LTR)
 */

import { TextStyle } from 'react-native';

export const FontFamily = {
  // Arabic fonts
  arabicRegular: 'System',
  arabicMedium: 'System',
  arabicBold: 'System',

  // Default system fonts
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 26,
  '4xl': 30,
  '5xl': 36,
  display: 42,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2.0,
};

export const FontWeight = {
  normal: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  heavy: '800' as TextStyle['fontWeight'],
};

export const Typography = {
  // Display
  displayLarge: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.heavy,
    lineHeight: FontSize.display * LineHeight.tight,
  } as TextStyle,

  displaySmall: {
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['5xl'] * LineHeight.tight,
  } as TextStyle,

  // Headings
  h1: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  } as TextStyle,

  h2: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.normal,
  } as TextStyle,

  h3: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['2xl'] * LineHeight.normal,
  } as TextStyle,

  h4: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xl * LineHeight.normal,
  } as TextStyle,

  h5: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.lg * LineHeight.normal,
  } as TextStyle,

  // Body
  bodyLarge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.md * LineHeight.relaxed,
  } as TextStyle,

  body: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.base * LineHeight.relaxed,
  } as TextStyle,

  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.md * LineHeight.normal,
  } as TextStyle,

  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.base * LineHeight.normal,
  } as TextStyle,

  labelSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.normal,
  } as TextStyle,

  // Caption
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.xs * LineHeight.normal,
  } as TextStyle,

  // Button
  button: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.base * LineHeight.normal,
  } as TextStyle,

  buttonSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.sm * LineHeight.normal,
  } as TextStyle,

  buttonLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.lg * LineHeight.normal,
  } as TextStyle,
};

export default Typography;

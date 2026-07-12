// Semantic + brand colors are identical in both themes — they're saturated
// enough to read on both a light and a dark surface, and changing them by
// theme would undermine the emergency-type color coding (fire/police/amb).
const semanticColors = {
  fire: '#E63946',
  fireDark: '#C22733',
  police: '#2A6FDB',
  policeDark: '#1E56B3',
  amb: '#2A9D8F',
  ambDark: '#208074',
  success: '#22C55E',
  warn: '#F59E0B',
  voice: '#8B5CF6',
  voiceDark: '#6D28D9',
  // brand / chrome accent (logo, active tab, primary CTAs) — separate from the
  // per-emergency-type colors above (fire/police/amb keep their own meaning)
  primary: '#B3202C',
  primaryDark: '#8C1620',
} as const;

export const lightColors = {
  ...semanticColors,
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  overlay: 'rgba(10,10,15,0.55)',
  ink: '#14141A',
  inkMuted: '#2A2A33',
  onInk: 'rgba(255,255,255,0.7)',
} as const;

export const darkColors = {
  ...semanticColors,
  bg: '#0D1625',
  surface: '#16213A',
  text: '#F5F6FA',
  textMuted: '#93A0B4',
  border: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(0,0,0,0.65)',
  ink: '#08111F',
  inkMuted: '#1C2740',
  onInk: 'rgba(255,255,255,0.7)',
} as const;

// Widened to `string` per key (not the narrow literal union `typeof lightColors`
// would give) so darkColors — same keys, different literal values — satisfies it.
export type ThemeColors = { [K in keyof typeof lightColors]: string };
export type ColorScheme = 'light' | 'dark';

// Static default (light) — for the handful of theme-agnostic constants files
// (e.g. services.ts) that aren't React components and can't call useTheme().
export const colors = lightColors;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

// 4pt-based 8pt-grid spacing scale — every value is a multiple of 4.
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Arabic (RTL, primary): IBM Plex Sans Arabic — one family across the whole
// type scale, matching the design-system brief. English (Inter) is loaded
// too, ready for the bilingual UI this app doesn't render yet.
export const fonts = {
  display: 'IBMPlexSansArabic_600SemiBold',
  displayExtraBold: 'IBMPlexSansArabic_700Bold',
  body: 'IBMPlexSansArabic_400Regular',
  bodyMedium: 'IBMPlexSansArabic_500Medium',
  bodyBold: 'IBMPlexSansArabic_600SemiBold',
  englishRegular: 'Inter_400Regular',
  englishMedium: 'Inter_500Medium',
  englishBold: 'Inter_700Bold',
};

// Formal type scale (size + line-height), 8pt-grid aligned. Components can
// keep using bespoke sizes, but new/updated UI should read from here.
export const typography = {
  display: { fontSize: 28, lineHeight: 34, weight: 'displayExtraBold' as const },
  h1: { fontSize: 22, lineHeight: 28, weight: 'displayExtraBold' as const },
  h2: { fontSize: 18, lineHeight: 24, weight: 'display' as const },
  h3: { fontSize: 16, lineHeight: 22, weight: 'bodyBold' as const },
  body: { fontSize: 14, lineHeight: 20, weight: 'body' as const },
  bodySmall: { fontSize: 12, lineHeight: 18, weight: 'body' as const },
  caption: { fontSize: 11, lineHeight: 16, weight: 'bodyMedium' as const },
};

export const elevation = {
  none: {},
  sm: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  md: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  lg: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
};

// Semantic + brand colors are identical in both themes — they're saturated
// enough to read on both a light and a dark surface, and changing them by
// theme would undermine the emergency-type color coding (fire/police/amb).
const semanticColors = {
  fire: '#FF6B00',
  fireDark: '#CC5600',
  police: '#2962FF',
  policeDark: '#1E4FD1',
  amb: '#00B894',
  ambDark: '#00967A',
  success: '#2ECC71',
  warn: '#FFB000',
  voice: '#2962FF',
  voiceDark: '#1E4FD1',
  // brand / chrome accent (logo, active tab, primary CTAs) — separate from the
  // per-emergency-type colors above (fire/police/amb keep their own meaning)
  primary: '#E53935',
  primaryDark: '#C62828',
  navy: '#08111F',
} as const;

export const lightColors = {
  ...semanticColors,
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  surface2: '#F1F3F6',
  text: '#08111F',
  textMuted: '#5B6472',
  border: '#EAECEF',
  overlay: 'rgba(8,17,31,0.45)',
  ink: '#08111F',
  inkMuted: '#3A4657',
  onInk: 'rgba(255,255,255,0.7)',
} as const;

// Flat, colorful design system matching the Taware2 reference — soft cards,
// low-opacity color-tinted icon badges, and a light/dark THEME TOGGLE (not a
// dark-only look). Both modes share the same brand/semantic colors above.
export const darkColors = {
  ...semanticColors,
  bg: '#0D1625',
  surface: '#111E33',
  surface2: '#16233B',
  text: '#F4F7FB',
  textMuted: '#9AA7BC',
  border: '#21304A',
  overlay: 'rgba(3,8,16,0.6)',
  ink: '#F4F7FB',
  inkMuted: '#9AA7BC',
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
  xxl: 28,
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

// Arabic: IBM Plex Sans Arabic. English: Inter — same weight scale, swapped
// in per-string by AppText based on the active locale (see fontForWeight).
export const fonts = {
  display: 'IBMPlexSansArabic_600SemiBold',
  displayExtraBold: 'IBMPlexSansArabic_700Bold',
  body: 'IBMPlexSansArabic_400Regular',
  bodyMedium: 'IBMPlexSansArabic_500Medium',
  bodyBold: 'IBMPlexSansArabic_600SemiBold',
  englishRegular: 'Inter_400Regular',
  englishMedium: 'Inter_500Medium',
  englishSemiBold: 'Inter_600SemiBold',
  englishBold: 'Inter_700Bold',
  englishExtraBold: 'Inter_800ExtraBold',
};

export type FontWeight = 'body' | 'bodyMedium' | 'bodyBold' | 'display' | 'displayExtraBold';

const FONT_BY_WEIGHT: Record<FontWeight, { ar: string; en: string }> = {
  body: { ar: fonts.body, en: fonts.englishRegular },
  bodyMedium: { ar: fonts.bodyMedium, en: fonts.englishMedium },
  bodyBold: { ar: fonts.bodyBold, en: fonts.englishSemiBold },
  display: { ar: fonts.display, en: fonts.englishSemiBold },
  displayExtraBold: { ar: fonts.displayExtraBold, en: fonts.englishExtraBold },
};

export function fontForWeight(weight: FontWeight, locale: 'ar' | 'en'): string {
  return FONT_BY_WEIGHT[weight][locale];
}

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

// Soft, flat-design shadows — used instead of neon glow in the Taware2 look.
export const elevation = {
  none: {},
  sm: { shadowColor: '#08111F', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  md: { shadowColor: '#08111F', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  lg: { shadowColor: '#08111F', shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
};

// Colored "glow" shadow for the primary CTA / SOS button — a soft colored
// halo rather than the previous neon dark-mode-only treatment. Safe to use
// in both light and dark now (kept low-opacity).
export function glow(hexColor: string, opacity = 0.35, radius = 20) {
  return {
    shadowColor: hexColor,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 8 },
    elevation: Math.round(radius / 2),
  };
}

// Low-opacity color tint for icon badges, matching the reference's
// `${color}1A` (≈10% alpha) Tailwind pattern.
export function tint(hexColor: string, alpha = 0.1) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hexColor}${a}`;
}

// rgba() variant of tint() — for gradient stops, where a hex+alpha-suffix
// string isn't accepted by some native gradient implementations.
export function withAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

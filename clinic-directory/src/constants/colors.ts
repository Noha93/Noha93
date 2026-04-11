/**
 * Design System - Color Palette
 * Vintage + Blue Theme for دليل العيادات (Clinic Directory)
 */

export const Colors = {
  // ===== PRIMARY PALETTE =====
  primary: '#1B4F8A',        // Deep Vintage Blue
  primaryDark: '#0D2E52',    // Darker Blue
  primaryLight: '#2980B9',   // Medium Blue
  primaryUltraLight: '#EAF2FF', // Very Light Blue

  // ===== SECONDARY / VINTAGE =====
  secondary: '#C9A84C',      // Vintage Gold
  secondaryDark: '#A0782A',  // Dark Gold
  secondaryLight: '#E8C97A', // Light Gold
  secondaryUltraLight: '#FDF6E3', // Cream Gold

  // ===== BACKGROUNDS =====
  background: '#F5ECD7',     // Vintage Warm Cream
  backgroundWhite: '#FFFFFF',
  backgroundLight: '#FAF6EF', // Very Light Cream
  surface: '#FFFFFF',
  surfaceAlt: '#F8F4EC',     // Slightly Warm White

  // ===== TEXT =====
  textPrimary: '#1C2833',    // Very Dark Navy
  textSecondary: '#5D6D7E',  // Medium Gray Blue
  textMuted: '#95A5A6',      // Light Gray
  textWhite: '#FFFFFF',
  textGold: '#C9A84C',

  // ===== STATUS COLORS =====
  success: '#27AE60',
  successLight: '#EAFAF1',
  error: '#E74C3C',
  errorLight: '#FDEDEC',
  warning: '#F39C12',
  warningLight: '#FEF9E7',
  info: '#2980B9',
  infoLight: '#EBF5FB',

  // ===== BORDERS & DIVIDERS =====
  border: '#D5C9B5',
  borderLight: '#EDE3D0',
  divider: '#EAE0CC',

  // ===== GRADIENTS (used as arrays) =====
  gradientPrimary: ['#1B4F8A', '#2980B9'] as const,
  gradientGold: ['#C9A84C', '#E8C97A'] as const,
  gradientVintage: ['#1B4F8A', '#0D2E52'] as const,
  gradientCream: ['#F5ECD7', '#FAF6EF'] as const,
  gradientHero: ['#1B4F8A', '#2980B9', '#C9A84C'] as const,

  // ===== SPECIAL =====
  overlay: 'rgba(27, 79, 138, 0.85)',
  overlayDark: 'rgba(13, 46, 82, 0.92)',
  shadow: 'rgba(27, 79, 138, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',

  // ===== OPEN/CLOSED STATUS =====
  open: '#27AE60',
  closed: '#E74C3C',

  // ===== RATING =====
  star: '#F39C12',
  starEmpty: '#D5C9B5',

  // ===== TAB BAR =====
  tabActive: '#1B4F8A',
  tabInactive: '#95A5A6',
  tabBackground: '#FFFFFF',

  // ===== CARD =====
  cardBackground: '#FFFFFF',
  cardBorder: '#EDE3D0',
  cardShadow: 'rgba(27, 79, 138, 0.08)',
};

export default Colors;

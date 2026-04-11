/**
 * Design System - Spacing & Layout
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#1B4F8A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B4F8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1B4F8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0D2E52',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const Layout = {
  screenPaddingH: 20,
  screenPaddingV: 16,
  cardPadding: 16,
  sectionSpacing: 24,
  headerHeight: 60,
  tabBarHeight: 70,
  inputHeight: 52,
  buttonHeight: 52,
  buttonHeightSm: 40,
  buttonHeightLg: 60,
  avatarSm: 40,
  avatarMd: 56,
  avatarLg: 80,
  avatarXl: 100,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
};

export default { Spacing, BorderRadius, Shadow, Layout };

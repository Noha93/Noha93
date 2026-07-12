import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { readJSON, writeJSON } from '../utils/storage';
import { lightColors, darkColors, type ThemeColors, type ColorScheme } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_MODE_KEY = 'tawari:themeMode';

interface ThemeContextValue {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    readJSON<ThemeMode>(THEME_MODE_KEY, 'system').then(setModeState);
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    writeJSON(THEME_MODE_KEY, next);
  };

  const scheme: ColorScheme = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const value = useMemo(() => ({ mode, scheme, colors, setMode }), [mode, scheme, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

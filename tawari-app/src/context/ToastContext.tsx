import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppText } from '../components/AppText';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from './ThemeContext';

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage(msg);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
          setMessage(null);
        });
      }, 2600);
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
          <AppText weight="bodyMedium" color="#fff" style={styles.text}>
            {message}
          </AppText>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      top: 56,
      alignSelf: 'center',
      // always a dark bubble (ink is dark in both light & dark schemes) so the
      // white toast text stays legible regardless of theme
      backgroundColor: colors.ink,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      zIndex: 200,
      maxWidth: '86%',
    },
    text: {
      fontSize: 12.5,
      textAlign: 'center',
    },
  });
}

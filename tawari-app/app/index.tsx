import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon } from '../src/components/AppIcon';
import { useLocale } from '../src/context/LocaleContext';
import { useTheme } from '../src/context/ThemeContext';
import { glow, radius } from '../src/constants/theme';
import { readJSON, STORAGE_KEYS } from '../src/utils/storage';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const { colors } = useTheme();
  const [ready, setReady] = useState(false);
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 160, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  useEffect(() => {
    readJSON<boolean>(STORAGE_KEYS.onboarded, false).then((onboarded) => {
      setReady(true);
      const timer = setTimeout(() => {
        router.replace(onboarded ? '/home' : '/onboarding');
      }, 1600);
      return () => clearTimeout(timer);
    });
  }, [router]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.navy }]}>
      <View style={[styles.glow, { backgroundColor: colors.primary }]} />
      <Animated.View style={{ alignItems: 'center', opacity, transform: [{ scale }] }}>
        <View style={styles.iconRing}>
          <View style={[styles.iconCore, { backgroundColor: colors.primary }, glow(colors.primary, 0.5, 30)]}>
            <AppIcon name="megaphone-outline" size={48} color="#fff" />
          </View>
        </View>
        <AppText weight="displayExtraBold" color="#fff" style={styles.title}>
          {t('brand.name')}
        </AppText>
        <AppText color="rgba(255,255,255,0.7)" style={styles.tagline}>
          {t('splash.tagline')}
        </AppText>
      </Animated.View>
      {ready ? (
        <View style={styles.footer}>
          <View style={[styles.spinner, { borderTopColor: colors.primary }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  glow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.2 },
  iconRing: { alignItems: 'center', justifyContent: 'center' },
  iconCore: { width: 96, height: 96, borderRadius: radius.xxl, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 40, marginTop: 28 },
  tagline: { fontSize: 13, marginTop: 10, textAlign: 'center', paddingHorizontal: 32 },
  footer: { position: 'absolute', bottom: 64, alignItems: 'center' },
  spinner: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
});

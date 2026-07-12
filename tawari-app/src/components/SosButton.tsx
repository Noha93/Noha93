import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from './AppText';
import { radius, spacing } from '../constants/theme';
import type { SosService } from '../constants/services';

const HOLD_DURATION = 3000;

interface Props {
  service: SosService;
  subtitle: string;
  onPress: () => void;
  onAutoTrigger: () => void;
}

export function SosButton({ service, subtitle, onPress, onAutoTrigger }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const triggeredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressIn = () => {
    triggeredRef.current = false;
    Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
    Animated.timing(progress, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onAutoTrigger();
    }, HOLD_DURATION);
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
    clearTimer();
    const wasTriggered = triggeredRef.current;
    Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    if (!wasTriggered) {
      onPress();
    }
    triggeredRef.current = false;
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.btn, { backgroundColor: service.color }]}
      >
        <View style={styles.icon}>
          <AppText style={styles.iconText}>{service.icon}</AppText>
        </View>
        <View style={styles.textWrap}>
          <AppText weight="displayExtraBold" color="#fff" style={styles.title}>
            {service.name}
          </AppText>
          <AppText color="rgba(255,255,255,0.9)" style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>
        <Animated.View style={[styles.progressBar, { width: barWidth }]} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.lg,
    paddingVertical: 22,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 2,
  },
});

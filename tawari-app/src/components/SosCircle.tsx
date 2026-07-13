import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import type { SosService } from '../constants/services';

const HOLD_DURATION = 3000;
const SIZE = 104;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  service: SosService;
  onPress: () => void;
  onAutoTrigger: () => void;
}

export function SosCircle({ service, onPress, onAutoTrigger }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const triggeredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressIn = () => {
    triggeredRef.current = false;
    Animated.timing(scale, { toValue: 0.94, duration: 100, useNativeDriver: true }).start();
    Animated.timing(progress, { toValue: 1, duration: HOLD_DURATION, easing: Easing.linear, useNativeDriver: true }).start();
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
    Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    if (!wasTriggered) onPress();
    triggeredRef.current = false;
  };

  const ring1Scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] });
  const ring1Opacity = pulse.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.28, 0.1, 0] });
  const ring2Scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
  const ring2Opacity = pulse.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.35, 0.15, 0] });

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, { backgroundColor: service.color, transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, { backgroundColor: service.color, transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]}
      />
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#FFFFFF"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          originX={SIZE / 2}
          originY={SIZE / 2}
        />
      </Svg>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
          <View style={[styles.core, { backgroundColor: service.color }]}>
            <AppIcon name={service.icon} size={34} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>
      <AppText weight="displayExtraBold" color="#fff" style={styles.label}>
        {service.name}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE + 20,
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 10,
  },
  pressable: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: SIZE - STROKE * 2 - 6,
    height: SIZE - STROKE * 2 - 6,
    borderRadius: (SIZE - STROKE * 2 - 6) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  label: {
    marginTop: 10,
    fontSize: 13,
  },
});

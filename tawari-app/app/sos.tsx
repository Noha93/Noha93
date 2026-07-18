import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppText } from '../src/components/AppText';
import { AppIcon } from '../src/components/AppIcon';
import { BottomSheet } from '../src/components/BottomSheet';
import { SheetButton } from '../src/components/SheetButton';
import { useLocale, rowDir, type Dir } from '../src/context/LocaleContext';
import { useTheme } from '../src/context/ThemeContext';
import { glow, radius, spacing, type ThemeColors } from '../src/constants/theme';
import { placeCall } from '../src/utils/share';

const HOLD_MS = 3000;
const SIZE = 224;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SosScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  const [holding, setHolding] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    timerRef.current = null;
    tickRef.current = null;
  };

  useEffect(() => () => clearTimers(), []);

  const beginHold = () => {
    if (triggered) return;
    setHolding(true);
    setCountdown(3);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Animated.timing(progress, { toValue: 1, duration: HOLD_MS, easing: Easing.linear, useNativeDriver: true }).start();
    tickRef.current = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    timerRef.current = setTimeout(async () => {
      clearTimers();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTriggered(true);
      setHolding(false);
      await placeCall('122');
    }, HOLD_MS);
  };

  const endHold = () => {
    clearTimers();
    if (!triggered) {
      setHolding(false);
      Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    }
  };

  const strokeDashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [CIRCUMFERENCE, 0] });

  return (
    <View style={styles.screen}>
      <View style={[styles.topRow, { flexDirection: rowDir(dir) }]}>
        <AppText weight="displayExtraBold" color="#fff" style={styles.title}>{t('sos.title')}</AppText>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <AppIcon name="close-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.center}>
        <AppText color="rgba(255,255,255,0.7)" style={styles.hint}>
          {holding ? t('sos.holdingHint', { count: countdown }) : triggered ? t('sos.activatedHint') : t('sos.idleHint')}
        </AppText>

        <Pressable onPressIn={beginHold} onPressOut={endHold} style={styles.pressWrap}>
          {(holding || triggered) ? (
            <View style={[styles.pulseRing, { backgroundColor: colors.primary }]} />
          ) : null}
          <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="rgba(255,255,255,0.15)" strokeWidth={STROKE} fill="none" />
            <AnimatedCircle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              stroke="#fff" strokeWidth={STROKE} fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation={-90}
              originX={SIZE / 2}
              originY={SIZE / 2}
            />
          </Svg>
          <View style={[styles.core, { backgroundColor: triggered ? colors.success : colors.primary }, glow(triggered ? colors.success : colors.primary, 0.5, 24)]}>
            <AppIcon name="warning-outline" size={54} color="#fff" />
            <AppText weight="displayExtraBold" color="#fff" style={styles.sosLabel}>SOS</AppText>
          </View>
        </Pressable>

        <AppText color="rgba(255,255,255,0.4)" style={styles.footerHint}>{t('sos.autoNote')}</AppText>
      </View>

      <View style={styles.bottomTools}>
        <Pressable onPress={() => router.push('/silent')} style={styles.silentBtn}>
          <AppIcon name="volume-mute-outline" size={22} color="#fff" />
          <View style={{ flex: 1 }}>
            <AppText weight="bodyBold" color="#fff" style={styles.silentTitle}>{t('sos.silentTitle')}</AppText>
            <AppText color="rgba(255,255,255,0.5)" style={styles.silentSub}>{t('sos.silentSub')}</AppText>
          </View>
        </Pressable>
        <View style={[styles.toolsRow, { flexDirection: rowDir(dir) }]}>
          <View style={styles.toolBtn}>
            <AppIcon name="flash-outline" size={18} color={colors.warn} />
            <AppText weight="bodyMedium" color="#fff" style={styles.toolText}>{t('sos.flashlight')}</AppText>
          </View>
          <Pressable onPress={() => router.push('/share-location')} style={styles.toolBtn}>
            <AppIcon name="location-outline" size={18} color={colors.police} />
            <AppText weight="bodyMedium" color="#fff" style={styles.toolText}>{t('sos.location')}</AppText>
          </Pressable>
        </View>
      </View>

      <BottomSheet visible={triggered} onClose={() => setTriggered(false)}>
        <AppText weight="bodyBold" style={styles.sheetTitle}>{t('sos.gettingHelp')}</AppText>
        <View style={{ gap: 8, marginTop: spacing.md, marginBottom: spacing.md }}>
          {[{ icon: 'call-outline' as const, label: t('sos.callingLabel') }, { icon: 'location-outline' as const, label: t('sos.sendingLocation') }].map((x) => (
            <View key={x.label} style={[styles.stepRow, { flexDirection: rowDir(dir) }]}>
              <View style={[styles.stepIcon, { backgroundColor: 'rgba(46,204,113,0.15)' }]}>
                <AppIcon name={x.icon} size={16} color={colors.success} />
              </View>
              <AppText weight="bodyMedium" style={{ flex: 1, fontSize: 12.5 }}>{x.label}</AppText>
              <AppText color={colors.success} weight="bodyBold" style={{ fontSize: 12 }}>✓</AppText>
            </View>
          ))}
        </View>
        <SheetButton label={t('sos.cancel')} variant="secondary" onPress={() => { setTriggered(false); progress.setValue(0); }} />
      </BottomSheet>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.navy, paddingBottom: 30 },
    topRow: { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
    title: { fontSize: 19 },
    closeBtn: { width: 38, height: 38, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
    hint: { fontSize: 13, textAlign: 'center', marginBottom: 36 },
    pressWrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
    pulseRing: { position: 'absolute', width: SIZE, height: SIZE, borderRadius: SIZE / 2, opacity: 0.3 },
    core: {
      width: SIZE - STROKE * 2 - 20,
      height: SIZE - STROKE * 2 - 20,
      borderRadius: (SIZE - STROKE * 2 - 20) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sosLabel: { fontSize: 22, marginTop: 6 },
    footerHint: { fontSize: 11, textAlign: 'center', marginTop: 28 },
    bottomTools: { paddingHorizontal: spacing.lg, gap: spacing.sm },
    silentBtn: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 12,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    silentTitle: { fontSize: 13.5 },
    silentSub: { fontSize: 10.5, marginTop: 2 },
    toolsRow: { gap: spacing.sm },
    toolBtn: {
      flex: 1,
      flexDirection: rowDir(dir),
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 52,
      borderRadius: radius.lg,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
    },
    toolText: { fontSize: 12.5 },
    sheetTitle: { fontSize: 16, textAlign: 'center' },
    stepRow: { alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 10 },
    stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  });
}

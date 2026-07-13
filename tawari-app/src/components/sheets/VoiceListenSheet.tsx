import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { AppText } from '../AppText';
import { AppIcon } from '../AppIcon';
import { SheetButton } from '../SheetButton';
import { colors, spacing, type ThemeColors } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { VoiceStatus } from '../../hooks/useVoiceReport';

interface Props {
  status: VoiceStatus;
  transcript: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function VoiceListenSheet({ status, transcript, onRetry, onCancel }: Props) {
  const { colors: themeColors } = useTheme();
  const { t } = useLocale();
  const styles = useMemo(() => createStyles(themeColors), [themeColors]);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== 'listening') return;
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [status, pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  return (
    <View style={styles.wrap}>
      <View style={styles.micWrap}>
        {status === 'listening' ? (
          <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        ) : null}
        <View style={[styles.micCore, status === 'error' && { backgroundColor: colors.fire }]}>
          <AppIcon name="microphone" size={32} color="#fff" />
        </View>
      </View>

      <AppText weight="displayExtraBold" style={styles.title}>
        {status === 'listening' && t('voice.listeningTitle')}
        {status === 'no-match' && t('voice.noMatchTitle')}
        {status === 'error' && t('voice.errorTitle')}
        {status === 'idle' && t('voice.idleTitle')}
      </AppText>

      <AppText color={themeColors.textMuted} style={styles.sub}>
        {status === 'listening' && t('voice.listeningHint')}
        {status === 'no-match' && t('voice.noMatchHint', { transcript: transcript || '—' })}
        {status === 'error' && t('voice.errorHint')}
        {status === 'idle' && ''}
      </AppText>

      {status === 'listening' && transcript ? (
        <View style={styles.transcriptBox}>
          <AppText style={styles.transcriptText}>{transcript}</AppText>
        </View>
      ) : null}

      {status === 'no-match' || status === 'error' ? (
        <SheetButton label={t('voice.retry')} icon="microphone" color={colors.voice} onPress={onRetry} />
      ) : null}
      <SheetButton label={t('common.cancel')} variant="outline" onPress={onCancel} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      paddingVertical: 6,
    },
    micWrap: {
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    ring: {
      position: 'absolute',
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.voice,
    },
    micCore: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: colors.voice,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 17,
      marginBottom: 6,
      textAlign: 'center',
    },
    sub: {
      fontSize: 12.5,
      textAlign: 'center',
      lineHeight: 19,
      marginBottom: spacing.md,
    },
    transcriptBox: {
      backgroundColor: colors.bg,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: spacing.lg,
      width: '100%',
    },
    transcriptText: {
      fontSize: 13,
      textAlign: 'center',
    },
  });
}

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../constants/theme';

interface Props {
  onPress: () => void;
}

export function VoiceReportButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <AppText style={styles.icon}>🎙️</AppText>
      </View>
      <View style={styles.textWrap}>
        <AppText weight="bodyBold" color="#fff" style={styles.title}>
          بلّغي بصوتك
        </AppText>
        <AppText color="rgba(255,255,255,0.75)" style={styles.sub}>
          "عايزة أبلغ عن حريق" وهنفتحلك الزرار المناسب
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.voice,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
  sub: {
    fontSize: 11,
    marginTop: 2,
  },
});

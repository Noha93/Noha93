import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { colors, spacing } from '../../src/constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.screen}>
      <AppText style={styles.icon}>🗺️</AppText>
      <AppText weight="displayExtraBold" style={styles.title}>
        خريطة أقرب نقاط الإنقاذ
      </AppText>
      <AppText color={colors.textMuted} style={styles.sub}>
        هنعرض هنا أقرب نقاط إطفاء وإسعاف وشرطة — قريبًا في مرحلة تانية من التطبيق
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.md,
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
  },
});

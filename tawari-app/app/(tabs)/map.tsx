import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { spacing, type ThemeColors } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';

export default function MapScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.screen}>
      <ScreenHeader title="الخريطة" subtitle="أقرب نقاط الإنقاذ حواليكِ" icon="🗺️" />
      <View style={styles.placeholder}>
        <AppText style={styles.icon}>🗺️</AppText>
        <AppText weight="displayExtraBold" style={styles.title}>
          خريطة أقرب نقاط الإنقاذ
        </AppText>
        <AppText color={colors.textMuted} style={styles.sub}>
          هنعرض هنا أقرب نقاط إطفاء وإسعاف وشرطة — قريبًا في مرحلة تانية من التطبيق
        </AppText>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    placeholder: {
      flex: 1,
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
}

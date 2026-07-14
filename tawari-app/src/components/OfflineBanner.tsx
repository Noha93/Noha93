import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { glow, radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useNetwork } from '../context/NetworkContext';
import { useLocale, rowDir, type Dir } from '../context/LocaleContext';

export function OfflineBanner() {
  const { isOnline } = useNetwork();
  const { colors, scheme } = useTheme();
  const { dir, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  if (isOnline) return null;

  return (
    <View style={[styles.banner, scheme === 'dark' && glow(colors.warn, 0.3, 10)]}>
      <AppIcon name="cloud-offline-outline" size={16} color={colors.warn} />
      <AppText color={colors.text} style={styles.text}>
        {t('offline.banner')}
      </AppText>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    banner: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(245,158,11,0.12)',
      borderWidth: 1,
      borderColor: colors.warn,
      borderRadius: radius.md,
      marginHorizontal: spacing.lg,
      marginTop: spacing.sm,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
    },
    text: {
      fontSize: 11.5,
      flex: 1,
      lineHeight: 16,
    },
  });
}

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { AppIcon, type IconName } from './AppIcon';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title: string;
  subtitle?: string;
  icon?: IconName;
}

export function ScreenHeader({ title, subtitle, icon }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.band}>
      <View style={styles.titleRow}>
        {icon ? <AppIcon name={icon} size={20} color="#fff" /> : null}
        <AppText weight="displayExtraBold" color="#fff" style={styles.title}>
          {title}
        </AppText>
      </View>
      {subtitle ? (
        <AppText color={colors.onInk} style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    band: {
      backgroundColor: colors.ink,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    titleRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 20,
    },
    subtitle: {
      fontSize: 12,
      marginTop: 4,
    },
  });
}

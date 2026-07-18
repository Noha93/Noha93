import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from './AppText';
import { AppIcon, type IconName } from './AppIcon';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../context/LocaleContext';

interface Props {
  title: string;
  subtitle?: string;
  icon?: IconName;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, icon, onBack, right }: Props) {
  const { colors } = useTheme();
  const { dir } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  return (
    <View style={styles.band}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <AppIcon name={dir === 'rtl' ? 'chevron-forward-outline' : 'chevron-back-outline'} size={20} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            {icon ? <AppIcon name={icon} size={18} color={colors.primary} /> : null}
            <AppText weight="displayExtraBold" style={styles.title}>
              {title}
            </AppText>
          </View>
          {subtitle ? (
            <AppText color={colors.textMuted} style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

function useBackToRouter() {
  const router = useRouter();
  return () => router.back();
}

export function useScreenBack() {
  return useBackToRouter();
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    band: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    row: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: spacing.sm,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleWrap: {
      flex: 1,
    },
    titleRow: {
      flexDirection: rowDir(dir),
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

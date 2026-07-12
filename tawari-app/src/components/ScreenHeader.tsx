import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function ScreenHeader({ title, subtitle, icon }: Props) {
  return (
    <View style={styles.band}>
      <View style={styles.titleRow}>
        {icon ? <AppText style={styles.icon}>{icon}</AppText> : null}
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

const styles = StyleSheet.create({
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
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});

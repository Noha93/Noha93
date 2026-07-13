import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { colors, spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';

interface Props {
  serviceLabel: string;
  onResolved: () => void;
  onNotResolved: () => void;
}

export function PostCallSheet({ serviceLabel, onResolved, onNotResolved }: Props) {
  const { colors: themeColors } = useTheme();
  const { t } = useLocale();
  return (
    <>
      <AppText weight="displayExtraBold" style={styles.title}>
        {t('postCall.title')}
      </AppText>
      <AppText color={themeColors.textMuted} style={styles.sub}>
        {t('postCall.question', { label: serviceLabel })}
      </AppText>
      <SheetButton label={t('postCall.resolved')} icon="checkmark-circle-outline" color={colors.success} onPress={onResolved} />
      <SheetButton label={t('postCall.notResolved')} icon="alert-circle-outline" color={colors.fire} onPress={onNotResolved} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

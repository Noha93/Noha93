import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';

interface Props {
  label: string;
  number: string;
  color: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CallConfirmSheet({ label, number, color, onConfirm, onCancel }: Props) {
  const { colors } = useTheme();
  const { t } = useLocale();
  return (
    <>
      <AppText weight="displayExtraBold" color={color} style={styles.title}>
        {t('callConfirm.title')}
      </AppText>
      <AppText color={colors.textMuted} style={styles.sub}>
        {t('callConfirm.question', { label, number })}
      </AppText>
      <SheetButton label={t('callConfirm.confirm')} icon="phone" color={color} onPress={onConfirm} />
      <SheetButton label={t('common.cancel')} variant="outline" onPress={onCancel} />
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
    lineHeight: 20,
  },
});

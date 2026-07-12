import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { spacing } from '../../constants/theme';

interface Props {
  label: string;
  number: string;
  color: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CallConfirmSheet({ label, number, color, onConfirm, onCancel }: Props) {
  return (
    <>
      <AppText weight="displayExtraBold" color={color} style={styles.title}>
        تأكيد الاتصال
      </AppText>
      <AppText color="#6B7280" style={styles.sub}>
        هل أنت متأكد أنك تريد الاتصال بـ{'\n'}
        <AppText weight="bodyBold" color={color}>
          {label}
        </AppText>{' '}
        على الرقم <AppText weight="bodyBold">{number}</AppText>؟
      </AppText>
      <SheetButton label="✅ نعم، اتصل الآن" color={color} onPress={onConfirm} />
      <SheetButton label="إلغاء" variant="outline" onPress={onCancel} />
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

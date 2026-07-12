import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { radius, spacing, type ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import type { EmergencyContact } from '../context/ContactsContext';

interface Props {
  contact: EmergencyContact;
  onRemove?: () => void;
}

export function ContactRow({ contact, onRemove }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const initials = contact.name.trim().slice(0, 2);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <AppText weight="bodyBold" color="#fff" style={styles.avatarText}>
            {initials}
          </AppText>
        </View>
        <View>
          <AppText weight="bodyBold" style={styles.name}>
            {contact.name}
          </AppText>
          <AppText color={colors.textMuted} style={styles.phone}>
            {contact.phone}
          </AppText>
        </View>
      </View>
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={10}>
          <AppText color={colors.fire} style={styles.remove}>
            حذف
          </AppText>
        </Pressable>
      ) : (
        <AppText style={styles.check}>✓</AppText>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 12,
    },
    name: {
      fontSize: 12.5,
    },
    phone: {
      fontSize: 10.5,
      marginTop: 2,
    },
    check: {
      fontSize: 16,
    },
    remove: {
      fontSize: 12,
    },
  });
}

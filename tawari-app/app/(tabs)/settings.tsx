import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { AppIcon, type IconName } from '../../src/components/AppIcon';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ContactRow } from '../../src/components/ContactRow';
import { MedicalSection } from '../../src/components/MedicalSection';
import { SheetButton } from '../../src/components/SheetButton';
import { useContacts, MAX_CONTACTS } from '../../src/context/ContactsContext';
import { useToast } from '../../src/context/ToastContext';
import { useTheme, type ThemeMode } from '../../src/context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir, type Locale } from '../../src/context/LocaleContext';
import { fontForWeight, radius, spacing, type ThemeColors } from '../../src/constants/theme';

const THEME_OPTIONS: { mode: ThemeMode; icon: IconName }[] = [
  { mode: 'light', icon: 'sunny-outline' },
  { mode: 'dark', icon: 'moon-outline' },
  { mode: 'system', icon: 'contrast-outline' },
];

const LANGUAGE_OPTIONS: { locale: Locale; key: string }[] = [
  { locale: 'ar', key: 'settings.languageArabic' },
  { locale: 'en', key: 'settings.languageEnglish' },
];

export default function SettingsScreen() {
  const { contacts, addContact, removeContact } = useContacts();
  const { showToast } = useToast();
  const { colors, mode, setMode } = useTheme();
  const { locale, dir, t, setLocale } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const canAddMore = contacts.length < MAX_CONTACTS;

  const themeLabel = (m: ThemeMode) =>
    m === 'light' ? t('settings.themeLight') : m === 'dark' ? t('settings.themeDark') : t('settings.themeSystem');

  const handleAdd = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      showToast(t('settings.toastMissingFields'));
      return;
    }
    const ok = await addContact({ name: trimmedName, phone: trimmedPhone });
    if (!ok) {
      showToast(t('settings.toastMaxReached', { max: MAX_CONTACTS }));
      return;
    }
    setName('');
    setPhone('');
    showToast(t('settings.toastAdded'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={t('settings.title')} subtitle={t('settings.subtitle', { max: MAX_CONTACTS })} icon="settings-outline" />

        <View style={styles.body}>
        <AppText weight="bodyBold" style={styles.sectionTitle}>
          {t('settings.language')}
        </AppText>
        <View style={styles.themeRow}>
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = locale === opt.locale;
            return (
              <Pressable
                key={opt.locale}
                onPress={() => setLocale(opt.locale)}
                style={[styles.themeOption, active && styles.themeOptionActive]}
              >
                <AppIcon name="language-outline" size={18} color={active ? '#fff' : colors.textMuted} />
                <AppText
                  weight={active ? 'bodyBold' : 'body'}
                  color={active ? '#fff' : colors.textMuted}
                  style={styles.themeLabel}
                >
                  {t(opt.key)}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText weight="bodyBold" style={styles.sectionTitle}>
          {t('settings.appearance')}
        </AppText>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                onPress={() => setMode(opt.mode)}
                style={[styles.themeOption, active && styles.themeOptionActive]}
              >
                <AppIcon name={opt.icon} size={18} color={active ? '#fff' : colors.textMuted} />
                <AppText
                  weight={active ? 'bodyBold' : 'body'}
                  color={active ? '#fff' : colors.textMuted}
                  style={styles.themeLabel}
                >
                  {themeLabel(opt.mode)}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText weight="bodyBold" style={styles.sectionTitle}>
          {t('settings.contactsHeader')}
        </AppText>
        {contacts.length === 0 ? (
          <AppText color={colors.textMuted} style={styles.empty}>
            {t('settings.emptyContacts')}
          </AppText>
        ) : (
          contacts.map((c) => <ContactRow key={c.id} contact={c} onRemove={() => removeContact(c.id)} />)
        )}

        <View style={styles.form}>
          <AppText weight="bodyBold" style={styles.formTitle}>
            {canAddMore ? t('settings.addNewContact') : t('settings.maxReached', { max: MAX_CONTACTS })}
          </AppText>
          {canAddMore ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('settings.namePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                textAlign={textAlignDir(dir)}
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t('settings.phonePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                keyboardType="phone-pad"
                textAlign={textAlignDir(dir)}
              />
              <SheetButton label={t('settings.addButton')} color={colors.primary} onPress={handleAdd} />
            </>
          ) : null}
        </View>

        <AppText color={colors.textMuted} style={styles.note}>
          {t('settings.note')}
        </AppText>

        <View style={styles.medicalSpacer}>
          <MedicalSection />
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingBottom: 60,
    },
    body: {
      paddingTop: spacing.lg,
    },
    sectionTitle: {
      paddingHorizontal: spacing.lg,
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    themeRow: {
      flexDirection: rowDir(dir),
      gap: spacing.xs,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeLabel: {
      fontSize: 11.5,
    },
    empty: {
      paddingHorizontal: spacing.lg,
      fontSize: 12,
      marginBottom: spacing.sm,
    },
    form: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    formTitle: {
      fontSize: 13,
      marginBottom: spacing.sm,
      textAlign: textAlignDir(dir),
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      marginBottom: spacing.sm,
      fontFamily: fontForWeight('body', dir === 'rtl' ? 'ar' : 'en'),
      color: colors.text,
    },
    note: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
      fontSize: 11,
      lineHeight: 17,
    },
    medicalSpacer: {
      marginTop: spacing.lg,
    },
  });
}

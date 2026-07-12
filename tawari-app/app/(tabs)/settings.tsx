import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { ContactRow } from '../../src/components/ContactRow';
import { SheetButton } from '../../src/components/SheetButton';
import { useContacts, MAX_CONTACTS } from '../../src/context/ContactsContext';
import { useToast } from '../../src/context/ToastContext';
import { colors, radius, spacing } from '../../src/constants/theme';

export default function SettingsScreen() {
  const { contacts, addContact, removeContact } = useContacts();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const canAddMore = contacts.length < MAX_CONTACTS;

  const handleAdd = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      showToast('من فضلك اكتبي الاسم ورقم الهاتف');
      return;
    }
    const ok = await addContact({ name: trimmedName, phone: trimmedPhone });
    if (!ok) {
      showToast(`أقصى عدد جهات اتصال هو ${MAX_CONTACTS}`);
      return;
    }
    setName('');
    setPhone('');
    showToast('تمت إضافة جهة الاتصال');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppText weight="displayExtraBold" style={styles.title}>
            الإعدادات
          </AppText>
          <AppText color={colors.textMuted} style={styles.subtitle}>
            جهات اتصال الطوارئ الخاصة بك (حتى {MAX_CONTACTS})
          </AppText>
        </View>

        {contacts.length === 0 ? (
          <AppText color={colors.textMuted} style={styles.empty}>
            لسه معنديش جهات اتصال محفوظة
          </AppText>
        ) : (
          contacts.map((c) => <ContactRow key={c.id} contact={c} onRemove={() => removeContact(c.id)} />)
        )}

        <View style={styles.form}>
          <AppText weight="bodyBold" style={styles.formTitle}>
            {canAddMore ? '+ إضافة جهة اتصال جديدة' : `وصلتي للحد الأقصى (${MAX_CONTACTS} جهات اتصال)`}
          </AppText>
          {canAddMore ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="الاسم (مثال: منى - الزوجة)"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                textAlign="right"
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="رقم الهاتف (مثال: 01012345678)"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                keyboardType="phone-pad"
                textAlign="right"
              />
              <SheetButton label="إضافة" color={colors.fire} onPress={handleAdd} />
            </>
          ) : null}
        </View>

        <AppText color={colors.textMuted} style={styles.note}>
          جهات الاتصال دي بتظهر جاهزة كل ما تحبي تشاركي موقعك عبر رسالة SMS بعد أي بلاغ طوارئ.
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
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
    borderRadius: radius.md,
    padding: spacing.md,
  },
  formTitle: {
    fontSize: 13,
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
    fontFamily: 'Tajawal_400Regular',
    color: colors.text,
  },
  note: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    fontSize: 11,
    lineHeight: 17,
  },
});

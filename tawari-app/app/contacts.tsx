import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { AppIcon } from '../src/components/AppIcon';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { BottomSheet } from '../src/components/BottomSheet';
import { SheetButton } from '../src/components/SheetButton';
import { useContacts, MAX_CONTACTS, type EmergencyContact } from '../src/context/ContactsContext';
import { useToast } from '../src/context/ToastContext';
import { useTheme } from '../src/context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir } from '../src/context/LocaleContext';
import { elevation, fontForWeight, radius, spacing, tint, type ThemeColors } from '../src/constants/theme';
import { placeCall, shareViaWhatsApp, shareViaSms } from '../src/utils/share';

export default function ContactsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { dir, t } = useLocale();
  const { contacts, addContact, updateContact, removeContact } = useContacts();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [open, setOpen] = useState(false);

  const startAdd = () => {
    setEditing({ id: '', name: '', phone: '', relation: '' });
    setOpen(true);
  };
  const startEdit = (c: EmergencyContact) => {
    setEditing(c);
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    const name = editing.name.trim();
    const phone = editing.phone.trim();
    if (!name || !phone) {
      showToast(t('settings.toastMissingFields'));
      return;
    }
    if (editing.id) {
      await updateContact(editing.id, { name, phone, relation: editing.relation.trim() });
    } else {
      const ok = await addContact({ name, phone, relation: editing.relation.trim() });
      if (!ok) {
        showToast(t('settings.toastMaxReached', { max: MAX_CONTACTS }));
        return;
      }
    }
    setOpen(false);
  };

  const actions = (c: EmergencyContact) => [
    { icon: 'call-outline' as const, color: colors.primary, onPress: () => placeCall(c.phone) },
    { icon: 'logo-whatsapp' as const, color: '#25D366', onPress: () => shareViaWhatsApp('', c.phone) },
    { icon: 'chatbubble-outline' as const, color: colors.police, onPress: () => shareViaSms('', [c.phone]) },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('settings.contactsHeader')}
        subtitle={t('settings.subtitle', { max: MAX_CONTACTS })}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {contacts.map((c) => (
          <View key={c.id} style={[styles.card, elevation.sm]}>
            <View style={[styles.row, { flexDirection: rowDir(dir) }]}>
              <View style={styles.avatar}>
                <AppText weight="bodyBold" color="#fff" style={styles.avatarText}>
                  {c.name.trim().slice(0, 2)}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="bodyBold" style={styles.name}>{c.name}</AppText>
                <AppText color={colors.textMuted} style={styles.relation}>{c.relation}</AppText>
                <AppText color={colors.textMuted} style={styles.phone}>{c.phone}</AppText>
              </View>
              <View style={styles.editDeleteCol}>
                <Pressable onPress={() => startEdit(c)} style={styles.iconBtn}>
                  <AppIcon name="create-outline" size={16} color={colors.text} />
                </Pressable>
                <Pressable onPress={() => removeContact(c.id)} style={[styles.iconBtn, { backgroundColor: tint(colors.fire, 0.12) }]}>
                  <AppIcon name="trash-outline" size={16} color={colors.fire} />
                </Pressable>
              </View>
            </View>
            <View style={[styles.actionsRow, { flexDirection: rowDir(dir) }]}>
              {actions(c).map((a, i) => (
                <Pressable key={i} onPress={a.onPress} style={[styles.actionBtn, { backgroundColor: tint(a.color) }]}>
                  <AppIcon name={a.icon} size={18} color={a.color} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {contacts.length < MAX_CONTACTS ? (
          <Pressable onPress={startAdd} style={styles.addCard}>
            <View style={styles.addIconWrap}>
              <AppIcon name="person-add-outline" size={22} color={colors.primary} />
            </View>
            <AppText weight="bodyBold" color={colors.textMuted} style={styles.addText}>
              {t('settings.addNewContact')}
            </AppText>
          </Pressable>
        ) : null}
      </ScrollView>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        {editing ? (
          <>
            <AppText weight="bodyBold" style={styles.sheetTitle}>
              {editing.id ? t('contacts.editContact') : t('contacts.newContact')}
            </AppText>
            <Field label={t('settings.namePlaceholder')} value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} dir={dir} colors={colors} />
            <Field label={t('contacts.relationPlaceholder')} value={editing.relation} onChange={(v) => setEditing({ ...editing, relation: v })} dir={dir} colors={colors} />
            <Field label={t('settings.phonePlaceholder')} value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} dir={dir} colors={colors} keyboardType="phone-pad" />
            <SheetButton label={t('settings.addButton')} color={colors.primary} onPress={save} icon="checkmark-outline" />
          </>
        ) : null}
      </BottomSheet>
    </View>
  );
}

function Field({ label, value, onChange, dir, colors, keyboardType }: {
  label: string; value: string; onChange: (v: string) => void; dir: Dir; colors: ThemeColors; keyboardType?: 'phone-pad';
}) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <AppText color={colors.textMuted} style={{ fontSize: 11.5, marginBottom: 4 }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textMuted}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface2,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: 10,
          color: colors.text,
          fontFamily: fontForWeight('body', dir === 'rtl' ? 'ar' : 'en'),
        }}
        textAlign={textAlignDir(dir)}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 40, gap: spacing.sm },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.md,
    },
    row: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: radius.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: 14 },
    name: { fontSize: 13.5 },
    relation: { fontSize: 11, marginTop: 1 },
    phone: { fontSize: 10.5, marginTop: 1 },
    editDeleteCol: { gap: 6 },
    iconBtn: {
      width: 30,
      height: 30,
      borderRadius: radius.pill,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionsRow: {
      gap: 8,
      marginTop: spacing.sm,
    },
    actionBtn: {
      flex: 1,
      height: 40,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addCard: {
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: radius.xl,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      gap: 8,
    },
    addIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: { fontSize: 12.5 },
    sheetTitle: { fontSize: 16, marginBottom: spacing.md, textAlign: 'center' },
  });
}

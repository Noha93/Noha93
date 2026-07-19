import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../../src/components/AppText';
import { AppIcon } from '../../src/components/AppIcon';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { BottomSheet } from '../../src/components/BottomSheet';
import { SheetButton } from '../../src/components/SheetButton';
import { useMedical } from '../../src/context/MedicalContext';
import { useContacts } from '../../src/context/ContactsContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale, rowDir, textAlignDir, type Dir } from '../../src/context/LocaleContext';
import { elevation, fontForWeight, radius, spacing, tint, type ThemeColors } from '../../src/constants/theme';
import type { MedicalProfile } from '../../src/context/MedicalContext';

export default function MedicalScreen() {
  const { colors } = useTheme();
  const { dir, t } = useLocale();
  const { profile, updateProfile } = useMedical();
  const { contacts } = useContacts();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);
  const [edit, setEdit] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [draft, setDraft] = useState<MedicalProfile>(profile);

  const rows: { key: keyof MedicalProfile; labelKey: string }[] = [
    { key: 'age', labelKey: 'medical.age' },
    { key: 'height', labelKey: 'medical.height' },
    { key: 'weight', labelKey: 'medical.weight' },
    { key: 'allergies', labelKey: 'medical.allergies' },
    { key: 'diseases', labelKey: 'medical.diseases' },
    { key: 'meds', labelKey: 'medical.meds' },
    { key: 'doctor', labelKey: 'medical.doctor' },
    { key: 'insurance', labelKey: 'medical.insurance' },
    { key: 'notes', labelKey: 'medical.notes' },
  ];

  const openEdit = () => {
    setDraft(profile);
    setEdit(true);
  };

  const save = async () => {
    await updateProfile(draft);
    setEdit(false);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('medical.header')} icon="pulse-outline" right={
        <SheetButton label="" onPress={openEdit} icon="create-outline" variant="secondary" style={styles.editBtn} />
      } />
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[colors.navy, colors.amb]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, elevation.md]}
        >
          <View style={styles.heroTop}>
            <View style={styles.bloodBadge}>
              <AppText weight="displayExtraBold" color="#fff" style={styles.bloodText}>
                {profile.blood || '—'}
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="bodyBold" color="#fff" style={styles.heroName} numberOfLines={1}>
                {profile.name || t('medical.namePlaceholder')}
              </AppText>
              <AppText color="rgba(255,255,255,0.65)" style={styles.heroAge}>
                {profile.age ? `${profile.age} ${t('medical.years')}` : t('medical.ageUnset')}
              </AppText>
            </View>
            <SheetButton label="" onPress={() => setShowQr(true)} icon="qr-code-outline" variant="secondary" style={styles.qrBtn} />
          </View>
        </LinearGradient>

        <View style={[styles.lockNote, { flexDirection: rowDir(dir) }]}>
          <AppIcon name="lock-closed-outline" size={16} color={colors.warn} />
          <AppText style={styles.lockNoteText}>{t('medical.lockNote')}</AppText>
        </View>

        <View style={[styles.rowsCard, elevation.sm]}>
          {rows.map((r, i) => (
            <View key={r.key} style={[styles.detailRow, i < rows.length - 1 && styles.detailRowBorder, { flexDirection: rowDir(dir) }]}>
              <AppText color={colors.textMuted} style={styles.detailLabel}>
                {t(r.labelKey)}
              </AppText>
              <AppText weight="bodyBold" style={styles.detailValue}>
                {profile[r.key] || '—'}
              </AppText>
            </View>
          ))}
        </View>

        <AppText weight="bodyBold" style={styles.sectionTitle}>
          {t('home.contactsHeader')}
        </AppText>
        <View style={{ gap: spacing.xs }}>
          {contacts.length === 0 ? (
            <AppText color={colors.textMuted} style={styles.emptyContacts}>
              {t('home.emptyContacts')}
            </AppText>
          ) : (
            contacts.map((c) => (
              <View key={c.id} style={[styles.contactRow, elevation.sm, { flexDirection: rowDir(dir) }]}>
                <View style={styles.contactAvatar}>
                  <AppText weight="bodyBold" color="#fff" style={styles.contactAvatarText}>
                    {c.name.trim().slice(0, 2)}
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText weight="bodyBold" style={styles.contactName}>{c.name}</AppText>
                  <AppText color={colors.textMuted} style={styles.contactRelation}>{c.relation}</AppText>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomSheet visible={showQr} onClose={() => setShowQr(false)}>
        <View style={styles.qrSheetInner}>
          <AppText weight="bodyBold" style={styles.qrTitle}>{t('medical.qrTitle')}</AppText>
          <AppText color={colors.textMuted} style={styles.qrSub}>{t('medical.qrSub')}</AppText>
          <View style={styles.qrBox}>
            <QrPattern colors={colors} />
          </View>
          <AppText weight="bodyBold" style={styles.qrFooter}>
            {(profile.name || t('medical.namePlaceholder'))} · {profile.blood || '—'}
          </AppText>
        </View>
      </BottomSheet>

      <BottomSheet visible={edit} onClose={() => setEdit(false)}>
        <AppText weight="bodyBold" style={styles.editTitle}>{t('medical.editTitle')}</AppText>
        <Field label={t('medical.name')} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} dir={dir} colors={colors} />
        <View style={[styles.fieldRow, { flexDirection: rowDir(dir) }]}>
          <View style={{ flex: 1 }}>
            <Field label={t('medical.age')} value={draft.age} onChange={(v) => setDraft({ ...draft, age: v })} dir={dir} colors={colors} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label={t('medical.blood')} value={draft.blood} onChange={(v) => setDraft({ ...draft, blood: v })} dir={dir} colors={colors} />
          </View>
        </View>
        <View style={[styles.fieldRow, { flexDirection: rowDir(dir) }]}>
          <View style={{ flex: 1 }}>
            <Field label={t('medical.height')} value={draft.height} onChange={(v) => setDraft({ ...draft, height: v })} dir={dir} colors={colors} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label={t('medical.weight')} value={draft.weight} onChange={(v) => setDraft({ ...draft, weight: v })} dir={dir} colors={colors} />
          </View>
        </View>
        <Field label={t('medical.allergies')} value={draft.allergies} onChange={(v) => setDraft({ ...draft, allergies: v })} dir={dir} colors={colors} />
        <Field label={t('medical.diseases')} value={draft.diseases} onChange={(v) => setDraft({ ...draft, diseases: v })} dir={dir} colors={colors} />
        <Field label={t('medical.meds')} value={draft.meds} onChange={(v) => setDraft({ ...draft, meds: v })} dir={dir} colors={colors} />
        <Field label={t('medical.doctor')} value={draft.doctor} onChange={(v) => setDraft({ ...draft, doctor: v })} dir={dir} colors={colors} />
        <Field label={t('medical.insurance')} value={draft.insurance} onChange={(v) => setDraft({ ...draft, insurance: v })} dir={dir} colors={colors} />
        <Field label={t('medical.notes')} value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} dir={dir} colors={colors} />
        <SheetButton label={t('medical.save')} color={colors.primary} onPress={save} icon="checkmark-outline" />
      </BottomSheet>
    </View>
  );
}

function Field({ label, value, onChange, dir, colors }: { label: string; value: string; onChange: (v: string) => void; dir: Dir; colors: ThemeColors }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <AppText color={colors.textMuted} style={{ fontSize: 11.5, marginBottom: 4 }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChange}
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

function QrPattern({ colors }: { colors: ThemeColors }) {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => (i * 7 + (i % 5) * 3 + Math.floor(i / 21)) % 3 === 0);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 21 * 8 }}>
      {cells.map((on, i) => (
        <View key={i} style={{ width: 8, height: 8, backgroundColor: on ? colors.navy : '#fff' }} />
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
    editBtn: { width: 40, paddingVertical: 0, height: 40, marginBottom: 0 },
    qrBtn: { width: 44, paddingVertical: 0, height: 44, marginBottom: 0 },
    hero: {
      backgroundColor: colors.navy,
      borderRadius: radius.xl,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    heroTop: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: spacing.sm,
    },
    bloodBadge: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bloodText: { fontSize: 17 },
    heroName: { fontSize: 16 },
    heroAge: { fontSize: 11, marginTop: 3 },
    lockNote: {
      alignItems: 'center',
      gap: 8,
      backgroundColor: tint(colors.warn, 0.12),
      borderRadius: radius.md,
      padding: spacing.sm,
      marginTop: spacing.md,
    },
    lockNoteText: { fontSize: 11.5, flex: 1, lineHeight: 16 },
    rowsCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.xl,
      marginTop: spacing.md,
    },
    detailRow: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.md,
      padding: spacing.md,
    },
    detailRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailLabel: { fontSize: 12.5, flexShrink: 0 },
    detailValue: { fontSize: 12.5, flex: 1, textAlign: dir === 'rtl' ? 'left' : 'right' },
    sectionTitle: { fontSize: 13, marginTop: spacing.lg, marginBottom: spacing.sm },
    emptyContacts: { fontSize: 12, lineHeight: 18 },
    contactRow: {
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.sm,
    },
    contactAvatar: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactAvatarText: { fontSize: 12 },
    contactName: { fontSize: 12.5 },
    contactRelation: { fontSize: 10.5, marginTop: 1 },
    qrSheetInner: { alignItems: 'center' },
    qrTitle: { fontSize: 16 },
    qrSub: { fontSize: 12, textAlign: 'center', marginTop: 4, marginBottom: spacing.md },
    qrBox: { padding: spacing.md, backgroundColor: '#fff', borderRadius: radius.lg },
    qrFooter: { marginTop: spacing.md, fontSize: 13 },
    editTitle: { fontSize: 16, marginBottom: spacing.md, textAlign: 'center' },
    fieldRow: { gap: spacing.sm },
  });
}

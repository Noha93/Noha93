import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../src/components/AppText';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { LocationBox } from '../src/components/LocationBox';
import { SheetButton } from '../src/components/SheetButton';
import { useLocation } from '../src/hooks/useLocation';
import { useContacts } from '../src/context/ContactsContext';
import { useMedical } from '../src/context/MedicalContext';
import { useNetwork } from '../src/context/NetworkContext';
import { useToast } from '../src/context/ToastContext';
import { useTheme } from '../src/context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../src/context/LocaleContext';
import { glow, radius, spacing, type ThemeColors } from '../src/constants/theme';
import { emergencyMessage, shareViaWhatsApp, shareViaSms, shareViaSheet, copyLocationLink } from '../src/utils/share';

export default function ShareLocationScreen() {
  const router = useRouter();
  const { coords, status: locationStatus, requestLocation } = useLocation();
  const { contacts } = useContacts();
  const { profile, hasData } = useMedical();
  const { isOnline } = useNetwork();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const { dir, locale, t } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  const contactPhones = contacts.map((c) => c.phone);
  const message = emergencyMessage(coords, undefined, locale);

  const guardOnline = (action: () => void, messageKey: 'offline.whatsappNeedsInternet' | 'offline.shareNeedsInternet') => {
    if (!isOnline) {
      showToast(t(messageKey));
      return;
    }
    action();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('shareLocation.title')} subtitle={t('shareLocation.subtitleManual')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <LocationBox coords={coords} />

        {coords && hasData ? (
          <View style={[styles.medicalChip, { flexDirection: rowDir(dir), borderColor: colors.fire }]}>
            <AppText color={colors.text} style={styles.medicalChipText}>
              {t('shareLocation.medicalChip', { bloodType: profile.blood || '—', allergies: profile.allergies || '—' })}
            </AppText>
          </View>
        ) : null}

        {!coords ? (
          <SheetButton
            label={locationStatus === 'locating' ? t('shareLocation.locating') : t('shareLocation.enableLocationFirst')}
            variant="secondary"
            onPress={requestLocation}
          />
        ) : (
          <>
            <SheetButton
              label={isOnline ? t('shareLocation.viaWhatsapp') : `${t('shareLocation.viaWhatsapp')} ⚠`}
              icon="logo-whatsapp"
              color={colors.amb}
              onPress={() => guardOnline(async () => {
                const ok = await shareViaWhatsApp(message);
                if (!ok) showToast(t('home.toastWhatsappUnavailable'));
              }, 'offline.whatsappNeedsInternet')}
            />
            <SheetButton
              label={t('shareLocation.viaSms')}
              icon="chatbubble-outline"
              color={colors.police}
              onPress={async () => {
                const result = await shareViaSms(message, contactPhones);
                if (result === 'unsupported') showToast(t('home.toastSmsUnavailable'));
              }}
            />
            <SheetButton
              label={isOnline ? t('shareLocation.viaAnyApp') : `${t('shareLocation.viaAnyApp')} ⚠`}
              icon="share-social-outline"
              variant="secondary"
              onPress={() => guardOnline(() => shareViaSheet(message), 'offline.shareNeedsInternet')}
            />
            <SheetButton
              label={t('shareLocation.copyLink')}
              icon="copy-outline"
              variant="secondary"
              onPress={async () => {
                const link = await copyLocationLink(coords);
                showToast(link ? t('home.toastLinkCopied') : t('home.toastEnableLocationFirst'));
              }}
            />
          </>
        )}
        <AppText color={colors.textMuted} style={styles.note}>{t('shareLocation.privacyNote')}</AppText>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 40 },
    medicalChip: {
      alignItems: 'center',
      backgroundColor: 'rgba(229,57,53,0.08)',
      borderWidth: 1,
      borderRadius: radius.md,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    medicalChipText: { fontSize: 11.5, flex: 1, lineHeight: 16 },
    note: { fontSize: 10.5, textAlign: 'center', marginTop: spacing.sm, lineHeight: 16 },
  });
}

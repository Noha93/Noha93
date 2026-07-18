import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../AppText';
import { AppIcon } from '../AppIcon';
import { SheetButton } from '../SheetButton';
import { LocationBox } from '../LocationBox';
import { colors, glow, radius, spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useLocale, rowDir } from '../../context/LocaleContext';
import { useMedical } from '../../context/MedicalContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import type { Coords } from '../../utils/share';
import type { LocationStatus } from '../../hooks/useLocation';

interface Props {
  coords: Coords | null;
  locationStatus: LocationStatus;
  autoOpened?: boolean;
  onRequestLocation: () => void;
  onWhatsApp: () => void;
  onSms: () => void;
  onShareSheet: () => void;
  onCopyLink: () => void;
  onDismiss: () => void;
}

export function ShareLocationSheet({
  coords,
  locationStatus,
  autoOpened,
  onRequestLocation,
  onWhatsApp,
  onSms,
  onShareSheet,
  onCopyLink,
  onDismiss,
}: Props) {
  const { colors: themeColors, scheme } = useTheme();
  const { dir, t } = useLocale();
  const { profile, hasData } = useMedical();
  const { isOnline } = useNetwork();
  const { showToast } = useToast();

  const guardOnline = (action: () => void, messageKey: 'offline.whatsappNeedsInternet' | 'offline.shareNeedsInternet') => {
    if (!isOnline) {
      showToast(t(messageKey));
      return;
    }
    action();
  };

  return (
    <>
      <AppText weight="displayExtraBold" style={styles.title}>
        {t('shareLocation.title')}
      </AppText>
      <AppText color={themeColors.textMuted} style={styles.sub}>
        {autoOpened ? t('shareLocation.subtitleAuto') : t('shareLocation.subtitleManual')}
      </AppText>

      <LocationBox coords={coords} />

      {coords && hasData ? (
        <View
          style={[
            styles.medicalChip,
            { flexDirection: rowDir(dir), borderColor: colors.fire },
            scheme === 'dark' && glow(colors.fire, 0.25, 12),
          ]}
        >
          <AppIcon name="water-outline" size={14} color={colors.fire} />
          <AppText color={themeColors.text} style={[styles.medicalChipText, { textAlign: dir === 'rtl' ? 'right' : 'left' }]}>
            {t('shareLocation.medicalChip', {
              bloodType: profile.blood || '—',
              allergies: profile.allergies || '—',
            })}
          </AppText>
        </View>
      ) : null}

      {!coords ? (
        <SheetButton
          label={locationStatus === 'locating' ? t('shareLocation.locating') : t('shareLocation.enableLocationFirst')}
          variant="secondary"
          onPress={onRequestLocation}
        />
      ) : (
        <>
          <SheetButton
            label={isOnline ? t('shareLocation.viaWhatsapp') : `${t('shareLocation.viaWhatsapp')} ⚠`}
            icon="logo-whatsapp"
            color={colors.amb}
            onPress={() => guardOnline(onWhatsApp, 'offline.whatsappNeedsInternet')}
          />
          <SheetButton label={t('shareLocation.viaSms')} icon="chatbubble-outline" color={colors.police} onPress={onSms} />
          <SheetButton
            label={isOnline ? t('shareLocation.viaAnyApp') : `${t('shareLocation.viaAnyApp')} ⚠`}
            icon="share-social-outline"
            variant="secondary"
            onPress={() => guardOnline(onShareSheet, 'offline.shareNeedsInternet')}
          />
          <SheetButton label={t('shareLocation.copyLink')} icon="copy-outline" variant="secondary" onPress={onCopyLink} />
        </>
      )}
      <AppText color={themeColors.textMuted} style={styles.note}>
        {t('shareLocation.privacyNote')}
      </AppText>
      <SheetButton label={t('common.noThanks')} variant="outline" onPress={onDismiss} />
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
  note: {
    fontSize: 10.5,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  medicalChip: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(230,57,70,0.1)',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  medicalChipText: {
    fontSize: 11.5,
    flex: 1,
    lineHeight: 16,
  },
});

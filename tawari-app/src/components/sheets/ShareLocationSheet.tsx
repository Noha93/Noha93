import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { LocationBox } from '../LocationBox';
import { colors, spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
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
  const { colors: themeColors } = useTheme();
  const { t } = useLocale();
  return (
    <>
      <AppText weight="displayExtraBold" style={styles.title}>
        {t('shareLocation.title')}
      </AppText>
      <AppText color={themeColors.textMuted} style={styles.sub}>
        {autoOpened ? t('shareLocation.subtitleAuto') : t('shareLocation.subtitleManual')}
      </AppText>

      <LocationBox coords={coords} />

      {!coords ? (
        <SheetButton
          label={locationStatus === 'locating' ? t('shareLocation.locating') : t('shareLocation.enableLocationFirst')}
          variant="secondary"
          onPress={onRequestLocation}
        />
      ) : (
        <>
          <SheetButton label={t('shareLocation.viaWhatsapp')} icon="whatsapp" color={colors.amb} onPress={onWhatsApp} />
          <SheetButton label={t('shareLocation.viaSms')} icon="message-text" color={colors.police} onPress={onSms} />
          <SheetButton label={t('shareLocation.viaAnyApp')} icon="share-variant" variant="secondary" onPress={onShareSheet} />
          <SheetButton label={t('shareLocation.copyLink')} icon="content-copy" variant="secondary" onPress={onCopyLink} />
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
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/AppText';
import { AppIcon } from '../../src/components/AppIcon';
import { BottomSheet } from '../../src/components/BottomSheet';
import { OfflineBanner } from '../../src/components/OfflineBanner';
import { SosCircle } from '../../src/components/SosCircle';
import { OtherServiceButton } from '../../src/components/OtherServiceButton';
import { CallConfirmSheet } from '../../src/components/sheets/CallConfirmSheet';
import { PostCallSheet } from '../../src/components/sheets/PostCallSheet';
import { ShareLocationSheet } from '../../src/components/sheets/ShareLocationSheet';
import { VoiceListenSheet } from '../../src/components/sheets/VoiceListenSheet';
import { useLocation } from '../../src/hooks/useLocation';
import { useVoiceReport } from '../../src/hooks/useVoiceReport';
import { useContacts } from '../../src/context/ContactsContext';
import { useReports } from '../../src/context/ReportsContext';
import { useToast } from '../../src/context/ToastContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale, rowDir, type Dir } from '../../src/context/LocaleContext';
import { elevation, radius, spacing, tint, type ThemeColors } from '../../src/constants/theme';
import { sosServices, otherServices, findService, type SosKey, type ServiceKey } from '../../src/constants/services';
import { placeCall, emergencyMessage, shareViaWhatsApp, shareViaSms, shareViaSheet, copyLocationLink } from '../../src/utils/share';

type SheetView =
  | { type: 'call-confirm'; key: ServiceKey }
  | { type: 'post-call'; key: SosKey }
  | { type: 'share-location'; key: SosKey; auto?: boolean }
  | { type: 'voice-listening' };

function isSosKey(key: ServiceKey): key is SosKey {
  return key in sosServices;
}

const QUICK_ACTIONS = [
  { icon: 'mic-outline' as const, key: 'voice' },
  { icon: 'location-outline' as const, key: 'share' },
  { icon: 'medkit-outline' as const, key: 'firstAid' },
  { icon: 'people-outline' as const, key: 'contacts' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { coords, status: locationStatus, requestLocation } = useLocation();
  const { contacts } = useContacts();
  const { addReport } = useReports();
  const { showToast } = useToast();
  const { colors, mode, setMode, scheme } = useTheme();
  const { locale, dir, t, setLocale } = useLocale();
  const styles = useMemo(() => createStyles(colors, dir), [colors, dir]);

  const [sheet, setSheet] = useState<SheetView | null>(null);
  const pendingCallRef = useRef<{ key: SosKey; auto: boolean } | null>(null);
  const coordsRef = useRef(coords);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      const isReturning = (prev === 'background' || prev === 'inactive') && next === 'active';
      if (!isReturning || !pendingCallRef.current) return;
      const pc = pendingCallRef.current;
      pendingCallRef.current = null;
      setTimeout(() => {
        if (pc.auto) {
          triggerAutoShare(pc.key);
        } else {
          setSheet({ type: 'post-call', key: pc.key });
        }
      }, 500);
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeSheet = () => {
    setSheet(null);
    stopListening();
  };

  const { status: voiceStatus, transcript: voiceTranscript, startListening, stopListening } = useVoiceReport({
    locale,
    onMatch: (key) => {
      showToast(t('home.toastHeard', { name: t(`services.${key}.name`) }));
      setSheet({ type: 'call-confirm', key });
    },
  });

  const openVoiceSheet = () => {
    setSheet({ type: 'voice-listening' });
    startListening();
  };

  const openCallConfirm = (key: ServiceKey) => setSheet({ type: 'call-confirm', key });

  const performCall = async (key: ServiceKey) => {
    const svc = findService(key);
    closeSheet();
    await placeCall(svc.number);
    if (isSosKey(key)) {
      pendingCallRef.current = { key, auto: false };
    }
  };

  const autoTriggerSos = async (key: SosKey) => {
    const svc = sosServices[key];
    showToast(t('home.callingLabel', { label: t(`services.${key}.label`) }));
    await placeCall(svc.number);
    pendingCallRef.current = { key, auto: true };
  };

  const triggerAutoShare = async (key: SosKey) => {
    if (!coordsRef.current) {
      await requestLocation();
    }
    setSheet({ type: 'share-location', key, auto: true });
    setTimeout(async () => {
      const message = emergencyMessage(coordsRef.current, t(`services.${key}.label`), locale);
      const ok = await shareViaWhatsApp(message);
      if (!ok) showToast(t('home.toastWhatsappUnavailableTryAnother'));
    }, 400);
  };

  const handleResolved = async (key: SosKey) => {
    await addReport({ serviceKey: key, coords: coordsRef.current, resolved: true });
    closeSheet();
    showToast(t('home.toastResolved'));
  };

  const handleNotResolved = async (key: SosKey) => {
    await addReport({ serviceKey: key, coords: coordsRef.current, resolved: false });
    setSheet({ type: 'share-location', key, auto: false });
  };

  const contactPhones = contacts.map((c) => c.phone);

  const shareHandlers = (key: SosKey) => {
    const message = emergencyMessage(coordsRef.current, t(`services.${key}.label`), locale);
    return {
      onWhatsApp: async () => {
        const ok = await shareViaWhatsApp(message);
        if (!ok) showToast(t('home.toastWhatsappUnavailable'));
      },
      onSms: async () => {
        const result = await shareViaSms(message, contactPhones);
        if (result === 'unsupported') showToast(t('home.toastSmsUnavailable'));
      },
      onShareSheet: () => shareViaSheet(message),
      onCopyLink: async () => {
        const link = await copyLocationLink(coordsRef.current);
        showToast(link ? t('home.toastLinkCopied') : t('home.toastEnableLocationFirst'));
      },
    };
  };

  const runQuickAction = (key: string) => {
    if (key === 'voice') openVoiceSheet();
    else if (key === 'share') router.push('/share-location');
    else if (key === 'firstAid') router.push('/(tabs)/first-aid');
    else if (key === 'contacts') router.push('/contacts');
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <AppText color={colors.textMuted} style={styles.welcome}>
              {t('home.welcome')}
            </AppText>
            <AppText weight="displayExtraBold" style={styles.brandText}>
              {t('brand.name')}
            </AppText>
          </View>
          <View style={styles.headerBtns}>
            <Pressable onPress={() => setLocale(locale === 'ar' ? 'en' : 'ar')} style={styles.headerBtn}>
              <AppText weight="bodyBold" style={styles.headerBtnText}>
                {locale === 'ar' ? 'EN' : 'ع'}
              </AppText>
            </Pressable>
            <Pressable onPress={() => setMode(scheme === 'dark' ? 'light' : 'dark')} style={styles.headerBtn}>
              <AppIcon name={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('/alerts')} style={styles.headerBtn}>
              <AppIcon name="notifications-outline" size={18} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} style={styles.headerBtn}>
              <AppIcon name="settings-outline" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={requestLocation} style={styles.locPill}>
          <View
            style={[
              styles.locDot,
              locationStatus === 'on' && { backgroundColor: colors.success },
              locationStatus === 'off' && { backgroundColor: colors.fire },
            ]}
          />
          <AppText color={colors.textMuted} style={styles.locText}>
            {locationStatus === 'on'
              ? t('location.on')
              : locationStatus === 'locating'
              ? t('location.locating')
              : locationStatus === 'off'
              ? t('location.off')
              : t('location.default')}
          </AppText>
        </Pressable>

        <View style={styles.sosRow}>
          <SosCircle service={sosServices.amb} onPress={() => openCallConfirm('amb')} onAutoTrigger={() => autoTriggerSos('amb')} />
          <SosCircle service={sosServices.police} onPress={() => openCallConfirm('police')} onAutoTrigger={() => autoTriggerSos('police')} />
          <SosCircle service={sosServices.fire} onPress={() => openCallConfirm('fire')} onAutoTrigger={() => autoTriggerSos('fire')} />
        </View>

        <Pressable onPress={() => router.push('/sos')} style={[styles.sosBanner, elevation.md]}>
          <View style={styles.sosBannerIconWrap}>
            <AppIcon name="warning-outline" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bodyBold" color="#fff" style={styles.sosBannerTitle}>
              {t('home.sosBannerTitle')}
            </AppText>
            <AppText color="rgba(255,255,255,0.8)" style={styles.sosBannerSub}>
              {t('home.sosBannerSub')}
            </AppText>
          </View>
          <AppIcon name={dir === 'rtl' ? 'chevron-back-outline' : 'chevron-forward-outline'} size={20} color="#fff" />
        </Pressable>

        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((q) => (
            <Pressable key={q.key} onPress={() => runQuickAction(q.key)} style={[styles.quickTile, elevation.sm]}>
              <View style={[styles.quickIconWrap, { backgroundColor: tint(colors.police) }]}>
                <AppIcon name={q.icon} size={20} color={colors.police} />
              </View>
              <AppText weight="bodyMedium" style={styles.quickLabel} numberOfLines={1}>
                {t(`home.quick.${q.key}`)}
              </AppText>
            </Pressable>
          ))}
        </View>

        <OfflineBanner />

        <View style={styles.trustRow}>
          <AppIcon name="shield-checkmark-outline" size={13} color={colors.textMuted} />
          <AppText color={colors.textMuted} style={styles.trustText}>
            {t('trust.disclaimer')}
          </AppText>
        </View>

        <View style={styles.sectionHRow}>
          <AppIcon name="help-buoy-outline" size={16} color={colors.textMuted} />
          <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.sectionH}>
            {t('home.otherServicesHeader')}
          </AppText>
        </View>
        <View style={styles.otherGrid}>
          {Object.values(otherServices).map((svc) => (
            <OtherServiceButton key={svc.key} service={svc} onPress={() => openCallConfirm(svc.key)} />
          ))}
        </View>

        <View style={styles.sectionHRow}>
          <AppIcon name="people-outline" size={16} color={colors.textMuted} />
          <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.sectionH}>
            {t('home.contactsHeader')}
          </AppText>
        </View>
        {contacts.length === 0 ? (
          <AppText color={colors.textMuted} style={styles.emptyContacts}>
            {t('home.emptyContacts')}
          </AppText>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsRow}>
            {contacts.map((c) => (
              <Pressable key={c.id} onPress={() => router.push('/contacts')} style={styles.contactChip}>
                <View style={styles.contactAvatar}>
                  <AppText weight="bodyBold" color="#fff" style={styles.contactAvatarText}>
                    {c.name.trim().slice(0, 2)}
                  </AppText>
                </View>
                <AppText weight="bodyMedium" style={styles.contactName} numberOfLines={1}>
                  {c.name}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <Pressable style={styles.addContact} onPress={() => router.push('/contacts')}>
          <AppText color={colors.textMuted} style={styles.addContactText}>
            {t('home.addContact')}
          </AppText>
        </Pressable>
      </ScrollView>

      <BottomSheet visible={!!sheet} onClose={closeSheet}>
        {sheet?.type === 'call-confirm' ? (
          <CallConfirmSheet
            label={t(`services.${sheet.key}.label`)}
            number={findService(sheet.key).number}
            color={isSosKey(sheet.key) ? sosServices[sheet.key].color : colors.police}
            onConfirm={() => performCall(sheet.key)}
            onCancel={closeSheet}
          />
        ) : null}

        {sheet?.type === 'post-call' ? (
          <PostCallSheet
            serviceLabel={t(`services.${sheet.key}.label`)}
            onResolved={() => handleResolved(sheet.key)}
            onNotResolved={() => handleNotResolved(sheet.key)}
          />
        ) : null}

        {sheet?.type === 'share-location' ? (
          <ShareLocationSheet
            coords={coords}
            locationStatus={locationStatus}
            autoOpened={sheet.auto}
            onRequestLocation={requestLocation}
            onWhatsApp={shareHandlers(sheet.key).onWhatsApp}
            onSms={shareHandlers(sheet.key).onSms}
            onShareSheet={shareHandlers(sheet.key).onShareSheet}
            onCopyLink={shareHandlers(sheet.key).onCopyLink}
            onDismiss={closeSheet}
          />
        ) : null}

        {sheet?.type === 'voice-listening' ? (
          <VoiceListenSheet
            status={voiceStatus}
            transcript={voiceTranscript}
            onRetry={startListening}
            onCancel={closeSheet}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}

function createStyles(colors: ThemeColors, dir: Dir) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingBottom: 40,
    },
    header: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    welcome: {
      fontSize: 12,
    },
    brandText: {
      fontSize: 20,
      marginTop: 2,
    },
    headerBtns: {
      flexDirection: rowDir(dir),
      gap: 8,
    },
    headerBtn: {
      width: 38,
      height: 38,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerBtnText: {
      fontSize: 12,
    },
    locPill: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      alignSelf: dir === 'rtl' ? 'flex-end' : 'flex-start',
      marginHorizontal: spacing.lg,
      marginTop: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    locDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textMuted,
    },
    locText: {
      fontSize: 11,
    },
    sosRow: {
      flexDirection: rowDir(dir),
      justifyContent: 'space-around',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },
    sosBanner: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.md,
    },
    sosBannerIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sosBannerTitle: {
      fontSize: 15,
    },
    sosBannerSub: {
      fontSize: 11,
      marginTop: 2,
    },
    quickRow: {
      flexDirection: rowDir(dir),
      gap: 10,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
    quickTile: {
      flex: 1,
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingVertical: 12,
    },
    quickIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickLabel: {
      fontSize: 10.5,
      textAlign: 'center',
    },
    trustRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    trustText: {
      fontSize: 10.5,
      flexShrink: 1,
      lineHeight: 15,
    },
    sectionHRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.lg,
      paddingTop: 22,
      paddingBottom: 10,
    },
    sectionH: {
      fontSize: 14,
    },
    otherGrid: {
      flexDirection: rowDir(dir),
      flexWrap: 'wrap',
      paddingHorizontal: spacing.lg,
      gap: 10,
    },
    emptyContacts: {
      paddingHorizontal: spacing.lg,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: spacing.sm,
    },
    contactsRow: {
      paddingHorizontal: spacing.lg,
      gap: 14,
    },
    contactChip: {
      alignItems: 'center',
      width: 68,
      gap: 6,
    },
    contactAvatar: {
      width: 52,
      height: 52,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactAvatarText: {
      fontSize: 15,
    },
    contactName: {
      fontSize: 10.5,
      textAlign: 'center',
    },
    addContact: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.sm,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: radius.md,
      paddingVertical: 12,
      alignItems: 'center',
    },
    addContactText: {
      fontSize: 12,
    },
  });
}

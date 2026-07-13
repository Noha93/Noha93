import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/AppText';
import { AppIcon } from '../../src/components/AppIcon';
import { BottomSheet } from '../../src/components/BottomSheet';
import { SosCircle } from '../../src/components/SosCircle';
import { VoiceReportButton } from '../../src/components/VoiceReportButton';
import { OtherServiceButton } from '../../src/components/OtherServiceButton';
import { ContactRow } from '../../src/components/ContactRow';
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
import { radius, spacing, type ThemeColors } from '../../src/constants/theme';
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

export default function HomeScreen() {
  const router = useRouter();
  const { coords, status: locationStatus, requestLocation } = useLocation();
  const { contacts } = useContacts();
  const { addReport } = useReports();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const { locale, dir, t } = useLocale();
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

  return (
    <>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroBand}>
        <View style={styles.topbar}>
          <View style={styles.brand}>
            <AppIcon name="alarm-light" size={20} color="#fff" />
            <AppText weight="displayExtraBold" color="#fff" style={styles.brandText}>
              {t('brand.name')}
            </AppText>
          </View>
          <Pressable onPress={requestLocation} style={styles.locPill}>
            <View
              style={[
                styles.locDot,
                locationStatus === 'on' && { backgroundColor: colors.success },
                locationStatus === 'off' && { backgroundColor: colors.fire },
              ]}
            />
            <AppText color={colors.onInk} style={styles.locText}>
              {locationStatus === 'on'
                ? t('location.on')
                : locationStatus === 'locating'
                ? t('location.locating')
                : locationStatus === 'off'
                ? t('location.off')
                : t('location.default')}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <View style={styles.greetingRow}>
            <AppIcon name="hand-wave" size={20} color="#fff" />
            <AppText weight="displayExtraBold" color="#fff" style={styles.h1}>
              {t('home.greeting')}
            </AppText>
          </View>
          <AppText color={colors.onInk} style={styles.hSub}>
            {t('home.subtitle')}
          </AppText>
        </View>

        <View style={styles.sosRow}>
          <SosCircle service={sosServices.fire} onPress={() => openCallConfirm('fire')} onAutoTrigger={() => autoTriggerSos('fire')} />
          <SosCircle service={sosServices.police} onPress={() => openCallConfirm('police')} onAutoTrigger={() => autoTriggerSos('police')} />
          <SosCircle service={sosServices.amb} onPress={() => openCallConfirm('amb')} onAutoTrigger={() => autoTriggerSos('amb')} />
        </View>

        <View style={styles.voiceWrap}>
          <VoiceReportButton onPress={openVoiceSheet} />
        </View>
      </View>

      <View style={styles.trustRow}>
        <AppIcon name="shield-check" size={13} color={colors.textMuted} />
        <AppText color={colors.textMuted} style={styles.trustText}>
          {t('trust.disclaimer')}
        </AppText>
      </View>

      <View style={styles.sectionHRow}>
        <AppIcon name="lifebuoy" size={16} color={colors.textMuted} />
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
        <AppIcon name="account-group" size={16} color={colors.textMuted} />
        <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.sectionH}>
          {t('home.contactsHeader')}
        </AppText>
      </View>
      {contacts.length === 0 ? (
        <AppText color={colors.textMuted} style={styles.emptyContacts}>
          {t('home.emptyContacts')}
        </AppText>
      ) : (
        contacts.map((c) => <ContactRow key={c.id} contact={c} />)
      )}
      <Pressable style={styles.addContact} onPress={() => router.push('/settings')}>
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
    heroBand: {
      backgroundColor: colors.ink,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
      paddingBottom: spacing.xl,
    },
    topbar: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    brand: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 8,
    },
    brandText: {
      fontSize: 20,
    },
    locPill: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.16)',
      borderRadius: radius.pill,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    locDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ccc',
    },
    locText: {
      fontSize: 11,
    },
    greeting: {
      paddingHorizontal: spacing.lg,
      paddingBottom: 14,
    },
    greetingRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 8,
    },
    h1: {
      fontSize: 19,
    },
    hSub: {
      fontSize: 12,
      marginTop: 6,
      lineHeight: 18,
    },
    sosRow: {
      flexDirection: rowDir(dir),
      justifyContent: 'space-around',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    voiceWrap: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    trustRow: {
      flexDirection: rowDir(dir),
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
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

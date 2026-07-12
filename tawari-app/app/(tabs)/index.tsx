import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/AppText';
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
import { colors, radius, spacing } from '../../src/constants/theme';
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
    onMatch: (key) => {
      showToast(`سمعناكِ — بنفتحلك الاتصال بـ ${sosServices[key].name}`);
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
    showToast(`جارٍ الاتصال بـ ${svc.label}...`);
    await placeCall(svc.number);
    pendingCallRef.current = { key, auto: true };
  };

  const triggerAutoShare = async (key: SosKey) => {
    if (!coordsRef.current) {
      await requestLocation();
    }
    setSheet({ type: 'share-location', key, auto: true });
    setTimeout(async () => {
      const svc = sosServices[key];
      const message = emergencyMessage(coordsRef.current, svc.label);
      const ok = await shareViaWhatsApp(message);
      if (!ok) showToast('واتساب مش متاح على الجهاز ده — جرّبي طريقة تانية بالأسفل');
    }, 400);
  };

  const handleResolved = async (key: SosKey) => {
    const svc = sosServices[key];
    await addReport({ serviceKey: key, serviceName: svc.name, coords: coordsRef.current, resolved: true });
    closeSheet();
    showToast('الحمد لله على السلامة 🤍');
  };

  const handleNotResolved = async (key: SosKey) => {
    const svc = sosServices[key];
    await addReport({ serviceKey: key, serviceName: svc.name, coords: coordsRef.current, resolved: false });
    setSheet({ type: 'share-location', key, auto: false });
  };

  const contactPhones = contacts.map((c) => c.phone);

  const shareHandlers = (key: SosKey) => {
    const svc = sosServices[key];
    const message = emergencyMessage(coordsRef.current, svc.label);
    return {
      onWhatsApp: async () => {
        const ok = await shareViaWhatsApp(message);
        if (!ok) showToast('واتساب مش متاح على الجهاز ده');
      },
      onSms: async () => {
        const result = await shareViaSms(message, contactPhones);
        if (result === 'unsupported') showToast('الرسائل النصية مش متاحة على الجهاز ده');
      },
      onShareSheet: () => shareViaSheet(message),
      onCopyLink: async () => {
        const link = await copyLocationLink(coordsRef.current);
        showToast(link ? 'تم نسخ رابط الموقع' : 'فعّلي الموقع الأول');
      },
    };
  };

  return (
    <>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroBand}>
        <View style={styles.topbar}>
          <View style={styles.brand}>
            <AppText style={styles.brandEmoji}>🚨</AppText>
            <AppText weight="displayExtraBold" color="#fff" style={styles.brandText}>
              طوارئ
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
                ? 'الموقع مفعّل'
                : locationStatus === 'locating'
                ? 'جارِ التحديد...'
                : locationStatus === 'off'
                ? 'فعّل إذن الموقع'
                : 'تفعيل الموقع'}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <AppText weight="displayExtraBold" color="#fff" style={styles.h1}>
            مرحبًا 👋
          </AppText>
          <AppText color={colors.onInk} style={styles.hSub}>
            دوسي على نوع الطارئة عشان تتصلي بيها (هنأكد معاكِ الأول)، أو استخدمي صوتك، أو اضغطي مطولًا 3 ثوانٍ للاتصال الفوري
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

      <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.sectionH}>
        🛟 خدمات طوارئ أخرى قد تفيدك
      </AppText>
      <View style={styles.otherGrid}>
        {Object.values(otherServices).map((svc) => (
          <OtherServiceButton key={svc.key} service={svc} onPress={() => openCallConfirm(svc.key)} />
        ))}
      </View>

      <AppText weight="displayExtraBold" color={colors.textMuted} style={styles.sectionH}>
        👨‍👩‍👧 جهات اتصال الطوارئ الخاصة بك
      </AppText>
      {contacts.length === 0 ? (
        <AppText color={colors.textMuted} style={styles.emptyContacts}>
          لسه معنديش جهات اتصال محفوظة — أضيفي جهة عشان تقدري تشاركي موقعك معاها بسرعة.
        </AppText>
      ) : (
        contacts.map((c) => <ContactRow key={c.id} contact={c} />)
      )}
      <Pressable style={styles.addContact} onPress={() => router.push('/settings')}>
        <AppText color={colors.textMuted} style={styles.addContactText}>
          + إضافة فرد من العائلة
        </AppText>
      </Pressable>
    </ScrollView>

    <BottomSheet visible={!!sheet} onClose={closeSheet}>
      {sheet?.type === 'call-confirm' ? (
        <CallConfirmSheet
          label={findService(sheet.key).label}
          number={findService(sheet.key).number}
          color={isSosKey(sheet.key) ? sosServices[sheet.key].color : colors.police}
          onConfirm={() => performCall(sheet.key)}
          onCancel={closeSheet}
        />
      ) : null}

      {sheet?.type === 'post-call' ? (
        <PostCallSheet
          serviceLabel={sosServices[sheet.key].label}
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

const styles = StyleSheet.create({
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  brand: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  brandEmoji: {
    fontSize: 20,
  },
  brandText: {
    fontSize: 20,
  },
  locPill: {
    flexDirection: 'row-reverse',
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
  h1: {
    fontSize: 19,
  },
  hSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sosRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  voiceWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionH: {
    paddingHorizontal: spacing.lg,
    paddingTop: 26,
    paddingBottom: 10,
    fontSize: 14,
  },
  otherGrid: {
    flexDirection: 'row-reverse',
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

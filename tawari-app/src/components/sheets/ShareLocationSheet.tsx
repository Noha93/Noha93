import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { LocationBox } from '../LocationBox';
import { colors, spacing } from '../../constants/theme';
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
  return (
    <>
      <AppText weight="displayExtraBold" style={styles.title}>
        شارك موقعك
      </AppText>
      <AppText color={colors.textMuted} style={styles.sub}>
        {autoOpened
          ? 'فتحنالك واتساب تلقائيًا — اختاري جهة الاتصال اللي تحبي تبعتيلها موقعك'
          : 'اختاري الطريقة اللي تحبي تشاركي بيها موقعك الحالي'}
      </AppText>

      <LocationBox coords={coords} />

      {!coords ? (
        <SheetButton
          label={locationStatus === 'locating' ? 'جارِ تحديد الموقع...' : 'تفعيل الموقع أولًا'}
          variant="secondary"
          onPress={onRequestLocation}
        />
      ) : (
        <>
          <SheetButton label="🟢 مشاركة عبر واتساب" color={colors.amb} onPress={onWhatsApp} />
          <SheetButton label="💬 مشاركة عبر رسالة SMS" color={colors.police} onPress={onSms} />
          <SheetButton label="📱 مشاركة عبر أي تطبيق" variant="secondary" onPress={onShareSheet} />
          <SheetButton label="📋 نسخ رابط الموقع" variant="secondary" onPress={onCopyLink} />
        </>
      )}
      <AppText color={colors.textMuted} style={styles.note}>
        هتختاري جهة الاتصال بنفسك جوه واتساب أو الرسائل — التطبيق مش بيقدر يبعت تلقائيًا لحد من غير موافقتك.
      </AppText>
      <SheetButton label="لا شكرًا" variant="outline" onPress={onDismiss} />
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

import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { colors, radius, spacing } from '../../constants/theme';
import type { SosService } from '../../constants/services';
import type { Coords } from '../../utils/share';
import { mapsLink } from '../../utils/share';

interface Props {
  service: SosService;
  reportId: string;
  coords: Coords | null;
  contactNames: string[];
  onShareWhatsApp: () => void;
  onDone: () => void;
}

export function ReportSuccessSheet({ service, reportId, coords, contactNames, onShareWhatsApp, onDone }: Props) {
  const contactStep =
    contactNames.length > 0
      ? `✓ تم تنبيه جهة الاتصال (${contactNames.join('، ')})`
      : '✓ تم تسجيل البلاغ في السجل المحلي';

  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <AppText style={styles.iconText}>✓</AppText>
      </View>
      <AppText weight="display" style={styles.title}>
        تم إرسال بلاغك
      </AppText>
      <AppText color={colors.textMuted} style={styles.sub}>
        رقم البلاغ #{reportId} — الوصول المتوقع خلال {service.eta} دقائق
      </AppText>

      <View style={styles.track}>
        <AppText weight="bodyBold" color={colors.success} style={styles.step}>
          ✓ تم استلام البلاغ
        </AppText>
        <AppText weight="bodyBold" color={colors.success} style={styles.step}>
          {contactStep}
        </AppText>
        <AppText color={colors.textMuted} style={styles.step}>
          ○ الفريق في الطريق إليك
        </AppText>
      </View>

      {coords ? (
        <SheetButton
          label="🗺️ عرض موقعي على الخريطة"
          variant="secondary"
          onPress={() => Linking.openURL(mapsLink(coords))}
        />
      ) : null}
      <SheetButton label="📤 مشاركة الموقع عبر واتساب" color={colors.amb} onPress={onShareWhatsApp} />
      <SheetButton label="تم" color={service.color} onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#22c55e18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 30,
    color: colors.success,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  track: {
    width: '100%',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  step: {
    fontSize: 12.5,
    marginBottom: 8,
    textAlign: 'right',
  },
});

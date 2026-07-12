import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../AppText';
import { SheetButton } from '../SheetButton';
import { LocationBox } from '../LocationBox';
import { spacing } from '../../constants/theme';
import type { SosService } from '../../constants/services';
import type { Coords } from '../../utils/share';

interface Props {
  service: SosService;
  coords: Coords | null;
  onConfirmReport: () => void;
  onCallDirectly: () => void;
  onCancel: () => void;
}

export function ReportConfirmSheet({ service, coords, onConfirmReport, onCallDirectly, onCancel }: Props) {
  return (
    <View>
      <AppText weight="displayExtraBold" color={service.color} style={styles.title}>
        تأكيد بلاغ {service.name}
      </AppText>
      <AppText color="#6B7280" style={styles.sub}>
        سيتم إرسال نوع الطارئة وموقعك إلى {service.label}
      </AppText>
      <LocationBox coords={coords} />
      <SheetButton label="تأكيد وإرسال البلاغ" color={service.color} onPress={onConfirmReport} />
      <SheetButton label={`📞 أو اتصل مباشرة بـ ${service.number}`} variant="secondary" onPress={onCallDirectly} />
      <SheetButton label="إلغاء" variant="outline" onPress={onCancel} />
    </View>
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
});

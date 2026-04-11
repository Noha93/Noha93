import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { DaySchedule } from '../../types';
import Button from '../../components/common/Button';

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: 'sunday', isWorking: true, startTime: '09:00', endTime: '17:00', maxAppointments: 12 },
  { day: 'monday', isWorking: true, startTime: '09:00', endTime: '17:00', maxAppointments: 12 },
  { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '17:00', maxAppointments: 12 },
  { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '17:00', maxAppointments: 12 },
  { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '17:00', maxAppointments: 12 },
  { day: 'friday', isWorking: false, startTime: '', endTime: '' },
  { day: 'saturday', isWorking: false, startTime: '', endTime: '' },
];

const DAYS_AR: Record<string, string> = {
  sunday: 'الأحد', monday: 'الاثنين', tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة', saturday: 'السبت',
};
const DAYS_EN: Record<string, string> = {
  sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday',
  wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
};

const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
];

export default function WeeklyScheduleScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const [schedule, setSchedule] = useState<DaySchedule[]>(doctor?.schedule || DEFAULT_SCHEDULE);
  const [saving, setSaving] = useState(false);

  const DAYS = language === 'ar' ? DAYS_AR : DAYS_EN;
  const DAYS_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule(prev => prev.map(d => d.day === day ? { ...d, ...updates } : d));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    Alert.alert(isRTL ? 'تم الحفظ' : 'Saved', isRTL ? 'تم حفظ الجدول الأسبوعي' : 'Weekly schedule saved');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('schedule.weeklySchedule')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {DAYS_ORDER.map(day => {
          const s = schedule.find(d => d.day === day) || { day, isWorking: false, startTime: '09:00', endTime: '17:00' };
          return (
            <View key={day} style={[styles.dayCard, !s.isWorking && styles.dayCardClosed]}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayName, !s.isWorking && styles.dayNameClosed]}>{DAYS[day]}</Text>
                <Switch
                  value={s.isWorking}
                  onValueChange={v => updateDay(day, { isWorking: v })}
                  trackColor={{ false: Colors.border, true: Colors.success + '60' }}
                  thumbColor={s.isWorking ? Colors.success : Colors.textMuted}
                />
              </View>

              {s.isWorking && (
                <View style={styles.timeRow}>
                  <View style={styles.timeField}>
                    <Text style={[styles.timeLabel, isRTL && styles.rtlText]}>{t('schedule.from')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_OPTIONS.slice(0, 12).map(time => (
                        <TouchableOpacity
                          key={time}
                          style={[styles.timeChip, s.startTime === time && styles.timeChipActive]}
                          onPress={() => updateDay(day, { startTime: time })}
                        >
                          <Text style={[styles.timeChipText, s.startTime === time && styles.timeChipTextActive]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.timeField}>
                    <Text style={[styles.timeLabel, isRTL && styles.rtlText]}>{t('schedule.to')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_OPTIONS.slice(8).map(time => (
                        <TouchableOpacity
                          key={time}
                          style={[styles.timeChip, s.endTime === time && styles.timeChipActive]}
                          onPress={() => updateDay(day, { endTime: time })}
                        >
                          <Text style={[styles.timeChipText, s.endTime === time && styles.timeChipTextActive]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}

              {!s.isWorking && (
                <View style={styles.closedBadge}>
                  <Text style={styles.closedText}>{t('schedule.closed')}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Button
          title={t('doctorProfile.saveChanges')}
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
          style={{ marginTop: 8, marginBottom: 32 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },
  dayCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  dayCardClosed: { opacity: 0.7 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dayName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  dayNameClosed: { color: Colors.textMuted },
  rtlText: { textAlign: 'right' },

  timeRow: { gap: 8 },
  timeField: {},
  timeLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: '500' },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
    backgroundColor: Colors.background,
  },
  timeChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  timeChipText: { fontSize: 12, color: Colors.textSecondary },
  timeChipTextActive: { color: Colors.primary, fontWeight: '700' },

  closedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorLight,
  },
  closedText: { fontSize: 12, color: Colors.error, fontWeight: '600' },
});

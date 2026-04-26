import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_BRANCHES } from '../../data/mockData';
import { ClinicStatus, DayOfWeek } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const DAYS_ORDER: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const DAYS_LABELS: Record<string, { ar: string; en: string }> = {
  sunday:    { ar: 'الأحد',     en: 'Sunday' },
  monday:    { ar: 'الاثنين',   en: 'Monday' },
  tuesday:   { ar: 'الثلاثاء', en: 'Tuesday' },
  wednesday: { ar: 'الأربعاء', en: 'Wednesday' },
  thursday:  { ar: 'الخميس',   en: 'Thursday' },
  friday:    { ar: 'الجمعة',   en: 'Friday' },
  saturday:  { ar: 'السبت',    en: 'Saturday' },
};

const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

interface DayState {
  isWorking: boolean;
  startTime: string;
  endTime: string;
  maxAppointments: number;
}

const defaultSchedule = (): Record<DayOfWeek, DayState> => {
  const s: any = {};
  DAYS_ORDER.forEach(d => {
    s[d] = { isWorking: d !== 'friday', startTime: '10:00', endTime: '14:00', maxAppointments: 10 };
  });
  return s;
};

export default function EditBranchScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const branchId: string | undefined = route.params?.branchId;
  const existing = branchId ? MOCK_BRANCHES.find(b => b.id === branchId) : undefined;
  const isNew = !existing;

  const [nameAr, setNameAr] = useState(existing?.nameAr || '');
  const [nameEn, setNameEn] = useState(existing?.nameEn || '');
  const [street, setStreet] = useState(existing?.address.street || '');
  const [area, setArea] = useState(existing?.address.area || '');
  const [city, setCity] = useState(existing?.address.city || 'القاهرة');
  const [phone, setPhone] = useState(existing?.contact.phone || '');
  const [mobile, setMobile] = useState(existing?.contact.mobile || '');
  const [status, setStatus] = useState<ClinicStatus>(existing?.status || 'open');
  const [loading, setLoading] = useState(false);

  const buildSchedule = (): Record<DayOfWeek, DayState> => {
    if (!existing) return defaultSchedule();
    const s: any = {};
    DAYS_ORDER.forEach(d => {
      const found = existing.schedule.find(x => x.day === d);
      s[d] = {
        isWorking: found?.isWorking ?? false,
        startTime: found?.startTime || '10:00',
        endTime: found?.endTime || '14:00',
        maxAppointments: found?.maxAppointments ?? 10,
      };
    });
    return s;
  };

  const [schedule, setSchedule] = useState<Record<DayOfWeek, DayState>>(buildSchedule());

  const toggleDay = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isWorking: !prev[day].isWorking },
    }));
  };

  const updateTime = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);

  const handleSave = async () => {
    if (!nameAr.trim() || !nameEn.trim()) {
      Alert.alert(
        isRTL ? 'تنبيه' : 'Warning',
        isRTL ? 'الرجاء إدخال اسم الفرع' : 'Please enter the branch name'
      );
      return;
    }
    if (!street.trim() || !area.trim()) {
      Alert.alert(
        isRTL ? 'تنبيه' : 'Warning',
        isRTL ? 'الرجاء إدخال عنوان الفرع' : 'Please enter the branch address'
      );
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);

    Alert.alert(
      isRTL ? 'تم الحفظ' : 'Saved',
      t('branches.saveSuccess'),
      [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
    );
  };

  const statusOptions: { value: ClinicStatus; labelAr: string; labelEn: string; color: string }[] = [
    { value: 'open', labelAr: 'مفتوح', labelEn: 'Open', color: Colors.open },
    { value: 'closed', labelAr: 'مغلق', labelEn: 'Closed', color: Colors.closed },
    { value: 'busy', labelAr: 'مشغول', labelEn: 'Busy', color: Colors.warning },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.decorCircle} />
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons
              name={isRTL ? 'arrow-forward' : 'arrow-back'}
              size={22}
              color={Colors.textWhite}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isNew ? t('branches.addBranch') : t('branches.editBranch')}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Branch Name */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('branches.branchName')}</Text>
          <Input
            label={t('branches.branchNameAr')}
            value={nameAr}
            onChangeText={setNameAr}
            required
            leftIcon={<Ionicons name="text-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={t('branches.branchNameEn')}
            value={nameEn}
            onChangeText={setNameEn}
            required
            leftIcon={<Ionicons name="text-outline" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('branches.branchStatus')}</Text>
          <View style={styles.statusRow}>
            {statusOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.statusChip,
                  status === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '15' },
                ]}
                onPress={() => setStatus(opt.value)}
              >
                <View style={[styles.statusDot, { backgroundColor: opt.color }]} />
                <Text style={[
                  styles.statusChipText,
                  status === opt.value && { color: opt.color, fontWeight: '700' },
                ]}>
                  {language === 'ar' ? opt.labelAr : opt.labelEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('branches.branchAddress')}</Text>
          <Input
            label={t('doctorProfile.street')}
            value={street}
            onChangeText={setStreet}
            required
            leftIcon={<Ionicons name="location-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={t('doctorProfile.area')}
            value={area}
            onChangeText={setArea}
            required
            leftIcon={<Ionicons name="map-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={t('doctorProfile.city')}
            value={city}
            onChangeText={setCity}
            leftIcon={<Ionicons name="business-outline" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('branches.branchPhone')}</Text>
          <Input
            label={t('doctorProfile.landline')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textMuted} />}
          />
          <Input
            label={t('doctorProfile.mobile')}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            required
            leftIcon={<Ionicons name="phone-portrait-outline" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('branches.branchSchedule')}</Text>

          {DAYS_ORDER.map(day => {
            const dayState = schedule[day];
            const label = language === 'ar' ? DAYS_LABELS[day].ar : DAYS_LABELS[day].en;
            const isExpanded = expandedDay === day;

            return (
              <View key={day} style={styles.dayCard}>
                <TouchableOpacity
                  style={[styles.dayHeader, isRTL && styles.rtlRow]}
                  onPress={() => dayState.isWorking && setExpandedDay(isExpanded ? null : day)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dayLeft, isRTL && styles.rtlRow]}>
                    <Switch
                      value={dayState.isWorking}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                      thumbColor={dayState.isWorking ? Colors.primary : Colors.textMuted}
                    />
                    <Text style={[styles.dayLabel, !dayState.isWorking && styles.dayLabelOff]}>
                      {label}
                    </Text>
                  </View>

                  {dayState.isWorking ? (
                    <View style={[styles.dayTimePreview, isRTL && styles.rtlRow]}>
                      <Text style={styles.dayTimeText}>
                        {`${dayState.startTime} – ${dayState.endTime}`}
                      </Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={Colors.textMuted}
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  ) : (
                    <Text style={styles.dayClosedText}>{t('schedule.closed')}</Text>
                  )}
                </TouchableOpacity>

                {isExpanded && dayState.isWorking && (
                  <View style={styles.dayExpanded}>
                    <Text style={[styles.timePickerLabel, isRTL && styles.rtlText]}>
                      {t('schedule.from')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePicker}>
                      {TIME_OPTIONS.map(t => (
                        <TouchableOpacity
                          key={`start-${t}`}
                          style={[
                            styles.timeChip,
                            dayState.startTime === t && styles.timeChipActive,
                          ]}
                          onPress={() => updateTime(day, 'startTime', t)}
                        >
                          <Text style={[
                            styles.timeChipText,
                            dayState.startTime === t && styles.timeChipTextActive,
                          ]}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={[styles.timePickerLabel, isRTL && styles.rtlText]}>
                      {schedule.sunday.endTime /* just using a key reference to get t() */ ? '' : ''}
                      {isRTL ? 'إلى' : 'To'}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePicker}>
                      {TIME_OPTIONS.map(t => (
                        <TouchableOpacity
                          key={`end-${t}`}
                          style={[
                            styles.timeChip,
                            dayState.endTime === t && styles.timeChipActive,
                          ]}
                          onPress={() => updateTime(day, 'endTime', t)}
                        >
                          <Text style={[
                            styles.timeChipText,
                            dayState.endTime === t && styles.timeChipTextActive,
                          ]}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Save */}
        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          variant="primary"
          fullWidth
          size="lg"
          style={{ marginTop: 8, marginBottom: 8 }}
        />

        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="outline"
          fullWidth
          size="lg"
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
  },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },

  section: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },

  statusRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusChipText: {
    fontSize: 13,
    color: Colors.textMuted,
  },

  dayCard: {
    marginBottom: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundLight,
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  dayLabelOff: { color: Colors.textMuted },
  dayTimePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTimeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  dayClosedText: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  dayExpanded: {
    padding: 12,
    backgroundColor: Colors.backgroundWhite,
  },
  timePickerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  timePicker: {
    marginBottom: 12,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
    backgroundColor: Colors.backgroundLight,
  },
  timeChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryUltraLight,
  },
  timeChipText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timeChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

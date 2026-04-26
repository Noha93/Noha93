import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import Badge from '../../components/common/Badge';

const { width } = Dimensions.get('window');

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export default function DashboardScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor, updateDoctorStatus, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [clinicOpen, setClinicOpen] = useState(doctor?.clinicStatus === 'open');

  const handleStatusToggle = (value: boolean) => {
    setClinicOpen(value);
    updateDoctorStatus(value ? 'open' : 'closed');
  };

  const docName = doctor
    ? (language === 'ar' ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`)
    : (isRTL ? 'الطبيب' : 'Doctor');

  const stats: StatCard[] = [
    { label: isRTL ? 'مواعيد اليوم' : "Today's Appts", value: 5, icon: 'today', color: Colors.primary, trend: '+2', trendUp: true },
    { label: isRTL ? 'إجمالي المرضى' : 'Total Patients', value: 128, icon: 'people', color: Colors.success, trend: '+15', trendUp: true },
    { label: isRTL ? 'متوسط التقييم' : 'Avg Rating', value: `${doctor?.rating || 4.8}★`, icon: 'star', color: Colors.warning },
    { label: isRTL ? 'مشاهدات الملف' : 'Profile Views', value: 1240, icon: 'eye', color: Colors.info, trend: '+89', trendUp: true },
    { label: isRTL ? 'هذا الأسبوع' : 'This Week', value: 22, icon: 'calendar', color: Colors.secondary },
    { label: isRTL ? 'إيرادات الشهر' : 'Monthly Revenue', value: `${doctor?.consultationFee ? doctor.consultationFee * 80 : 40000} ${isRTL ? 'ج.م' : 'EGP'}`, icon: 'cash', color: Colors.primaryLight },
  ];

  const todayAppointments = MOCK_APPOINTMENTS.slice(0, 2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorCircle} />

          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>{t('dashboard.welcome')}</Text>
              <Text style={styles.doctorName} numberOfLines={1}>{docName}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('DoctorNotifications')}>
              <Ionicons name="notifications-outline" size={22} color={Colors.textWhite} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Clinic Status Toggle */}
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusIndicator, { backgroundColor: clinicOpen ? Colors.success : Colors.error }]} />
              <View>
                <Text style={styles.statusCardTitle}>{t('dashboard.clinicStatus')}</Text>
                <Text style={[styles.statusCardValue, { color: clinicOpen ? Colors.success : Colors.error }]}>
                  {clinicOpen ? t('common.open') : t('common.closed')}
                </Text>
              </View>
            </View>
            <Switch
              value={clinicOpen}
              onValueChange={handleStatusToggle}
              trackColor={{ false: Colors.error + '40', true: Colors.success + '60' }}
              thumbColor={clinicOpen ? Colors.success : Colors.error}
            />
          </View>

          {/* Subscription Warning */}
          {doctor?.subscriptionPlan === 'free' && (
            <TouchableOpacity style={styles.subWarning}>
              <Ionicons name="warning-outline" size={16} color={Colors.warning} />
              <Text style={styles.subWarningText}>
                {isRTL ? 'ترقية اشتراكك لزيادة الظهور' : 'Upgrade to increase visibility'}
              </Text>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={Colors.warning} />
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('dashboard.quickStats')}</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.trend && (
                  <View style={[styles.trendBadge, { backgroundColor: stat.trendUp ? Colors.successLight : Colors.errorLight }]}>
                    <Ionicons
                      name={stat.trendUp ? 'trending-up' : 'trending-down'}
                      size={10}
                      color={stat.trendUp ? Colors.success : Colors.error}
                    />
                    <Text style={[styles.trendText, { color: stat.trendUp ? Colors.success : Colors.error }]}>
                      {stat.trend}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Revenue Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'إيرادات الأسبوع' : 'Weekly Revenue'}
          </Text>
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {[60, 80, 45, 90, 70, 30, 85].map((h, i) => (
                <View key={i} style={styles.barWrapper}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryLight]}
                    style={[styles.bar, { height: `${h}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  <Text style={styles.barLabel}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.aptsSection}>
          <View style={[styles.sectionHeader, isRTL && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('dashboard.recentAppointments')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
              <Text style={styles.seeAll}>{t('dashboard.viewAllAppointments')}</Text>
            </TouchableOpacity>
          </View>

          {todayAppointments.map(apt => (
            <TouchableOpacity
              key={apt.id}
              style={styles.aptCard}
              onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: apt.id })}
            >
              <View style={styles.aptAvatar}>
                <Text style={styles.aptAvatarText}>{apt.patientName[0]}</Text>
              </View>
              <View style={styles.aptInfo}>
                <Text style={[styles.aptName, isRTL && styles.rtlText]}>{apt.patientName}</Text>
                <Text style={[styles.aptTime, isRTL && styles.rtlText]}>{apt.date} • {apt.timeSlot}</Text>
              </View>
              <Badge
                label={apt.status === 'confirmed' ? (isRTL ? 'مؤكد' : 'Confirmed') : (isRTL ? 'انتظار' : 'Pending')}
                variant={apt.status === 'confirmed' ? 'success' : 'warning'}
                size="sm"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'create-outline', label: isRTL ? 'تعديل الملف' : 'Edit Profile', color: Colors.primary, screen: 'ProfileEdit' },
              { icon: 'business-outline', label: isRTL ? 'فروعي' : 'Branches', color: Colors.info, screen: 'DoctorBranches' },
              { icon: 'cash-outline', label: isRTL ? 'الإيرادات' : 'Earnings', color: Colors.warning, screen: 'Earnings' },
              { icon: 'star-outline', label: isRTL ? 'اشتراكي' : 'Subscription', color: Colors.success, screen: 'Subscription' },
              { icon: 'document-text-outline', label: isRTL ? 'الوثائق' : 'Documents', color: Colors.secondary, screen: 'Documents' },
              { icon: 'megaphone-outline', label: isRTL ? 'الإعلانات' : 'Ads', color: Colors.error, screen: 'Advertisement' },
            ].map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionCard} onPress={() => navigation.navigate(action.screen)}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
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
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  welcomeText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  doctorName: { fontSize: 20, fontWeight: '800', color: Colors.textWhite },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusCardTitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statusCardValue: { fontSize: 16, fontWeight: '700', marginTop: 1 },

  subWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  subWarningText: { flex: 1, fontSize: 12, color: Colors.warning, fontWeight: '500', marginHorizontal: 8 },

  // Stats
  statsSection: { padding: Spacing.xl, paddingBottom: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  rtlText: { textAlign: 'right' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  rtlRow: { flexDirection: 'row-reverse' },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
    position: 'relative',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: { fontSize: 10, fontWeight: '700', marginLeft: 2 },

  // Chart
  chartSection: { padding: Spacing.xl, paddingBottom: 0 },
  chartCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 140,
    ...Shadow.sm,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: { flex: 1, alignItems: 'center' },
  bar: { width: 24, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  // Appointments
  aptsSection: { padding: Spacing.xl, paddingBottom: 0 },
  aptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  aptAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aptAvatarText: { fontSize: 18, fontWeight: '800', color: Colors.textWhite },
  aptInfo: { flex: 1 },
  aptName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  aptTime: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  // Quick Actions
  actionsSection: { padding: Spacing.xl },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
});

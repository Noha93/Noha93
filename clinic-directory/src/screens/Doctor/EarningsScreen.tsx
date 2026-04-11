import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 80) / 7;

const MONTHLY_DATA = [
  { month: 'يناير', monthEn: 'Jan', amount: 12400 },
  { month: 'فبراير', monthEn: 'Feb', amount: 9800 },
  { month: 'مارس', monthEn: 'Mar', amount: 15200 },
  { month: 'أبريل', monthEn: 'Apr', amount: 11600 },
  { month: 'مايو', monthEn: 'May', amount: 17800 },
  { month: 'يونيو', monthEn: 'Jun', amount: 14300 },
  { month: 'يوليو', monthEn: 'Jul', amount: 16900 },
];

const WEEKLY_DATA = [
  { day: 'أح', dayEn: 'Sun', amount: 2400 },
  { day: 'إث', dayEn: 'Mon', amount: 1800 },
  { day: 'ث', dayEn: 'Tue', amount: 3100 },
  { day: 'أر', dayEn: 'Wed', amount: 2700 },
  { day: 'خ', dayEn: 'Thu', amount: 2200 },
  { day: 'ج', dayEn: 'Fri', amount: 0 },
  { day: 'س', dayEn: 'Sat', amount: 1400 },
];

const TRANSACTIONS = [
  { id: '1', patient: 'محمد علي', date: '2024-03-25', amount: 500, type: 'in_person', status: 'paid' },
  { id: '2', patient: 'سارة أحمد', date: '2024-03-24', amount: 500, type: 'teleconsult', status: 'paid' },
  { id: '3', patient: 'خالد حسن', date: '2024-03-23', amount: 500, type: 'in_person', status: 'paid' },
  { id: '4', patient: 'نور إبراهيم', date: '2024-03-22', amount: 500, type: 'in_person', status: 'pending' },
  { id: '5', patient: 'ليلى مصطفى', date: '2024-03-21', amount: 500, type: 'teleconsult', status: 'paid' },
];

type Period = 'weekly' | 'monthly';

export default function EarningsScreen() {
  const { isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<Period>('monthly');

  const data = period === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA;
  const maxVal = Math.max(...data.map(d => d.amount));
  const totalEarnings = data.reduce((s, d) => s + d.amount, 0);
  const currency = doctor?.currency || 'EGP';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'الإيرادات' : 'Earnings'}</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.secondary} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Total Card */}
        <LinearGradient colors={[Colors.secondary, Colors.secondaryDark]} style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            {isRTL ? `إجمالي ${period === 'weekly' ? 'الأسبوع' : 'الأشهر السبعة'}` : `Total (${period === 'weekly' ? 'This Week' : '7 Months'})`}
          </Text>
          <Text style={styles.totalAmount}>{totalEarnings.toLocaleString()} {currency}</Text>
          <View style={styles.totalRow}>
            <View style={styles.totalStat}>
              <Text style={styles.totalStatVal}>{data.filter(d => d.amount > 0).length}</Text>
              <Text style={styles.totalStatLbl}>{isRTL ? 'أيام عمل' : 'Working Days'}</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalStat}>
              <Text style={styles.totalStatVal}>{Math.round(totalEarnings / data.filter(d => d.amount > 0).length).toLocaleString()}</Text>
              <Text style={styles.totalStatLbl}>{isRTL ? 'متوسط يومي' : 'Daily Avg'}</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalStat}>
              <Text style={styles.totalStatVal}>{Math.round(totalEarnings / 500)}</Text>
              <Text style={styles.totalStatLbl}>{isRTL ? 'مريض' : 'Patients'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Period Toggle */}
        <View style={styles.periodToggle}>
          {(['weekly', 'monthly'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                {p === 'weekly' ? (isRTL ? 'أسبوعي' : 'Weekly') : (isRTL ? 'شهري' : 'Monthly')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={[styles.chartTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'مخطط الإيرادات' : 'Revenue Chart'}
          </Text>
          <View style={styles.chart}>
            {data.map((item, i) => {
              const barH = maxVal > 0 ? (item.amount / maxVal) * 120 : 0;
              const isHighest = item.amount === maxVal && maxVal > 0;
              return (
                <View key={i} style={styles.barGroup}>
                  {isHighest && (
                    <Text style={styles.barTopLabel}>{(item.amount / 1000).toFixed(1)}k</Text>
                  )}
                  <View style={styles.barWrap}>
                    <LinearGradient
                      colors={isHighest ? [Colors.secondary, Colors.secondaryDark] : [Colors.primary + '80', Colors.primary]}
                      style={[styles.bar, { height: Math.max(barH, 4) }]}
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {language === 'ar' ? ((item as any).month || (item as any).day) : ((item as any).monthEn || (item as any).dayEn)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Transactions */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'المعاملات الأخيرة' : 'Recent Transactions'}
        </Text>
        {TRANSACTIONS.map(tx => (
          <View key={tx.id} style={styles.txCard}>
            <View style={[styles.txIcon, { backgroundColor: tx.type === 'teleconsult' ? Colors.info + '20' : Colors.primary + '20' }]}>
              <Ionicons
                name={tx.type === 'teleconsult' ? 'videocam' : 'person'}
                size={18}
                color={tx.type === 'teleconsult' ? Colors.info : Colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.txPatient, isRTL && styles.rtlText]}>{tx.patient}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.txAmount}>{tx.amount} {currency}</Text>
              <View style={[styles.txStatus, { backgroundColor: tx.status === 'paid' ? Colors.successLight : Colors.warningLight }]}>
                <Text style={[styles.txStatusText, { color: tx.status === 'paid' ? Colors.success : Colors.warning }]}>
                  {tx.status === 'paid' ? (isRTL ? 'مدفوع' : 'Paid') : (isRTL ? 'معلق' : 'Pending')}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
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
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  exportBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: Spacing.xl },
  rtlText: { textAlign: 'right' },

  totalCard: {
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 16,
    ...Shadow.md,
  },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: '900', color: Colors.textWhite, marginBottom: 16 },
  totalRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.lg, padding: 12 },
  totalStat: { flex: 1, alignItems: 'center' },
  totalStatVal: { fontSize: 18, fontWeight: '800', color: Colors.textWhite },
  totalStatLbl: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  totalDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },

  periodToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: BorderRadius.full },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodBtnText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  periodBtnTextActive: { color: Colors.textWhite },

  chartCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  chartTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: 4 },
  barGroup: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barTopLabel: { fontSize: 9, color: Colors.secondary, fontWeight: '700', marginBottom: 2 },
  barWrap: { width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '80%', borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 6, textAlign: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  txIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  txPatient: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  txDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  txStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  txStatusText: { fontSize: 10, fontWeight: '600' },
});

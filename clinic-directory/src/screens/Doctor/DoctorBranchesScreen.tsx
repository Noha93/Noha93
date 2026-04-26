import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_BRANCHES, DAYS_AR, DAYS_EN } from '../../data/mockData';
import { Branch } from '../../types';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const MAX_BRANCHES: Record<string, number> = {
  free: 1,
  basic: 2,
  premium: 5,
  enterprise: 99,
};

export default function DoctorBranchesScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();

  const [branches, setBranches] = useState<Branch[]>(
    MOCK_BRANCHES.filter(b => b.doctorId === (doctor?.id || 'd001'))
  );

  const plan = doctor?.subscriptionPlan || 'free';
  const maxAllowed = MAX_BRANCHES[plan] ?? 1;
  const canAddMore = branches.length < maxAllowed;

  const handleAdd = () => {
    if (!canAddMore) {
      Alert.alert(
        isRTL ? 'تنبيه' : 'Limit Reached',
        t('branches.maxBranches'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: isRTL ? 'ترقية' : 'Upgrade', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }
    navigation.navigate('EditBranch', { branchId: undefined });
  };

  const handleEdit = (branch: Branch) => {
    navigation.navigate('EditBranch', { branchId: branch.id });
  };

  const handleDelete = (branch: Branch) => {
    if (branch.isMain) {
      Alert.alert(
        isRTL ? 'غير مسموح' : 'Not Allowed',
        isRTL ? 'لا يمكن حذف الفرع الرئيسي' : 'Cannot delete the main branch'
      );
      return;
    }
    Alert.alert(
      t('branches.deleteBranch'),
      t('branches.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => setBranches(prev => prev.filter(b => b.id !== branch.id)),
        },
      ]
    );
  };

  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);

  const getWorkingDays = (branch: Branch) => {
    const DAYS = language === 'ar' ? DAYS_AR : DAYS_EN;
    return branch.schedule
      .filter(d => d.isWorking)
      .map(d => DAYS[d.day])
      .join(', ');
  };

  const getStatusColor = (status: string) => {
    if (status === 'open') return Colors.open;
    if (status === 'busy') return Colors.warning;
    return Colors.closed;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'open') return t('branches.openNow');
    if (status === 'busy') return t('branches.busyNow');
    return t('branches.closedNow');
  };

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
          <Text style={styles.headerTitle}>{t('branches.title')}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Ionicons name="add" size={22} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Branch quota */}
        <View style={styles.quotaCard}>
          <View style={styles.quotaInfo}>
            <Ionicons name="business-outline" size={18} color={Colors.secondary} />
            <Text style={styles.quotaText}>
              {isRTL
                ? `${branches.length} من ${maxAllowed} فروع`
                : `${branches.length} of ${maxAllowed} branches`}
            </Text>
          </View>
          <View style={styles.quotaBar}>
            <View
              style={[
                styles.quotaFill,
                { width: `${Math.min((branches.length / maxAllowed) * 100, 100)}%` },
              ]}
            />
          </View>
          {!canAddMore && (
            <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
              <Text style={styles.upgradeLink}>{t('branches.upgradeForMore')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {branches.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="business-outline" size={52} color={Colors.border} />
            </View>
            <Text style={styles.emptyTitle}>{t('branches.noBranches')}</Text>
            <Text style={styles.emptyDesc}>{t('branches.noBranchesDesc')}</Text>
            <Button
              title={t('branches.addBranch')}
              onPress={handleAdd}
              variant="primary"
              size="md"
              style={{ marginTop: 20 }}
            />
          </View>
        ) : (
          branches.map(branch => (
            <View key={branch.id} style={styles.branchCard}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(branch.status) }]} />
                  <View style={styles.cardTitleBlock}>
                    <Text style={[styles.branchName, isRTL && styles.rtlText]}>
                      {language === 'ar' ? branch.nameAr : branch.nameEn}
                    </Text>
                    {branch.isMain && (
                      <Badge
                        label={t('branches.mainBranch')}
                        variant="gold"
                        size="sm"
                        style={{ marginTop: 3, alignSelf: isRTL ? 'flex-end' : 'flex-start' }}
                      />
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(branch.status) + '18' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(branch.status) }]}>
                    {getStatusLabel(branch.status)}
                  </Text>
                </View>
              </View>

              {/* Address */}
              <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoText, isRTL && styles.rtlText]}>
                  {`${branch.address.street}، ${branch.address.area}، ${branch.address.city}`}
                </Text>
              </View>

              {/* Phone */}
              <TouchableOpacity
                style={[styles.infoRow, isRTL && styles.rtlRow]}
                onPress={() => handleCall(branch.contact.mobile)}
              >
                <Ionicons name="call-outline" size={16} color={Colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoTextLink, isRTL && styles.rtlText]}>
                  {branch.contact.mobile}
                </Text>
              </TouchableOpacity>

              {/* Working days */}
              <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoText, isRTL && styles.rtlText]} numberOfLines={2}>
                  {getWorkingDays(branch) || (isRTL ? 'لا يوجد أيام عمل' : 'No working days')}
                </Text>
              </View>

              {/* Schedule summary */}
              {branch.schedule.filter(d => d.isWorking).slice(0, 1).map(day => (
                <View key={day.day} style={[styles.infoRow, isRTL && styles.rtlRow]}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, isRTL && styles.rtlText]}>
                    {`${day.startTime} - ${day.endTime}`}
                    {day.maxAppointments ? ` (${isRTL ? 'أقصى' : 'max'} ${day.maxAppointments})` : ''}
                  </Text>
                </View>
              ))}

              {/* Actions */}
              <View style={[styles.cardActions, isRTL && styles.rtlRow]}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => handleEdit(branch)}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.primary} />
                  <Text style={styles.editBtnText}>{t('common.edit')}</Text>
                </TouchableOpacity>

                {!branch.isMain && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(branch)}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    <Text style={styles.deleteBtnText}>{t('common.delete')}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionBtn, styles.callBtn]}
                  onPress={() => handleCall(branch.contact.mobile)}
                >
                  <Ionicons name="call-outline" size={16} color={Colors.success} />
                  <Text style={styles.callBtnText}>{t('common.call')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {branches.length > 0 && canAddMore && (
          <TouchableOpacity style={styles.addMoreBtn} onPress={handleAdd}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.addMoreText}>{t('branches.addBranch')}</Text>
          </TouchableOpacity>
        )}

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
    marginBottom: 16,
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quotaCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  quotaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quotaText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  quotaBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quotaFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  upgradeLink: {
    fontSize: 12,
    color: Colors.secondaryLight,
    marginTop: 8,
    textDecorationLine: 'underline',
  },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Shadow.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  branchCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  cardTitleBlock: { flex: 1 },
  branchName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rtlRow: { flexDirection: 'row-reverse' },
  infoIcon: { marginRight: 8, marginTop: 2 },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  rtlText: { textAlign: 'right' },
  infoTextLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
    textDecorationLine: 'underline',
  },

  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  editBtn: { borderColor: Colors.primary, backgroundColor: Colors.primaryUltraLight },
  editBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginLeft: 4 },
  deleteBtn: { borderColor: Colors.error, backgroundColor: Colors.errorLight },
  deleteBtnText: { fontSize: 12, color: Colors.error, fontWeight: '600', marginLeft: 4 },
  callBtn: { borderColor: Colors.success, backgroundColor: Colors.successLight },
  callBtnText: { fontSize: 12, color: Colors.success, fontWeight: '600', marginLeft: 4 },

  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    paddingVertical: 16,
    marginTop: 4,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 8,
  },
});

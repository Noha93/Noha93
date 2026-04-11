import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function SubscriptionScreen() {
  const { t, isRTL, language } = useLanguage();
  const { doctor } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(doctor?.subscriptionPlan || 'free');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = doctor?.subscriptionPlan || 'free';

  const handleSubscribe = (plan: string) => {
    if (plan === currentPlan) return;
    Alert.alert(
      isRTL ? 'تأكيد الاشتراك' : 'Confirm Subscription',
      isRTL ? `هل تريد الاشتراك في الخطة ${plan}؟` : `Subscribe to ${plan} plan?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('subscription.payNow'),
          onPress: () => Alert.alert(isRTL ? 'تم الاشتراك!' : 'Subscribed!', t('subscription.subscriptionSuccess')),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.secondaryDark]} style={styles.header}>
        <View style={styles.decorCircle} />
        <Text style={styles.headerTitle}>{t('subscription.title')}</Text>
        <Text style={styles.headerDesc}>
          {isRTL ? 'اشترك لزيادة ظهور عيادتك وجذب مرضى جدد' : 'Subscribe to increase your visibility and attract new patients'}
        </Text>

        {/* Current Plan Badge */}
        <View style={styles.currentPlanCard}>
          <Ionicons name="star" size={20} color={Colors.secondary} />
          <View style={styles.currentPlanInfo}>
            <Text style={styles.currentPlanLabel}>{t('subscription.currentPlan')}</Text>
            <Text style={styles.currentPlanName}>
              {SUBSCRIPTION_PLANS.find(p => p.plan === currentPlan)?.[language === 'ar' ? 'nameAr' : 'nameEn'] || ''}
            </Text>
          </View>
          {currentPlan !== 'free' && (
            <Text style={styles.expiryText}>
              {isRTL ? 'ينتهي في 30 أبريل 2025' : 'Expires Apr 30, 2025'}
            </Text>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          {(['monthly', 'yearly'] as const).map(b => (
            <TouchableOpacity
              key={b}
              style={[styles.billingBtn, billing === b && styles.billingBtnActive]}
              onPress={() => setBilling(b)}
            >
              <Text style={[styles.billingText, billing === b && styles.billingTextActive]}>
                {b === 'monthly' ? t('subscription.monthly') : t('subscription.yearly')}
              </Text>
              {b === 'yearly' && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>-20%</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans */}
        {SUBSCRIPTION_PLANS.map(plan => {
          const isSelected = selectedPlan === plan.plan;
          const isCurrent = currentPlan === plan.plan;
          const isPopular = plan.plan === 'premium';
          const price = billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price;

          return (
            <TouchableOpacity
              key={plan.plan}
              style={[
                styles.planCard,
                isSelected && styles.planCardSelected,
                isPopular && styles.planCardPopular,
              ]}
              onPress={() => setSelectedPlan(plan.plan)}
              activeOpacity={0.9}
            >
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('subscription.popular')}</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, isPopular && styles.planNamePopular]}>
                    {language === 'ar' ? plan.nameAr : plan.nameEn}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, isPopular && styles.pricePopular]}>
                      {price === 0 ? t('subscription.free') : `${price} ${isRTL ? 'ج.م' : 'EGP'}`}
                    </Text>
                    {price > 0 && (
                      <Text style={styles.pricePeriod}>/{isRTL ? 'شهر' : 'mo'}</Text>
                    )}
                  </View>
                </View>
                {isCurrent && <Badge label={t('subscription.current')} variant="gold" size="sm" />}
              </View>

              <View style={styles.featuresList}>
                {(language === 'ar' ? plan.featuresAr : plan.features).map((feature, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={isPopular ? Colors.secondary : Colors.success}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {plan.canAdvertise && (
                <View style={styles.adsBadge}>
                  <Ionicons name="megaphone-outline" size={14} color={Colors.warning} />
                  <Text style={styles.adsBadgeText}>{isRTL ? 'يدعم الإعلانات' : 'Ads supported'}</Text>
                </View>
              )}

              {!isCurrent && (
                <Button
                  title={t('subscription.subscribe')}
                  onPress={() => handleSubscribe(plan.plan)}
                  variant={isPopular ? 'gold' : 'outline'}
                  fullWidth
                  size="sm"
                  style={{ marginTop: 12 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 24, paddingHorizontal: Spacing.xl, overflow: 'hidden' },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.textWhite, marginBottom: 6 },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 },
  currentPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.secondary + '40',
  },
  currentPlanInfo: { flex: 1, marginLeft: 10 },
  currentPlanLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  currentPlanName: { fontSize: 16, fontWeight: '700', color: Colors.secondary },
  expiryText: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  content: { flex: 1 },
  contentInner: { padding: Spacing.xl, paddingBottom: 40 },

  billingToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billingBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  billingBtnActive: { backgroundColor: Colors.primary },
  billingText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  billingTextActive: { color: Colors.textWhite, fontWeight: '700' },
  saveBadge: { backgroundColor: Colors.success, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  saveText: { fontSize: 10, color: Colors.textWhite, fontWeight: '700' },

  planCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: Colors.primary },
  planCardPopular: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  popularText: { fontSize: 11, color: Colors.textWhite, fontWeight: '700' },

  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  planName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  planNamePopular: { color: Colors.secondaryDark },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  pricePopular: { color: Colors.secondaryDark },
  pricePeriod: { fontSize: 14, color: Colors.textMuted, marginLeft: 2 },

  featuresList: { gap: 8, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontSize: 13, color: Colors.textSecondary, marginLeft: 8 },

  adsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  adsBadgeText: { fontSize: 12, color: Colors.warning, fontWeight: '600', marginLeft: 4 },
});

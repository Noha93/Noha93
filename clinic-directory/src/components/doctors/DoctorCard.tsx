import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { Typography, FontSize } from '../../constants/typography';
import { useLanguage } from '../../context/LanguageContext';
import Rating from '../common/Rating';
import Badge from '../common/Badge';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  variant?: 'list' | 'featured' | 'compact';
  style?: ViewStyle;
}

export default function DoctorCard({ doctor, onPress, variant = 'list', style }: DoctorCardProps) {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const name = isAr ? `${doctor.titleAr} ${doctor.nameAr}` : `${doctor.titleEn} ${doctor.nameEn}`;
  const specialization = isAr ? doctor.specializationAr : doctor.specializationEn;

  const statusColor = doctor.clinicStatus === 'open' ? Colors.open : Colors.closed;
  const statusLabel = doctor.clinicStatus === 'open'
    ? t('common.open')
    : t('common.closed');

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.featuredCard, style]} activeOpacity={0.9}>
        <Image source={{ uri: doctor.avatar }} style={styles.featuredAvatar} />
        {doctor.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color={Colors.secondary} />
          </View>
        )}
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName} numberOfLines={1}>{name}</Text>
          <Text style={styles.featuredSpec} numberOfLines={1}>{specialization}</Text>
          <View style={styles.featuredMeta}>
            <Rating rating={doctor.rating} size={11} showNumber />
          </View>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.compactCard, style]} activeOpacity={0.9}>
        <Image source={{ uri: doctor.avatar }} style={styles.compactAvatar} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{name}</Text>
          <Text style={styles.compactSpec}>{specialization}</Text>
          <Rating rating={doctor.rating} size={12} reviewCount={doctor.reviewCount} showNumber />
        </View>
        <View style={styles.compactRight}>
          <Text style={styles.fee}>{doctor.consultationFee} {isAr ? 'ج.م' : 'EGP'}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusPillText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default list variant
  return (
    <TouchableOpacity onPress={onPress} style={[styles.listCard, style]} activeOpacity={0.9}>
      <View style={styles.listLeft}>
        <Image source={{ uri: doctor.avatar }} style={styles.listAvatar} />
        {doctor.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <Text style={styles.listName} numberOfLines={1}>{name}</Text>
          {doctor.isFeatured && (
            <Badge label={isAr ? 'مميز' : 'Featured'} variant="gold" size="sm" />
          )}
        </View>
        <Text style={styles.listSpec}>{specialization}</Text>
        <View style={styles.listMeta}>
          <Rating rating={doctor.rating} size={13} showNumber reviewCount={doctor.reviewCount} />
          <View style={styles.dot} />
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.expText}>{doctor.experience} {isAr ? 'سنة' : 'yrs'}</Text>
        </View>
        <View style={styles.listFooter}>
          <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusPillText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
          <Text style={styles.listFee}>
            {doctor.consultationFee} {isAr ? 'ج.م' : 'EGP'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Featured Card
  featuredCard: {
    width: 130,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    marginRight: Spacing.sm,
    ...Shadow.md,
  },
  featuredAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.borderLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  featuredBadge: {
    position: 'absolute',
    top: 40,
    right: 28,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 2,
    borderColor: Colors.backgroundWhite,
  },
  featuredInfo: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    width: '100%',
  },
  featuredName: {
    ...Typography.labelSmall,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  featuredSpec: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  featuredMeta: {
    marginTop: 4,
  },
  statusDot: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 9,
    color: Colors.textWhite,
    fontWeight: '600',
  },

  // Compact Card
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  compactAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.borderLight,
  },
  compactInfo: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  compactName: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  compactSpec: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  fee: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  // List Card
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.md,
  },
  listLeft: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  listAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.borderLight,
    borderWidth: 2,
    borderColor: Colors.primaryUltraLight,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 10,
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  listName: {
    ...Typography.h5,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
    fontSize: 15,
  },
  listSpec: {
    ...Typography.bodySmall,
    color: Colors.primary,
    marginBottom: 4,
    fontWeight: '500',
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 6,
  },
  expText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginLeft: 3,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listFee: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
  },
});

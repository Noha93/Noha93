import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hospital } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useLanguage } from '../../context/LanguageContext';
import Rating from '../common/Rating';
import Badge from '../common/Badge';

interface HospitalCardProps {
  hospital: Hospital;
  onPress: () => void;
  variant?: 'list' | 'featured';
  style?: ViewStyle;
}

export default function HospitalCard({ hospital, onPress, variant = 'list', style }: HospitalCardProps) {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const name = isAr ? hospital.nameAr : hospital.nameEn;
  const description = isAr ? hospital.descriptionAr : hospital.description;

  const typeLabel = () => {
    switch (hospital.type) {
      case 'hospital': return isAr ? 'مستشفى' : 'Hospital';
      case 'medical_center': return isAr ? 'مركز طبي' : 'Medical Center';
      case 'clinic_complex': return isAr ? 'مجمع عيادات' : 'Clinic Complex';
    }
  };

  const typeColor = () => {
    switch (hospital.type) {
      case 'hospital': return 'error';
      case 'medical_center': return 'primary';
      case 'clinic_complex': return 'success';
      default: return 'primary';
    }
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.featuredCard, style]} activeOpacity={0.9}>
        <Image source={{ uri: hospital.coverImage }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <Badge label={typeLabel()} variant={typeColor() as any} size="sm" />
          <Text style={styles.featuredName} numberOfLines={1}>{name}</Text>
          <View style={styles.featuredMeta}>
            <Rating rating={hospital.rating} size={12} showNumber reviewCount={hospital.reviewCount} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.listCard, style]} activeOpacity={0.9}>
      <Image source={{ uri: hospital.coverImage }} style={styles.listImage} />
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <Badge label={typeLabel()} variant={typeColor() as any} size="sm" />
          {hospital.isFeatured && (
            <Ionicons name="star" size={14} color={Colors.secondary} />
          )}
        </View>
        <Text style={styles.listName} numberOfLines={1}>{name}</Text>
        <Text style={styles.listDesc} numberOfLines={2}>{description}</Text>
        <View style={styles.listFooter}>
          <Rating rating={hospital.rating} size={13} showNumber reviewCount={hospital.reviewCount} />
          <View style={styles.doctorCount}>
            <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.doctorCountText}>{hospital.doctorIds.length} {isAr ? 'طبيب' : 'Doctors'}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {hospital.address.area}, {hospital.address.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    width: 200,
    height: 140,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    ...Shadow.md,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.sm,
    backgroundColor: 'rgba(13,46,82,0.75)',
    paddingTop: 16,
  },
  featuredName: {
    ...Typography.labelSmall,
    color: Colors.textWhite,
    fontWeight: '700',
    marginTop: 4,
  },
  featuredMeta: {
    marginTop: 2,
  },

  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.sm,
  },
  listImage: {
    width: 100,
    height: '100%',
    backgroundColor: Colors.borderLight,
  },
  listInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listName: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  listDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  doctorCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorCountText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginLeft: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...Typography.caption,
    color: Colors.primary,
    marginLeft: 3,
    fontWeight: '500',
  },
});

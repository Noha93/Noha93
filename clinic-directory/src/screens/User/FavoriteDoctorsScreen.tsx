import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import DoctorCard from '../../components/doctors/DoctorCard';

export default function FavoriteDoctorsScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [favorites, setFavorites] = useState<string[]>(user?.favoriteDoctor || ['d1', 'd3']);
  const favDoctors = MOCK_DOCTORS.filter(d => favorites.includes(d.id));

  const handleRemove = (doctorId: string, doctorName: string) => {
    Alert.alert(
      isRTL ? 'إزالة من المفضلة' : 'Remove Favorite',
      isRTL ? `هل تريد إزالة ${doctorName} من المفضلة؟` : `Remove ${doctorName} from favorites?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: isRTL ? 'إزالة' : 'Remove',
          style: 'destructive',
          onPress: () => setFavorites(prev => prev.filter(id => id !== doctorId)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'الأطباء المفضلون' : 'Favorite Doctors'}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{favDoctors.length}</Text>
        </View>
      </LinearGradient>

      {favDoctors.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={52} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>{isRTL ? 'لا يوجد أطباء مفضلون' : 'No Favorites Yet'}</Text>
          <Text style={styles.emptyDesc}>
            {isRTL ? 'أضف أطباءك المفضلين من صفحة تفاصيل الطبيب' : 'Add doctors to favorites from doctor profile page'}
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.browseBtnText}>{isRTL ? 'تصفح الأطباء' : 'Browse Doctors'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favDoctors}
          keyExtractor={d => d.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
                activeOpacity={0.9}
              >
                <DoctorCard doctor={item} variant="list" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item.id, language === 'ar' ? item.nameAr : item.nameEn)}
              >
                <Ionicons name="heart" size={22} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  countBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 13, fontWeight: '700', color: Colors.textWhite },

  list: { padding: Spacing.xl, paddingBottom: 40 },
  cardWrapper: { marginBottom: 12, position: 'relative' },
  card: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  browseBtnText: { fontSize: 14, color: Colors.textWhite, fontWeight: '700' },
});

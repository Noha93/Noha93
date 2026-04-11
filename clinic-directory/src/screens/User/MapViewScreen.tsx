import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Linking, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import { MOCK_HOSPITALS } from '../../data/mockData';

const { width, height } = Dimensions.get('window');
type RouteParams = { doctorId?: string; hospitalId?: string };

export default function MapViewScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { doctorId, hospitalId } = route.params || {};

  const doctor = doctorId ? MOCK_DOCTORS.find(d => d.id === doctorId) : null;
  const hospital = hospitalId ? MOCK_HOSPITALS.find(h => h.id === hospitalId) : null;

  const entity = doctor || hospital;
  const name = entity
    ? (language === 'ar'
        ? entity.nameAr
        : (entity as any).nameEn)
    : '';
  const address = entity?.address;

  const openInMaps = () => {
    if (!address?.coordinates) return;
    const { latitude, longitude } = address.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const openWaze = () => {
    if (!address?.coordinates) return;
    const { latitude, longitude } = address.coordinates;
    Linking.openURL(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`);
  };

  // Simulated map visualization
  const renderSimulatedMap = () => {
    const coord = address?.coordinates;
    if (!coord) return null;

    return (
      <View style={styles.mapContainer}>
        {/* Map background grid */}
        <LinearGradient
          colors={['#E8F4F8', '#D5EBF0']}
          style={styles.mapBg}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <View key={`h${i}`} style={[styles.gridH, { top: (height * 0.4 / 5) * i }]} />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <View key={`v${i}`} style={[styles.gridV, { left: (width / 6) * i }]} />
          ))}

          {/* Roads */}
          <View style={[styles.road, styles.roadH, { top: '40%' }]} />
          <View style={[styles.road, styles.roadH, { top: '65%' }]} />
          <View style={[styles.road, styles.roadV, { left: '30%' }]} />
          <View style={[styles.road, styles.roadV, { left: '60%' }]} />

          {/* Location Pin */}
          <View style={styles.pinContainer}>
            <View style={styles.pinPulse} />
            <View style={styles.pin}>
              <Ionicons name="location" size={28} color={Colors.error} />
            </View>
            <View style={styles.pinShadow} />
          </View>

          {/* Coordinates label */}
          <View style={styles.coordsLabel}>
            <Text style={styles.coordsText}>
              {coord.latitude.toFixed(4)}, {coord.longitude.toFixed(4)}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      {renderSimulatedMap()}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.searchBarText} numberOfLines={1}>
            {address ? `${address.street}، ${address.area}` : (isRTL ? 'الموقع' : 'Location')}
          </Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <Text style={[styles.entityName, isRTL && styles.rtlText]}>{name}</Text>
        {address && (
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textMuted} />
            <Text style={[styles.addressText, isRTL && styles.rtlText]}>
              {address.street}، {address.area}، {address.city}
            </Text>
          </View>
        )}

        {doctor && (
          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Ionicons name="call" size={14} color={Colors.primary} />
              <Text style={styles.infoBadgeText}>{doctor.contact.phone}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Ionicons name="phone-portrait" size={14} color={Colors.success} />
              <Text style={styles.infoBadgeText}>{doctor.contact.mobile}</Text>
            </View>
          </View>
        )}

        {/* Map App Buttons */}
        <View style={styles.mapAppsRow}>
          <TouchableOpacity style={styles.mapAppBtn} onPress={openInMaps}>
            <LinearGradient colors={['#4285F4', '#34A853']} style={styles.mapAppIcon}>
              <Text style={styles.mapAppIconText}>G</Text>
            </LinearGradient>
            <Text style={styles.mapAppText}>{isRTL ? 'خرائط جوجل' : 'Google Maps'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapAppBtn} onPress={openWaze}>
            <View style={[styles.mapAppIcon, { backgroundColor: '#33CCFF' }]}>
              <Ionicons name="car" size={18} color={Colors.textWhite} />
            </View>
            <Text style={styles.mapAppText}>Waze</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapAppBtn}
            onPress={() => address?.coordinates && Linking.openURL(
              `https://maps.apple.com/?q=${address.coordinates.latitude},${address.coordinates.longitude}`
            )}
          >
            <View style={[styles.mapAppIcon, { backgroundColor: Colors.textPrimary }]}>
              <Ionicons name="map" size={18} color={Colors.textWhite} />
            </View>
            <Text style={styles.mapAppText}>{isRTL ? 'خرائط آبل' : 'Apple Maps'}</Text>
          </TouchableOpacity>
        </View>

        {doctor && (
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('Booking', { doctorId: doctor.id })}
          >
            <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.bookBtnGrad}>
              <Ionicons name="calendar" size={18} color={Colors.textWhite} />
              <Text style={styles.bookBtnText}>{isRTL ? 'احجز موعداً' : 'Book Appointment'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  mapContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapBg: { flex: 1, position: 'relative', overflow: 'hidden' },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
  road: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.8)' },
  roadH: { left: 0, right: 0, height: 10 },
  roadV: { top: 0, bottom: 0, width: 10 },
  pinContainer: {
    position: 'absolute',
    top: '38%',
    left: '47%',
    alignItems: 'center',
  },
  pinPulse: {
    position: 'absolute',
    top: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.error + '30',
  },
  pin: { zIndex: 2 },
  pinShadow: {
    width: 12,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: -4,
  },
  coordsLabel: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  coordsText: { fontSize: 11, color: Colors.textWhite },

  topBar: {
    position: 'absolute',
    top: 50,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    ...Shadow.md,
  },
  searchBarText: { fontSize: 13, color: Colors.textPrimary, flex: 1 },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
    paddingBottom: 32,
    ...Shadow.xl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  entityName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  addressText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  rtlText: { textAlign: 'right' },

  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryUltraLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  infoBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  mapAppsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  mapAppBtn: { alignItems: 'center', gap: 6 },
  mapAppIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapAppIconText: { fontSize: 22, fontWeight: '800', color: Colors.textWhite },
  mapAppText: { fontSize: 11, color: Colors.textSecondary },

  bookBtn: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  bookBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: Colors.textWhite },
});

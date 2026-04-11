import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { MOCK_DOCTORS } from '../../data/mockData';
import DoctorCard from '../../components/doctors/DoctorCard';

const { width, height } = Dimensions.get('window');

// Mock doctor locations (relative to a central point)
const MOCK_PINS = [
  { id: 'd001', x: 0.4, y: 0.45 },
  { id: 'd002', x: 0.6, y: 0.35 },
  { id: 'd003', x: 0.55, y: 0.6 },
  { id: 'd004', x: 0.3, y: 0.55 },
];

export default function NearbyScreen() {
  const { t, isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const mapWidth = width;
  const mapHeight = height * 0.5;

  const selectedDoctor = selectedPin ? MOCK_DOCTORS.find(d => d.id === selectedPin) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('search.nearby')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewToggle, viewMode === 'map' && styles.viewToggleActive]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map-outline" size={18} color={viewMode === 'map' ? Colors.primary : Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? Colors.primary : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'map' ? (
        <>
          {/* Map Placeholder */}
          <View style={[styles.mapContainer, { width: mapWidth, height: mapHeight }]}>
            <LinearGradient
              colors={['#e8f4f8', '#d4eaf5', '#c8e0f0']}
              style={styles.mapBg}
            >
              {/* Grid lines (map simulation) */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <React.Fragment key={v}>
                  <View style={[styles.gridLineH, { top: `${v * 100}%` }]} />
                  <View style={[styles.gridLineV, { left: `${v * 100}%` }]} />
                </React.Fragment>
              ))}

              {/* Streets */}
              <View style={styles.streetH} />
              <View style={styles.streetV} />

              {/* User location */}
              <View style={[styles.userPin, { left: mapWidth * 0.5, top: mapHeight * 0.5 }]}>
                <View style={styles.userPinInner} />
                <View style={styles.userPinPulse} />
              </View>

              {/* Doctor pins */}
              {MOCK_PINS.map(pin => {
                const doctor = MOCK_DOCTORS.find(d => d.id === pin.id);
                if (!doctor) return null;
                const isSelected = selectedPin === pin.id;
                return (
                  <TouchableOpacity
                    key={pin.id}
                    style={[
                      styles.doctorPin,
                      {
                        left: mapWidth * pin.x - 20,
                        top: mapHeight * pin.y - 20,
                        backgroundColor: doctor.clinicStatus === 'open' ? Colors.open : Colors.closed,
                        transform: [{ scale: isSelected ? 1.2 : 1 }],
                        zIndex: isSelected ? 10 : 1,
                      },
                    ]}
                    onPress={() => setSelectedPin(isSelected ? null : pin.id)}
                  >
                    <Ionicons name="medical" size={14} color={Colors.textWhite} />
                  </TouchableOpacity>
                );
              })}

              {/* Map info */}
              <TouchableOpacity style={styles.locationBtn} onPress={() => setLocationEnabled(true)}>
                <Ionicons name="locate" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Selected Doctor Card */}
          {selectedDoctor ? (
            <View style={styles.selectedCard}>
              <DoctorCard
                doctor={selectedDoctor}
                variant="compact"
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: selectedDoctor.id })}
              />
            </View>
          ) : (
            <View style={styles.nearbyList}>
              <Text style={[styles.listTitle, isRTL && styles.rtlText]}>
                {isRTL ? 'أطباء قريبون منك' : 'Doctors Near You'}
              </Text>
              <FlatList
                data={MOCK_DOCTORS.slice(0, 3)}
                keyExtractor={d => d.id}
                renderItem={({ item }) => (
                  <DoctorCard
                    doctor={item}
                    variant="compact"
                    onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
                  />
                )}
                scrollEnabled={false}
              />
            </View>
          )}
        </>
      ) : (
        <FlatList
          data={MOCK_DOCTORS}
          keyExtractor={d => d.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: Spacing.xl }}>
              <DoctorCard
                doctor={item}
                variant="list"
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
              />
            </View>
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={styles.radiusSelector}>
              <Text style={[styles.radiusLabel, isRTL && styles.rtlText]}>
                {isRTL ? 'نطاق البحث: 5 كم' : 'Search radius: 5 km'}
              </Text>
            </View>
          }
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
    paddingBottom: 12,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  rtlText: { textAlign: 'right' },
  headerActions: { flexDirection: 'row' },
  viewToggle: {
    padding: 8,
    borderRadius: BorderRadius.sm,
    marginLeft: 4,
    backgroundColor: Colors.background,
  },
  viewToggleActive: { backgroundColor: Colors.primaryUltraLight },

  mapContainer: { position: 'relative', overflow: 'hidden' },
  mapBg: { flex: 1 },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  streetH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: -4,
  },
  streetV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginLeft: -4,
  },
  userPin: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  userPinPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary + '30',
  },
  doctorPin: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
    ...Shadow.md,
  },
  locationBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },

  selectedCard: { padding: Spacing.xl, paddingBottom: 0 },
  nearbyList: { flex: 1, padding: Spacing.xl },
  listTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  radiusSelector: { paddingHorizontal: Spacing.xl, paddingTop: 8, paddingBottom: 4 },
  radiusLabel: { fontSize: 13, color: Colors.textMuted },
});

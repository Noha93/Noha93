export type PlaceType = 'hospital' | 'police' | 'fire' | 'pharmacy' | 'ambulance';

export interface NearbyPlace {
  id: string;
  ar: string;
  en: string;
  type: PlaceType;
  distanceKm: number;
  etaMin: number;
  open: boolean;
  phone: string;
  x: number;
  y: number;
}

export const nearbyPlaces: NearbyPlace[] = [
  { id: 'p1', ar: 'مستشفى القصر العيني', en: 'Kasr Al Ainy Hospital', type: 'hospital', distanceKm: 1.2, etaMin: 5, open: true, phone: '123', x: 32, y: 40 },
  { id: 'p2', ar: 'قسم شرطة قصر النيل', en: 'Qasr El Nil Police', type: 'police', distanceKm: 0.8, etaMin: 3, open: true, phone: '122', x: 62, y: 30 },
  { id: 'p3', ar: 'مطافي وسط البلد', en: 'Downtown Fire Station', type: 'fire', distanceKm: 2.1, etaMin: 8, open: true, phone: '180', x: 48, y: 66 },
  { id: 'p4', ar: 'صيدلية العزبي 24 ساعة', en: 'El Ezaby Pharmacy 24h', type: 'pharmacy', distanceKm: 0.5, etaMin: 2, open: true, phone: '19600', x: 74, y: 58 },
  { id: 'p5', ar: 'مركز إسعاف التحرير', en: 'Tahrir Ambulance Center', type: 'ambulance', distanceKm: 1.6, etaMin: 6, open: true, phone: '123', x: 24, y: 70 },
  { id: 'p6', ar: 'مستشفى الدمرداش', en: 'Demerdash Hospital', type: 'hospital', distanceKm: 3.4, etaMin: 12, open: false, phone: '123', x: 84, y: 22 },
];

export const placeTypeMeta: Record<PlaceType, { icon: string; color: string }> = {
  hospital: { icon: 'medkit-outline', color: '#00B894' },
  police: { icon: 'shield-outline', color: '#2962FF' },
  fire: { icon: 'flame-outline', color: '#FF6B00' },
  pharmacy: { icon: 'medical-outline', color: '#E53935' },
  ambulance: { icon: 'car-outline', color: '#00B894' },
};

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');
const IMG_SIZE = (width - 48 - 8) / 2;

const MOCK_PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600', type: 'image' },
  { id: '2', url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600', type: 'image' },
  { id: '3', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600', type: 'image' },
];

export default function ClinicPhotosScreen() {
  const { t, isRTL } = useLanguage();
  const { doctor } = useAuth();
  const navigation = useNavigation<any>();
  const [photos, setPhotos] = useState(MOCK_PHOTOS);

  const maxPhotos = doctor?.subscriptionPlan === 'free' ? 3
    : doctor?.subscriptionPlan === 'basic' ? 10 : 999;

  const handleAddPhoto = () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        isRTL ? 'تجاوز الحد المسموح' : 'Limit Reached',
        isRTL ? `الخطة الحالية تسمح بـ ${maxPhotos} صور فقط` : `Your plan allows up to ${maxPhotos} photos`,
      );
      return;
    }
    Alert.alert(
      isRTL ? 'إضافة صورة' : 'Add Photo',
      '',
      [
        { text: isRTL ? 'الكاميرا' : 'Camera', onPress: () => {} },
        { text: isRTL ? 'من الجهاز' : 'Gallery', onPress: () => {} },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      isRTL ? 'حذف الصورة' : 'Delete Photo',
      isRTL ? 'هل تريد حذف هذه الصورة؟' : 'Delete this photo?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'), style: 'destructive',
          onPress: () => setPhotos(prev => prev.filter(p => p.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('doctorProfile.clinicPhotos')}</Text>
        <Text style={styles.counter}>{photos.length}/{maxPhotos}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPhoto}>
          <LinearGradient
            colors={[Colors.primaryUltraLight, Colors.background]}
            style={styles.addBtnGrad}
          >
            <Ionicons name="add-circle-outline" size={40} color={Colors.primary} />
            <Text style={styles.addBtnText}>{t('doctorProfile.addPhoto')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {photos.map(photo => (
          <View key={photo.id} style={styles.photoWrapper}>
            <Image source={{ uri: photo.url }} style={styles.photo} />
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(photo.id)}>
              <Ionicons name="close-circle" size={22} color={Colors.error} />
            </TouchableOpacity>
            {photo.type === 'video' && (
              <View style={styles.playIcon}>
                <Ionicons name="play-circle" size={32} color={Colors.textWhite} />
              </View>
            )}
          </View>
        ))}

        {/* Video Upload */}
        <TouchableOpacity style={styles.videoBtn}>
          <Ionicons name="videocam-outline" size={32} color={Colors.secondary} />
          <Text style={styles.videoBtnText}>{t('doctorProfile.addVideo')}</Text>
          <Text style={styles.videoBtnNote}>
            {isRTL ? `${doctor?.subscriptionPlan === 'free' ? 0 : doctor?.subscriptionPlan === 'basic' ? 1 : 3} فيديو متاح` : ''}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isRTL
            ? `يمكنك إضافة حتى ${maxPhotos} صورة في خطتك الحالية`
            : `You can add up to ${maxPhotos} photos in your current plan`}
        </Text>
      </View>
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
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  counter: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.xl,
    gap: 8,
    paddingBottom: 80,
  },
  addBtn: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginTop: 6 },
  photoWrapper: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadow.sm,
  },
  photo: { width: '100%', height: '100%' },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
  },
  playIcon: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoBtn: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryUltraLight,
  },
  videoBtnText: { fontSize: 12, color: Colors.secondaryDark, fontWeight: '600', marginTop: 6 },
  videoBtnNote: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundWhite,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: Colors.textMuted },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

interface DoctorNotif {
  id: string;
  type: 'new_booking' | 'cancellation' | 'review' | 'subscription' | 'system';
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  time: string;
  isRead: boolean;
  actionScreen?: string;
}

const MOCK_NOTIFS: DoctorNotif[] = [
  {
    id: '1', type: 'new_booking', isRead: false, time: '5 دقائق',
    titleAr: 'حجز جديد!', titleEn: 'New Booking!',
    bodyAr: 'قام محمد علي بحجز موعد غداً الساعة 10:00 صباحاً', bodyEn: 'Mohamed Ali booked an appointment tomorrow at 10:00 AM',
    actionScreen: 'Appointments',
  },
  {
    id: '2', type: 'cancellation', isRead: false, time: '1 ساعة',
    titleAr: 'إلغاء موعد', titleEn: 'Appointment Cancelled',
    bodyAr: 'قامت سارة أحمد بإلغاء موعدها يوم الجمعة', bodyEn: 'Sarah Ahmed cancelled her Friday appointment',
    actionScreen: 'Appointments',
  },
  {
    id: '3', type: 'review', isRead: false, time: '3 ساعات',
    titleAr: 'تقييم جديد', titleEn: 'New Review',
    bodyAr: 'أعطاك خالد حسن تقييم 5 نجوم ✨', bodyEn: 'Khaled Hassan gave you a 5-star review ✨',
  },
  {
    id: '4', type: 'subscription', isRead: true, time: 'أمس',
    titleAr: 'اشتراكك ينتهي قريباً', titleEn: 'Subscription Expiring Soon',
    bodyAr: 'اشتراكك البريميوم ينتهي خلال 7 أيام. جدّد الآن للاستمرار', bodyEn: 'Your Premium subscription expires in 7 days. Renew now to continue',
    actionScreen: 'Subscription',
  },
  {
    id: '5', type: 'new_booking', isRead: true, time: '2 أيام',
    titleAr: 'حجز جديد', titleEn: 'New Booking',
    bodyAr: 'قامت نور إبراهيم بحجز موعد الأحد القادم', bodyEn: 'Nour Ibrahim booked an appointment next Sunday',
    actionScreen: 'Appointments',
  },
  {
    id: '6', type: 'system', isRead: true, time: '3 أيام',
    titleAr: 'تم التحقق من ملفك', titleEn: 'Profile Verified',
    bodyAr: 'تهانينا! تم التحقق من وثائقك وأصبح ملفك موثقاً', bodyEn: 'Congratulations! Your documents have been verified and your profile is now verified',
  },
];

const TYPE_ICON: Record<string, { icon: string; color: string }> = {
  new_booking:  { icon: 'calendar', color: Colors.primary },
  cancellation: { icon: 'calendar-clear', color: Colors.error },
  review:       { icon: 'star', color: Colors.secondary },
  subscription: { icon: 'card', color: Colors.warning },
  system:       { icon: 'checkmark-circle', color: Colors.success },
};

export default function DoctorNotificationsScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const handlePress = (notif: DoctorNotif) => {
    markRead(notif.id);
    if (notif.actionScreen) {
      navigation.navigate(notif.actionScreen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{isRTL ? 'الإشعارات' : 'Notifications'}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>{isRTL ? 'قراءة الكل' : 'Mark all'}</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 56 }} />}
      </LinearGradient>

      <FlatList
        data={notifs}
        keyExtractor={n => n.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconInfo = TYPE_ICON[item.type] || TYPE_ICON.system;
          return (
            <TouchableOpacity
              style={[styles.card, !item.isRead && styles.cardUnread]}
              onPress={() => handlePress(item)}
              activeOpacity={0.85}
            >
              {!item.isRead && <View style={styles.unreadDot} />}
              <View style={[styles.iconWrap, { backgroundColor: iconInfo.color + '20' }]}>
                <Ionicons name={iconInfo.icon as any} size={22} color={iconInfo.color} />
              </View>
              <View style={[styles.body, isRTL && styles.rtlBody]}>
                <Text style={[styles.title, isRTL && styles.rtlText]}>
                  {language === 'ar' ? item.titleAr : item.titleEn}
                </Text>
                <Text style={[styles.msg, isRTL && styles.rtlText]} numberOfLines={2}>
                  {language === 'ar' ? item.bodyAr : item.bodyEn}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              {item.actionScreen && (
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        }}
      />
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
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  unreadBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  unreadCount: { fontSize: 12, fontWeight: '700', color: Colors.textWhite },
  markAllText: { fontSize: 12, color: Colors.secondary, fontWeight: '600' },

  list: { padding: Spacing.base, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadow.sm,
  },
  cardUnread: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryUltraLight },
  unreadDot: { position: 'absolute', top: 14, left: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 },
  body: { flex: 1 },
  rtlBody: { alignItems: 'flex-end' },
  title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  msg: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 6 },
  time: { fontSize: 11, color: Colors.textMuted },
  rtlText: { textAlign: 'right' },
});

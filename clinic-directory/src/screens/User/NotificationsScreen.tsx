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

interface Notification {
  id: string;
  type: 'appointment' | 'reminder' | 'promo' | 'system';
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'appointment', isRead: false, time: '10 دقائق',
    titleAr: 'موعدك غداً', titleEn: 'Appointment Tomorrow',
    bodyAr: 'لديك موعد مع د. أحمد الكردي غداً الساعة 10:00 صباحاً', bodyEn: 'You have an appointment with Dr. Ahmad Al-Kurdi tomorrow at 10:00 AM',
  },
  {
    id: '2', type: 'reminder', isRead: false, time: '2 ساعة',
    titleAr: 'تذكير بالموعد', titleEn: 'Appointment Reminder',
    bodyAr: 'لا تنسَ موعدك مع د. ريم الأحمد يوم الجمعة', bodyEn: 'Don\'t forget your appointment with Dr. Reem Al-Ahmad on Friday',
  },
  {
    id: '3', type: 'promo', isRead: true, time: 'أمس',
    titleAr: 'خصم خاص', titleEn: 'Special Offer',
    bodyAr: 'احصل على خصم 20% على أول حجز مع الأطباء المميزين', bodyEn: 'Get 20% off your first booking with premium doctors',
  },
  {
    id: '4', type: 'appointment', isRead: true, time: 'أمس',
    titleAr: 'تم تأكيد موعدك', titleEn: 'Appointment Confirmed',
    bodyAr: 'تم تأكيد موعدك مع د. أحمد الكردي في 15 يناير', bodyEn: 'Your appointment with Dr. Ahmad Al-Kurdi on Jan 15 is confirmed',
  },
  {
    id: '5', type: 'system', isRead: true, time: '3 أيام',
    titleAr: 'مرحباً بك في دليل العيادات', titleEn: 'Welcome to Clinic Directory',
    bodyAr: 'أهلاً! يمكنك الآن البحث عن الأطباء وحجز المواعيد بسهولة', bodyEn: 'Welcome! You can now find doctors and book appointments easily',
  },
];

const TYPE_ICON: Record<string, string> = {
  appointment: 'calendar',
  reminder: 'alarm',
  promo: 'gift',
  system: 'information-circle',
};

const TYPE_COLOR: Record<string, string> = {
  appointment: Colors.primary,
  reminder: Colors.warning,
  promo: Colors.secondary,
  system: Colors.info,
};

export default function NotificationsScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
        ) : (
          <View style={{ width: 56 }} />
        )}
      </LinearGradient>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={52} color={Colors.border} />
            <Text style={styles.emptyText}>{isRTL ? 'لا توجد إشعارات' : 'No notifications'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
            onPress={() => markRead(item.id)}
            activeOpacity={0.85}
          >
            {!item.isRead && <View style={styles.unreadDot} />}
            <View style={[styles.iconWrap, { backgroundColor: TYPE_COLOR[item.type] + '20' }]}>
              <Ionicons name={TYPE_ICON[item.type] as any} size={22} color={TYPE_COLOR[item.type]} />
            </View>
            <View style={[styles.notifBody, isRTL && styles.rtlBody]}>
              <Text style={[styles.notifTitle, isRTL && styles.rtlText]}>
                {language === 'ar' ? item.titleAr : item.titleEn}
              </Text>
              <Text style={[styles.notifMsg, isRTL && styles.rtlText]} numberOfLines={2}>
                {language === 'ar' ? item.bodyAr : item.bodyEn}
              </Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
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
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: { fontSize: 12, fontWeight: '700', color: Colors.textWhite },
  markAllText: { fontSize: 12, color: Colors.secondary, fontWeight: '600' },

  list: { padding: Spacing.base, paddingBottom: 40 },
  notifCard: {
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
  notifCardUnread: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primaryUltraLight,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  rtlBody: { alignItems: 'flex-end' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  notifMsg: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 6 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
  rtlText: { textAlign: 'right' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 12 },
});

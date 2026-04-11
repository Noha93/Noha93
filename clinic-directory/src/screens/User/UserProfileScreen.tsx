import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

interface MenuItem {
  icon: string;
  labelAr: string;
  labelEn: string;
  color: string;
  onPress: () => void;
  badge?: string;
}

export default function UserProfileScreen() {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: isRTL ? 'حسابي' : 'My Account',
      items: [
        {
          icon: 'calendar-outline', labelAr: 'مواعيدي', labelEn: 'My Appointments',
          color: Colors.primary, onPress: () => navigation.navigate('MyAppointments'), badge: '2',
        },
        {
          icon: 'heart-outline', labelAr: 'الأطباء المفضلون', labelEn: 'Favorite Doctors',
          color: Colors.error, onPress: () => {},
        },
        {
          icon: 'star-outline', labelAr: 'تقييماتي', labelEn: 'My Reviews',
          color: Colors.warning, onPress: () => {},
        },
      ],
    },
    {
      title: isRTL ? 'الإعدادات' : 'Settings',
      items: [
        {
          icon: 'notifications-outline', labelAr: 'الإشعارات', labelEn: 'Notifications',
          color: Colors.info, onPress: () => {},
        },
        {
          icon: 'language-outline', labelAr: 'اللغة', labelEn: 'Language',
          color: Colors.secondary,
          onPress: () => Alert.alert(
            isRTL ? 'تغيير اللغة' : 'Change Language',
            '',
            [
              { text: 'العربية', onPress: () => setLanguage('ar') },
              { text: 'English', onPress: () => setLanguage('en') },
              { text: t('common.cancel'), style: 'cancel' },
            ]
          ),
        },
      ],
    },
    {
      title: isRTL ? 'المساعدة' : 'Help',
      items: [
        {
          icon: 'help-circle-outline', labelAr: 'المساعدة والدعم', labelEn: 'Help & Support',
          color: Colors.success, onPress: () => {},
        },
        {
          icon: 'information-circle-outline', labelAr: 'عن التطبيق', labelEn: 'About App',
          color: Colors.textMuted, onPress: () => {},
        },
        {
          icon: 'shield-outline', labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy',
          color: Colors.textMuted, onPress: () => {},
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <View style={styles.decorCircle} />

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user ? (language === 'ar' ? user.nameAr[0] : user.nameEn[0]) : 'U'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user ? (language === 'ar' ? user.nameAr : user.nameEn) : (isRTL ? 'زائر' : 'Guest')}
          </Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <Text style={styles.userPhone}>{user?.phone || ''}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>{isRTL ? 'مواعيد' : 'Appts'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>{isRTL ? 'مفضلون' : 'Favorites'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>{isRTL ? 'تقييمات' : 'Reviews'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Groups */}
        {menuGroups.map((group, gi) => (
          <View key={gi} style={styles.menuGroup}>
            <Text style={[styles.groupTitle, isRTL && styles.rtlText]}>{group.title}</Text>
            <View style={styles.menuCard}>
              {group.items.map((item, ii) => (
                <React.Fragment key={ii}>
                  <TouchableOpacity
                    style={[styles.menuItem, isRTL && styles.rtlRow]}
                    onPress={item.onPress}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text style={[styles.menuLabel, isRTL && styles.rtlText]}>
                      {language === 'ar' ? item.labelAr : item.labelEn}
                    </Text>
                    <View style={styles.menuRight}>
                      {item.badge && (
                        <View style={styles.badgeCount}>
                          <Text style={styles.badgeCountText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={16}
                        color={Colors.textMuted}
                      />
                    </View>
                  </TouchableOpacity>
                  {ii < group.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.textWhite },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textWhite, marginBottom: 2 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  userPhone: { fontSize: 13, color: Colors.secondary, marginBottom: 16 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  stat: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '800', color: Colors.textWhite },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  menuGroup: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  groupTitle: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  rtlText: { textAlign: 'right' },
  menuCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
  },
  rtlRow: { flexDirection: 'row-reverse' },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 62 },
  badgeCount: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginRight: 6,
  },
  badgeCountText: { color: Colors.textWhite, fontSize: 11, fontWeight: '700' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.error + '50',
    backgroundColor: Colors.errorLight,
  },
  logoutText: { fontSize: 15, color: Colors.error, fontWeight: '700', marginLeft: 8 },
});

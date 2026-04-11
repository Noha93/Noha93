import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

export default function DoctorSettingsScreen() {
  const { isRTL, language, setLanguage } = useLanguage();
  const { doctor, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [notifBookings, setNotifBookings] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifReviews, setNotifReviews] = useState(false);
  const [notifPromo, setNotifPromo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      isRTL ? 'تسجيل الخروج' : 'Logout',
      isRTL ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to logout?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isRTL ? 'تسجيل الخروج' : 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleChangeLanguage = () => {
    Alert.alert(
      isRTL ? 'اختر اللغة' : 'Select Language',
      '',
      [
        { text: 'العربية', onPress: () => setLanguage('ar') },
        { text: 'English', onPress: () => setLanguage('en') },
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderSwitch = (value: boolean, onChange: (v: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: Colors.border, true: Colors.success + '80' }}
      thumbColor={value ? Colors.success : Colors.textMuted}
    />
  );

  const renderItem = (
    icon: string,
    iconColor: string,
    labelAr: string,
    labelEn: string,
    rightNode: React.ReactNode,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={[styles.settingRow, isRTL && styles.rtlRow]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={[styles.settingLabel, isRTL && styles.rtlText]}>
        {language === 'ar' ? labelAr : labelEn}
      </Text>
      <View style={styles.settingRight}>{rightNode}</View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'الإعدادات' : 'Settings'}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Account */}
        <Text style={[styles.groupTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'الحساب' : 'Account'}
        </Text>
        <View style={styles.card}>
          {renderItem('person-outline', Colors.primary, 'معلومات الحساب', 'Account Info', (
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
          ), () => navigation.navigate('ProfileEdit'))}
          <View style={styles.divider} />
          {renderItem('language-outline', Colors.secondary, 'اللغة', 'Language', (
            <Text style={styles.settingValue}>{language === 'ar' ? 'العربية' : 'English'}</Text>
          ), handleChangeLanguage)}
          <View style={styles.divider} />
          {renderItem('shield-outline', Colors.info, 'الخصوصية والأمان', 'Privacy & Security', (
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
          ))}
          <View style={styles.divider} />
          {renderItem('lock-closed-outline', Colors.warning, 'تغيير كلمة المرور', 'Change Password', (
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
          ))}
        </View>

        {/* Notifications */}
        <Text style={[styles.groupTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'الإشعارات' : 'Notifications'}
        </Text>
        <View style={styles.card}>
          {renderItem('calendar-outline', Colors.primary, 'الحجوزات الجديدة', 'New Bookings',
            renderSwitch(notifBookings, setNotifBookings))}
          <View style={styles.divider} />
          {renderItem('alarm-outline', Colors.warning, 'تذكير المواعيد', 'Appointment Reminders',
            renderSwitch(notifReminders, setNotifReminders))}
          <View style={styles.divider} />
          {renderItem('star-outline', Colors.secondary, 'التقييمات الجديدة', 'New Reviews',
            renderSwitch(notifReviews, setNotifReviews))}
          <View style={styles.divider} />
          {renderItem('megaphone-outline', Colors.info, 'العروض والتحديثات', 'Offers & Updates',
            renderSwitch(notifPromo, setNotifPromo))}
        </View>

        {/* Appearance */}
        <Text style={[styles.groupTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'المظهر' : 'Appearance'}
        </Text>
        <View style={styles.card}>
          {renderItem('moon-outline', Colors.textPrimary, 'الوضع الداكن', 'Dark Mode',
            renderSwitch(darkMode, setDarkMode))}
        </View>

        {/* Support */}
        <Text style={[styles.groupTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'الدعم' : 'Support'}
        </Text>
        <View style={styles.card}>
          {renderItem('help-circle-outline', Colors.success, 'المساعدة والدعم', 'Help & Support', (
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
          ))}
          <View style={styles.divider} />
          {renderItem('information-circle-outline', Colors.textMuted, 'عن التطبيق', 'About App', (
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={Colors.textMuted} />
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{isRTL ? 'تسجيل الخروج' : 'Logout'}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0 (100)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
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
  content: { padding: Spacing.xl },
  rtlText: { textAlign: 'right' },

  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
  },
  rtlRow: { flexDirection: 'row-reverse' },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center' },
  settingValue: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginRight: 6 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 62 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.error + '50',
    backgroundColor: Colors.errorLight,
  },
  logoutText: { fontSize: 15, color: Colors.error, fontWeight: '700', marginLeft: 8 },

  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: 16 },
});

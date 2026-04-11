import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Language'>;
};

export default function LanguageScreen({ navigation }: Props) {
  const { setLanguage } = useLanguage();
  const arScale = useRef(new Animated.Value(1)).current;
  const enScale = useRef(new Animated.Value(1)).current;

  const selectLanguage = async (lang: 'ar' | 'en') => {
    await setLanguage(lang);
    navigation.replace('Onboarding');
  };

  const animatePress = (anim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(callback);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Logo */}
        <View style={styles.logoBox}>
          <View style={styles.crossV} />
          <View style={styles.crossH} />
        </View>

        <Text style={styles.welcomeAr}>مرحباً بك</Text>
        <Text style={styles.welcomeEn}>Welcome</Text>
        <Text style={styles.subtitle}>Choose your preferred language</Text>
        <Text style={styles.subtitleAr}>اختر لغتك المفضلة</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.promptText}>Select Language / اختر اللغة</Text>

        {/* Arabic Option */}
        <Animated.View style={{ transform: [{ scale: arScale }] }}>
          <TouchableOpacity
            style={styles.langCard}
            onPress={() => animatePress(arScale, () => selectLanguage('ar'))}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primaryUltraLight, Colors.backgroundWhite]}
              style={styles.langCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.langLeft}>
                <Text style={styles.flagEmoji}>🇦🇪</Text>
                <View>
                  <Text style={styles.langNamePrimary}>العربية</Text>
                  <Text style={styles.langNameSecondary}>Arabic</Text>
                </View>
              </View>
              <View style={styles.langRight}>
                <View style={styles.checkCircle}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR / أو</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* English Option */}
        <Animated.View style={{ transform: [{ scale: enScale }] }}>
          <TouchableOpacity
            style={styles.langCard}
            onPress={() => animatePress(enScale, () => selectLanguage('en'))}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.secondaryUltraLight, Colors.backgroundWhite]}
              style={styles.langCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.langLeft}>
                <Text style={styles.flagEmoji}>🇬🇧</Text>
                <View>
                  <Text style={styles.langNamePrimary}>English</Text>
                  <Text style={styles.langNameSecondary}>الإنجليزية</Text>
                </View>
              </View>
              <View style={styles.langRight}>
                <View style={[styles.checkCircle, { borderColor: Colors.secondary }]}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.secondary} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footNote}>
          يمكنك تغيير اللغة لاحقاً من الإعدادات
          {'\n'}You can change the language later in settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  crossV: {
    position: 'absolute',
    width: 10,
    height: 36,
    backgroundColor: Colors.primaryDark,
    borderRadius: 5,
  },
  crossH: {
    position: 'absolute',
    width: 36,
    height: 10,
    backgroundColor: Colors.primaryDark,
    borderRadius: 5,
  },
  welcomeAr: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  welcomeEn: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  subtitleAr: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    paddingTop: 32,
  },
  promptText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  langCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  langCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 36,
    marginRight: Spacing.md,
  },
  langNamePrimary: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  langNameSecondary: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langRight: {},
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  footNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
});

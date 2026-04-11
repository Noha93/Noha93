import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography, FontSize } from '../../constants/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const ONBOARDING_DONE_KEY = '@clinic_onboarding_done';

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const crossRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(crossRotation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the cross
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Navigate after delay
    const timer = setTimeout(async () => {
      const done = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
      if (done === 'true') {
        navigation.replace('AuthSelection');
      } else {
        navigation.replace('Language');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const crossSpin = crossRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          {/* Medical Cross Icon */}
          <Animated.View
            style={[styles.crossContainer, { transform: [{ rotate: crossSpin }, { scale: pulseAnim }] }]}
          >
            <View style={styles.crossV} />
            <View style={styles.crossH} />
          </Animated.View>

          {/* Outer ring */}
          <View style={styles.logoRing} />
        </Animated.View>

        {/* App Name */}
        <Animated.View style={{ opacity: logoOpacity }}>
          <Text style={styles.appNameAr}>دليل العيادات</Text>
          <Text style={styles.appNameEn}>Clinic Directory</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>صحتك في يدك</Text>
          <View style={styles.taglineLine} />
        </Animated.View>

        {/* Bottom Decoration */}
        <View style={styles.bottomContainer}>
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { opacity: taglineOpacity, backgroundColor: i === 1 ? Colors.secondary : 'rgba(255,255,255,0.4)' },
                ]}
              />
            ))}
          </View>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        {/* Gold Accent at Bottom */}
        <LinearGradient
          colors={['transparent', Colors.secondary + '40']}
          style={styles.bottomGold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Decorative elements
  circle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
  },
  circle3: {
    position: 'absolute',
    top: 150,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  // Logo
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  crossContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    zIndex: 2,
  },
  crossV: {
    position: 'absolute',
    width: 14,
    height: 50,
    backgroundColor: Colors.primaryDark,
    borderRadius: 7,
  },
  crossH: {
    position: 'absolute',
    width: 50,
    height: 14,
    backgroundColor: Colors.primaryDark,
    borderRadius: 7,
  },
  logoRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(201, 168, 76, 0.4)',
  },

  // App Name
  appNameAr: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
    letterSpacing: 1,
  },
  appNameEn: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },

  // Tagline
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  taglineLine: {
    width: 40,
    height: 1,
    backgroundColor: Colors.secondary,
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.secondary,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Bottom
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  version: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  bottomGold: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});

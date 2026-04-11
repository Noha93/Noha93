import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');
const ONBOARDING_DONE_KEY = '@clinic_onboarding_done';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  titleKey: string;
  descKey: string;
  gradientColors: string[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'search-circle',
    iconBg: Colors.primary,
    titleKey: 'onboarding.slide1Title',
    descKey: 'onboarding.slide1Desc',
    gradientColors: [Colors.primaryDark, Colors.primary],
  },
  {
    id: '2',
    icon: 'calendar-outline',
    iconBg: Colors.secondary,
    titleKey: 'onboarding.slide2Title',
    descKey: 'onboarding.slide2Desc',
    gradientColors: [Colors.primaryDark, '#1a6b9e'],
  },
  {
    id: '3',
    icon: 'location',
    iconBg: Colors.success,
    titleKey: 'onboarding.slide3Title',
    descKey: 'onboarding.slide3Desc',
    gradientColors: [Colors.primaryDark, '#155b7a'],
  },
  {
    id: '4',
    icon: 'star',
    iconBg: Colors.warning,
    titleKey: 'onboarding.slide4Title',
    descKey: 'onboarding.slide4Desc',
    gradientColors: [Colors.primaryDark, Colors.primary],
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { t, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    navigation.replace('AuthSelection');
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    navigation.replace('AuthSelection');
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={e => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [40, 0, 40],
            extrapolate: 'clamp',
          });

          return (
            <LinearGradient
              colors={item.gradientColors as [string, string]}
              style={styles.slide}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Decorative circles */}
              <View style={styles.decor1} />
              <View style={styles.decor2} />

              <Animated.View style={[styles.slideContent, { opacity, transform: [{ translateY }] }]}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={72} color={Colors.textWhite} />
                </View>

                {/* Text */}
                <Text style={[styles.slideTitle, isRTL && styles.rtlText]}>
                  {t(item.titleKey)}
                </Text>
                <Text style={[styles.slideDesc, isRTL && styles.rtlText]}>
                  {t(item.descKey)}
                </Text>
              </Animated.View>
            </LinearGradient>
          );
        }}
      />

      {/* Bottom Panel */}
      <LinearGradient
        colors={[Colors.primaryDark, '#0a1f38']}
        style={styles.bottomPanel}
      >
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: index === currentIndex ? Colors.secondary : Colors.textWhite,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isLastSlide ? (
            <Button
              title={t('onboarding.getStarted')}
              onPress={handleGetStarted}
              variant="gold"
              size="lg"
              fullWidth
            />
          ) : (
            <View style={styles.nextRow}>
              <TouchableOpacity onPress={handleSkip} style={styles.skipBtnBottom}>
                <Text style={styles.skipBtnText}>{t('onboarding.skip')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>{t('common.next')}</Text>
                <Ionicons
                  name={isRTL ? 'arrow-back' : 'arrow-forward'}
                  size={20}
                  color={Colors.textWhite}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
  },
  skipText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '500',
  },
  slide: {
    width,
    height: height * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decor2: {
    position: 'absolute',
    bottom: 20,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    opacity: 0.9,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  slideDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },
  rtlText: {
    textAlign: 'right',
  },
  bottomPanel: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actions: {
    width: '100%',
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtnBottom: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  skipBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
  },
  nextBtnText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});

import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import type { ColorValue } from 'react-native';
import { AppIcon, type IconName } from '../../src/components/AppIcon';
import { fontForWeight, glow, radius } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale } from '../../src/context/LocaleContext';

function TabIcon({ icon, color }: { icon: IconName; color: ColorValue }) {
  return <AppIcon name={icon} size={22} color={color as string} />;
}

function SosTabButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.sosWrap} pointerEvents="box-none">
      <Pressable
        onPress={() => router.push('/sos')}
        style={[styles.sosButton, { backgroundColor: colors.primary, borderColor: colors.bg }, glow(colors.primary, 0.45, 18)]}
      >
        <AppIcon name="warning-outline" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { locale, t, dir } = useLocale();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fontForWeight('bodyMedium', locale), fontSize: 10 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, direction: dir === 'rtl' ? 'rtl' : 'ltr' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <TabIcon icon="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: t('nav.nearby'),
          tabBarIcon: ({ color }) => <TabIcon icon="location-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos-launcher"
        options={{
          title: t('nav.sos'),
          tabBarIcon: () => <SosTabButton />,
          tabBarLabelStyle: { fontFamily: fontForWeight('bodyBold', locale), fontSize: 10, color: colors.primary },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: t('nav.firstAid'),
          tabBarIcon: ({ color }) => <TabIcon icon="medkit-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="medical"
        options={{
          title: t('nav.medical'),
          tabBarIcon: ({ color }) => <TabIcon icon="pulse-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosWrap: {
    position: 'absolute',
    top: -22,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    alignSelf: 'center',
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

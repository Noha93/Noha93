import React from 'react';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { AppIcon, type IconName } from '../../src/components/AppIcon';
import { fontForWeight } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';
import { useLocale } from '../../src/context/LocaleContext';

function TabIcon({ icon, color }: { icon: IconName; color: ColorValue }) {
  return <AppIcon name={icon} size={20} color={color as string} />;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { locale, t } = useLocale();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fontForWeight('bodyMedium', locale), fontSize: 10.5 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <TabIcon icon="home-variant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('nav.map'),
          tabBarIcon: ({ color }) => <TabIcon icon="map-marker-radius" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('nav.history'),
          tabBarIcon: ({ color }) => <TabIcon icon="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => <TabIcon icon="cog-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

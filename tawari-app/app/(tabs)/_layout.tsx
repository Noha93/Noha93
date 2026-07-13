import React from 'react';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { AppIcon, type IconName } from '../../src/components/AppIcon';
import { fonts } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';

function TabIcon({ icon, color }: { icon: IconName; color: ColorValue }) {
  return <AppIcon name={icon} size={20} color={color as string} />;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 10.5 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <TabIcon icon="home-variant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'الخريطة',
          tabBarIcon: ({ color }) => <TabIcon icon="map-marker-radius" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'السجل',
          tabBarIcon: ({ color }) => <TabIcon icon="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color }) => <TabIcon icon="cog-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

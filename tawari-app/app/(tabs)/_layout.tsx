import React from 'react';
import { Tabs } from 'expo-router';
import { AppText } from '../../src/components/AppText';
import { colors } from '../../src/constants/theme';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <AppText style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>{icon}</AppText>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: 'Tajawal_500Medium', fontSize: 10.5 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'الخريطة',
          tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'السجل',
          tabBarIcon: ({ focused }) => <TabIcon icon="🕓" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

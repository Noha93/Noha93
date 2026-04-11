import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../constants/colors';
import { DoctorTabParamList, DoctorStackParamList } from '../types';

// Doctor Screens
import DashboardScreen from '../screens/Doctor/DashboardScreen';
import AppointmentsScreen from '../screens/Doctor/AppointmentsScreen';
import ProfileEditScreen from '../screens/Doctor/ProfileEditScreen';
import DocumentsScreen from '../screens/Doctor/DocumentsScreen';
import SubscriptionScreen from '../screens/Doctor/SubscriptionScreen';
import AdvertisementScreen from '../screens/Doctor/AdvertisementScreen';
import WeeklyScheduleScreen from '../screens/Doctor/WeeklyScheduleScreen';
import ClinicPhotosScreen from '../screens/Doctor/ClinicPhotosScreen';
import DoctorAppointmentDetailScreen from '../screens/Doctor/DoctorAppointmentDetailScreen';
import EarningsScreen from '../screens/Doctor/EarningsScreen';
import DoctorNotificationsScreen from '../screens/Doctor/DoctorNotificationsScreen';
import PatientProfileScreen from '../screens/Doctor/PatientProfileScreen';
import DoctorSettingsScreen from '../screens/Doctor/DoctorSettingsScreen';
import ProfilePreviewScreen from '../screens/Doctor/ProfilePreviewScreen';

const Tab = createBottomTabNavigator<DoctorTabParamList>();
const Stack = createNativeStackNavigator<DoctorStackParamList>();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AppointmentDetail" component={DoctorAppointmentDetailScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="DoctorNotifications" component={DoctorNotificationsScreen} />
      <Stack.Screen name="PatientProfile" component={PatientProfileScreen} />
    </Stack.Navigator>
  );
}

function AppointmentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="AppointmentDetail" component={DoctorAppointmentDetailScreen} />
      <Stack.Screen name="PatientProfile" component={PatientProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="WeeklySchedule" component={WeeklyScheduleScreen} />
      <Stack.Screen name="ClinicPhotos" component={ClinicPhotosScreen} />
      <Stack.Screen name="Advertisement" component={AdvertisementScreen} />
      <Stack.Screen name="ProfilePreview" component={ProfilePreviewScreen} />
      <Stack.Screen name="DoctorSettings" component={DoctorSettingsScreen} />
    </Stack.Navigator>
  );
}

function DocumentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Documents" component={DocumentsScreen} />
    </Stack.Navigator>
  );
}

function SubscriptionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
    </Stack.Navigator>
  );
}

export default function DoctorNavigator() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryDark,
          borderTopColor: 'rgba(201, 168, 76, 0.3)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
          elevation: 20,
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: t('nav.dashboard'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStack}
        options={{
          tabBarLabel: t('nav.appointments'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('nav.profile'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsStack}
        options={{
          tabBarLabel: t('nav.documents'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionStack}
        options={{
          tabBarLabel: t('nav.subscription'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'star' : 'star-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

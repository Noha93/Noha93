import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../constants/colors';
import { UserTabParamList, UserStackParamList } from '../types';

// Screens
import HomeScreen from '../screens/User/HomeScreen';
import SearchScreen from '../screens/User/SearchScreen';
import NearbyScreen from '../screens/User/NearbyScreen';
import HospitalsScreen from '../screens/User/HospitalsScreen';
import UserProfileScreen from '../screens/User/UserProfileScreen';
import DoctorDetailScreen from '../screens/User/DoctorDetailScreen';
import BookingScreen from '../screens/User/BookingScreen';
import HospitalDetailScreen from '../screens/User/HospitalDetailScreen';
import ReviewsScreen from '../screens/User/ReviewsScreen';
import MyAppointmentsScreen from '../screens/User/MyAppointmentsScreen';

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createNativeStackNavigator<UserStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

function NearbyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Nearby" component={NearbyScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
    </Stack.Navigator>
  );
}

function HospitalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Hospitals" component={HospitalsScreen} />
      <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  const { t, isRTL } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBackground,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
          elevation: 20,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: t('nav.search'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyStack}
        options={{
          tabBarLabel: t('nav.nearby'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Hospitals"
        component={HospitalsStack}
        options={{
          tabBarLabel: t('nav.hospitals'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarLabel: t('nav.profile'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

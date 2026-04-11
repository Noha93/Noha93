import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

// Screens
import SplashScreen from '../screens/Onboarding/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LanguageScreen from '../screens/Onboarding/LanguageScreen';
import AuthSelectionScreen from '../screens/Auth/AuthSelectionScreen';
import UserLoginScreen from '../screens/Auth/UserLoginScreen';
import DoctorLoginScreen from '../screens/Auth/DoctorLoginScreen';
import UserRegisterScreen from '../screens/Auth/UserRegisterScreen';
import DoctorRegisterScreen from '../screens/Auth/DoctorRegisterScreen';
import UserNavigator from './UserNavigator';
import DoctorNavigator from './DoctorNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show splash while loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="AuthSelection" component={AuthSelectionScreen} />
            <Stack.Screen name="UserLogin" component={UserLoginScreen} />
            <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
            <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
            <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
          </>
        ) : role === 'user' ? (
          <Stack.Screen name="UserApp" component={UserNavigator} />
        ) : (
          <Stack.Screen name="DoctorApp" component={DoctorNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

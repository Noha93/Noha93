import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager, LogBox } from 'react-native';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress known warnings in development
LogBox.ignoreLogs([
  'Warning: ReactDOM.render is no longer supported',
  'Non-serializable values were found',
  'VirtualizedLists should never be nested',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

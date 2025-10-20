import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/theme';

import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import BusinessNavigator from './BusinessNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Loading durumu
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Kullanıcı giriş yapmamışsa Auth ekranları
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userRole === 'customer' ? (
          // Müşteri rolü
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        ) : (
          // İşletme rolü
          <Stack.Screen name="Business" component={BusinessNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

import DashboardScreen from '../screens/business/DashboardScreen';
import AppointmentManageScreen from '../screens/business/AppointmentManageScreen';
import AvailabilityScreen from '../screens/business/AvailabilityScreen';
import BusinessProfileScreen from '../screens/business/BusinessProfileScreen';

const Tab = createBottomTabNavigator();

export default function BusinessNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'AppointmentManage') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Availability') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'BusinessProfile') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Panel' }}
      />
      <Tab.Screen
        name="AppointmentManage"
        component={AppointmentManageScreen}
        options={{ tabBarLabel: 'Randevular' }}
      />
      <Tab.Screen
        name="Availability"
        component={AvailabilityScreen}
        options={{ tabBarLabel: 'Müsaitlik' }}
      />
      <Tab.Screen
        name="BusinessProfile"
        component={BusinessProfileScreen}
        options={{ tabBarLabel: 'İşletme' }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from './lib/store';

import { LoginScreen, SignupScreen } from './screens/AuthScreens';
import { ListingsScreen, CreateListingScreen } from './screens/ListingsScreens';
import { DuesStatusScreen, PaymentOptionsScreen, PaymentHistoryScreen, SetupRecurringScreen } from './screens/DuesScreens';
import { MessagesScreen } from './screens/MessagesScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60
        }
      }}
    >
      <Tab.Screen
        name="Listings"
        component={ListingsStack}
        options={{ tabBarLabel: 'Listings', tabBarIcon: () => <>📦</> }}
      />
      <Tab.Screen
        name="Dues"
        component={DuesStack}
        options={{ tabBarLabel: 'Dues', tabBarIcon: () => <>💳</> }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: 'Messages', tabBarIcon: () => <>💬</> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: () => <>👤</> }}
      />
    </Tab.Navigator>
  );
};

const ListingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListingsHome" component={ListingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateListing" component={CreateListingScreen} />
    </Stack.Navigator>
  );
};

const DuesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DuesStatus" component={DuesStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentOptions" component={PaymentOptionsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="SetupRecurring" component={SetupRecurringScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

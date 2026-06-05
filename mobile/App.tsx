import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { colors } from './src/theme';
import { t } from './src/i18n';

import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import AccountScreen from './src/screens/AccountScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SearchScreen from './src/screens/SearchScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
}

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: { backgroundColor: colors.light.surface, borderTopColor: colors.light.border, height: 60, paddingBottom: 8, paddingTop: 8 },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.light.textTertiary,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      headerShown: false,
    }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: t('home'), tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ tabBarLabel: t('search'), tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} /> }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ tabBarLabel: t('cart'), tabBarIcon: ({ focused }) => <TabIcon icon="🛒" focused={focused} /> }} />
      <Tab.Screen name="WishlistTab" component={WishlistScreen} options={{ tabBarLabel: t('wishlist'), tabBarIcon: ({ focused }) => <TabIcon icon="❤️" focused={focused} /> }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ tabBarLabel: t('account'), tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: colors.light.surface },
          headerTintColor: colors.light.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
        }}>
          <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Products" component={ProductsScreen} options={{ title: t('products') }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('register') }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: t('checkout') }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: t('myOrders') }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

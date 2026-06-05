import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

export default function AccountScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={s.container}>
        <View style={s.empty}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>👤</Text>
          <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={s.loginBtnText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const items = [
    { icon: '📦', label: t('myOrders'), screen: 'Orders' },
    { icon: '❤️', label: t('wishlist'), screen: 'Wishlist' },
    { icon: '⚙️', label: t('settings'), screen: 'Settings' },
  ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.name}>{user.name?.[locale]}</Text>
        <Text style={s.email}>{user.email}</Text>
      </View>
      {items.map(item => (
        <TouchableOpacity key={item.label} style={s.menuItem}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
          <Text style={s.menuText}>{item.label}</Text>
          <Text style={{ color: colors.light.textTertiary }}>›</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loginBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: radius.full },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  header: { padding: spacing.xl, backgroundColor: colors.primary, paddingTop: 60 },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderBottomWidth: 1, borderColor: colors.light.border },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.light.text },
  logoutBtn: { margin: spacing.xl, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.error, alignItems: 'center' },
  logoutText: { color: colors.error, fontWeight: '600' },
});

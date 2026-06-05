import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';

export default function CartScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  return (
    <View style={s.container}>
      <View style={s.empty}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>🛒</Text>
        <Text style={s.emptyText}>{t('cartEmpty')}</Text>
        <TouchableOpacity style={s.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={s.shopBtnText}>{t('shopNow')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { fontSize: 16, color: colors.light.textSecondary, marginBottom: spacing.xl },
  shopBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: radius.full },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

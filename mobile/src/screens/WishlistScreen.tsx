import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function WishlistScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (token) api.get<any>('/wishlist').then(w => setItems(w.products || [])).catch(() => {});
  }, [token]);

  const removeItem = async (productId: string) => {
    await api.delete(`/wishlist/${productId}`);
    setItems(prev => prev.filter(p => p._id !== productId));
  };

  if (items.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>❤️</Text>
        <Text style={s.emptyText}>{locale === 'ar' ? 'المفضلة فارغة' : 'Wishlist is empty'}</Text>
      </View>
    );
  }

  return (
    <FlatList style={s.container} data={items} keyExtractor={item => item._id}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
          <View style={s.image}><Text style={{ fontSize: 32, color: colors.light.textTertiary }}>📷</Text></View>
          <View style={s.info}>
            <Text style={s.name}>{item.name?.[locale]}</Text>
            <Text style={s.price}>{item.price?.YER?.toLocaleString()} ﷼</Text>
          </View>
          <TouchableOpacity style={s.removeBtn} onPress={() => removeItem(item._id)}>
            <Text style={{ color: colors.error, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.background },
  emptyText: { fontSize: 16, color: colors.light.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden' },
  image: { width: 80, height: 80, backgroundColor: colors.light.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: spacing.md },
  name: { fontSize: 14, fontWeight: '600', color: colors.light.text, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
  removeBtn: { padding: spacing.md },
});

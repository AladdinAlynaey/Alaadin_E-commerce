import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import api from '../lib/api';

const { width } = Dimensions.get('window');

export default function ProductsScreen({ navigation, route }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const locale = isRTL() ? 'ar' : 'en';

  useEffect(() => {
    api.get<any>('/products?limit=20').then(r => setProducts(r.data || []))
      .catch(() => {
        setProducts(Array.from({ length: 8 }, (_, i) => ({
          _id: `p-${i}`, name: { ar: `منتج ${i+1}`, en: `Product ${i+1}` },
          price: { YER: (i+1)*3500 }, ratings: { average: 4, count: 5+i },
        })));
      });
  }, []);

  return (
    <View style={s.container}>
      <FlatList data={products} numColumns={2} columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
            <View style={s.image}>
              <Text style={{ color: colors.light.textTertiary, fontSize: 32 }}>📷</Text>
            </View>
            <View style={s.info}>
              <Text style={s.name} numberOfLines={2}>{item.name?.[locale]}</Text>
              <Text style={s.rating}>{'★'.repeat(Math.round(item.ratings?.average || 0))}</Text>
              <Text style={s.price}>{item.price?.YER?.toLocaleString()} ﷼</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  card: {
    flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden',
  },
  image: { height: 180, backgroundColor: colors.light.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  info: { padding: spacing.md },
  name: { fontSize: 13, fontWeight: '600', color: colors.light.text, marginBottom: 4 },
  rating: { fontSize: 12, color: colors.accentLight, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
});

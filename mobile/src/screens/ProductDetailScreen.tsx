import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { isRTL } from '../i18n';
import api from '../lib/api';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const locale = isRTL() ? 'ar' : 'en';

  useEffect(() => {
    api.get<any>(`/products/${id}`).then(setProduct).catch(() => {
      setProduct({
        _id: id, name: { ar: 'منتج تجريبي', en: 'Demo Product' },
        description: { ar: 'وصف المنتج التجريبي', en: 'Demo product description' },
        price: { YER: 15000 }, ratings: { average: 4.5, count: 23 },
        variants: [{ size: 'S', stock: 5 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }],
      });
    });
  }, [id]);

  if (!product) return <View style={s.loading}><Text>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</Text></View>;

  const sizes = [...new Set(product.variants?.map((v: any) => v.size).filter(Boolean))];

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.image}>
        <Text style={{ fontSize: 64, color: colors.light.textTertiary }}>📷</Text>
      </View>
      <View style={s.content}>
        <Text style={s.name}>{product.name?.[locale]}</Text>
        <Text style={s.rating}>{'★'.repeat(Math.round(product.ratings?.average))} ({product.ratings?.count})</Text>
        <Text style={s.price}>{product.price?.YER?.toLocaleString()} ﷼</Text>
        <Text style={s.desc}>{product.description?.[locale]}</Text>

        {sizes.length > 0 && (
          <View style={s.section}>
            <Text style={s.label}>{locale === 'ar' ? 'المقاس' : 'Size'}</Text>
            <View style={s.sizes}>
              {(sizes as string[]).map(size => (
                <TouchableOpacity key={size} style={[s.sizeBtn, selectedSize === size && s.sizeActive]} onPress={() => setSelectedSize(size)}>
                  <Text style={[s.sizeText, selectedSize === size && s.sizeTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={s.addBtn}>
          <Text style={s.addBtnText}>{locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { height: 400, backgroundColor: colors.light.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl },
  name: { fontSize: 24, fontWeight: '800', color: colors.light.text, marginBottom: spacing.sm },
  rating: { fontSize: 16, color: colors.accentLight, marginBottom: spacing.sm },
  price: { fontSize: 28, fontWeight: '800', color: colors.primary, marginBottom: spacing.lg },
  desc: { fontSize: 15, color: colors.light.textSecondary, lineHeight: 24, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  label: { fontSize: 14, fontWeight: '600', color: colors.light.text, marginBottom: spacing.sm },
  sizes: { flexDirection: 'row', gap: spacing.sm },
  sizeBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border },
  sizeActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  sizeText: { fontWeight: '600', color: colors.light.textSecondary },
  sizeTextActive: { color: colors.primary },
  addBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.md },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

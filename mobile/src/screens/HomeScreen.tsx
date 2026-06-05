import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Dimensions, I18nManager } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import api from '../lib/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [featured, setFeatured] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const rtl = isRTL();
  const locale = rtl ? 'ar' : 'en';

  useEffect(() => {
    api.get<any[]>('/products/featured?limit=8').then(setFeatured).catch(() => {
      setFeatured(Array.from({length: 4}, (_, i) => ({
        _id: `f-${i}`, name: { ar: `منتج ${i+1}`, en: `Product ${i+1}` },
        price: { YER: (i+1)*5000 }, ratings: { average: 4.5, count: 12 },
      })));
    });
    api.get<any[]>('/products/flash-deals?limit=4').then(setFlashDeals).catch(() => {});
  }, []);

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity style={s.productCard} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
      <View style={s.productImage}>
        <Text style={{ color: colors.light.textTertiary, fontSize: 32 }}>📷</Text>
      </View>
      <View style={s.productInfo}>
        <Text style={s.productName} numberOfLines={2}>{item.name?.[locale]}</Text>
        <Text style={s.productRating}>{'★'.repeat(Math.round(item.ratings?.average || 0))} ({item.ratings?.count || 0})</Text>
        <Text style={s.productPrice}>{item.price?.YER?.toLocaleString()} ﷼</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>{t('heroTitle')}</Text>
        <TouchableOpacity style={s.heroBtn} onPress={() => navigation.navigate('Products')}>
          <Text style={s.heroBtnText}>{t('shopNow')}</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('categories')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {[
            { key: 'men', icon: '👔', label: t('men') },
            { key: 'women', icon: '👗', label: t('women') },
            { key: 'kids', icon: '🧒', label: t('kids') },
            { key: 'new', icon: '✨', label: t('newArrivals') },
          ].map(cat => (
            <TouchableOpacity key={cat.key} style={s.categoryCard} onPress={() => navigation.navigate('Products', { category: cat.key })}>
              <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
              <Text style={s.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t('featured')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products', { featured: true })}>
            <Text style={s.viewAll}>{locale === 'ar' ? 'عرض الكل →' : 'View All →'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={featured} renderItem={renderProductCard} keyExtractor={item => item._id}
          horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }} />
      </View>

      {/* Best Selling */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('bestSelling')}</Text>
        <FlatList data={featured.slice(0, 4)} renderItem={renderProductCard} keyExtractor={item => `best-${item._id}`}
          horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }} />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  hero: {
    padding: spacing.xl, paddingTop: 60, paddingBottom: 40,
    backgroundColor: colors.primary, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl,
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: spacing.lg, lineHeight: 38 },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: radius.full, alignSelf: 'flex-start',
  },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  section: { padding: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.light.text, marginBottom: spacing.md },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  categoryCard: {
    alignItems: 'center', padding: spacing.md, marginRight: spacing.md,
    backgroundColor: colors.light.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.light.border, width: 90,
  },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: colors.light.text, marginTop: spacing.xs },
  productCard: {
    width: (width - 80) / 2, backgroundColor: colors.light.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden',
  },
  productImage: {
    height: 180, backgroundColor: colors.light.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  productInfo: { padding: spacing.md },
  productName: { fontSize: 13, fontWeight: '600', color: colors.light.text, marginBottom: 4 },
  productRating: { fontSize: 12, color: colors.accentLight, marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: '800', color: colors.primary },
});

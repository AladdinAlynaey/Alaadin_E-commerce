import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, radius } from '../../theme';
import { isRTL } from '../../i18n';

const { width } = Dimensions.get('window');

interface Props {
  product: any;
  onPress?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  compact?: boolean;
}

export default function ProductCard({ product, onPress, onAddToCart, onToggleWishlist, isWishlisted, compact }: Props) {
  const locale = isRTL() ? 'ar' : 'en';
  const name = product.name?.[locale] || product.name?.en || '';
  const rating = Math.round(product.ratings?.average || 0);
  const cardWidth = compact ? (width - 60) / 2 : width - 32;

  return (
    <TouchableOpacity style={[s.card, { width: cardWidth }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.image, compact && { height: 140 }]}>
        <Text style={{ fontSize: compact ? 28 : 40, color: colors.light.textTertiary }}>📷</Text>
        {onToggleWishlist && (
          <TouchableOpacity style={s.wishBtn} onPress={onToggleWishlist}>
            <Text style={{ fontSize: 16 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
        {product.isFlashDeal && <View style={s.saleBadge}><Text style={s.saleBadgeText}>SALE</Text></View>}
      </View>
      <View style={s.info}>
        <Text style={s.name} numberOfLines={2}>{name}</Text>
        {rating > 0 && <Text style={s.rating}>{'★'.repeat(rating)}{'☆'.repeat(5-rating)} ({product.ratings?.count})</Text>}
        <View style={s.priceRow}>
          <Text style={s.price}>{product.price?.YER?.toLocaleString()} ﷼</Text>
          {product.compareAtPrice?.YER && <Text style={s.oldPrice}>{product.compareAtPrice.YER.toLocaleString()}</Text>}
        </View>
        {onAddToCart && (
          <TouchableOpacity style={s.cartBtn} onPress={onAddToCart}>
            <Text style={s.cartBtnText}>{locale === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden' },
  image: { height: 200, backgroundColor: colors.light.surfaceSecondary, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  wishBtn: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  saleBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  saleBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: spacing.md },
  name: { fontSize: 13, fontWeight: '600', color: colors.light.text, marginBottom: 4, lineHeight: 18 },
  rating: { fontSize: 12, color: colors.accentLight, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
  oldPrice: { fontSize: 12, color: colors.light.textTertiary, textDecorationLine: 'line-through' },
  cartBtn: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.sm },
  cartBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});

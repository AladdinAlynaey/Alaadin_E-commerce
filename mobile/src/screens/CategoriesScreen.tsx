import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { isRTL } from '../i18n';
import api from '../lib/api';

export default function CategoriesScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/categories').then(setCategories).catch(() => {
      setCategories([
        { _id: '1', name: { ar: 'رجال', en: 'Men' }, icon: '👔' },
        { _id: '2', name: { ar: 'نساء', en: 'Women' }, icon: '👗' },
        { _id: '3', name: { ar: 'أطفال', en: 'Kids' }, icon: '🧒' },
        { _id: '4', name: { ar: 'إكسسوارات', en: 'Accessories' }, icon: '👜' },
        { _id: '5', name: { ar: 'أحذية', en: 'Shoes' }, icon: '👟' },
      ]);
    });
  }, []);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: spacing.md }}>
      {categories.map(cat => (
        <TouchableOpacity key={cat._id} style={s.card} onPress={() => navigation.navigate('Products', { category: cat._id })}>
          <Text style={{ fontSize: 32 }}>{cat.icon || '📁'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{cat.name?.[locale]}</Text>
            <Text style={s.desc}>{cat.description?.[locale] || ''}</Text>
          </View>
          <Text style={{ fontSize: 20, color: colors.light.textTertiary }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.light.border },
  name: { fontSize: 16, fontWeight: '700', color: colors.light.text },
  desc: { fontSize: 13, color: colors.light.textSecondary, marginTop: 2 },
});

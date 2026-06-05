import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { colors, spacing, radius } from '../../theme';
import { isRTL } from '../../i18n';

interface Props { categories: any[]; onSelect: (cat: any) => void; selected?: string; }

export default function CategoryBar({ categories, onSelect, selected }: Props) {
  return (
    <FlatList data={categories} horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity style={[s.chip, selected === item._id && s.chipActive]} onPress={() => onSelect(item)}>
          {item.icon && <Text>{item.icon}</Text>}
          <Text style={[s.chipText, selected === item._id && s.chipTextActive]}>{item.name?.[isRTL() ? 'ar' : 'en']}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.full, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.light.textSecondary },
  chipTextActive: { color: colors.primary },
});

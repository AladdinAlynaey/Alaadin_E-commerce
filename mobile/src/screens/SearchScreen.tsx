import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import api from '../lib/api';

export default function SearchScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); setSearched(false); return; }
    setSearched(true);
    try {
      const data = await api.get<any[]>(`/products/search?q=${encodeURIComponent(q)}&limit=20`);
      setResults(data);
    } catch { setResults([]); }
  };

  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <TextInput style={s.input} placeholder={t('search')} placeholderTextColor={colors.light.textTertiary}
          value={query} onChangeText={handleSearch} autoFocus />
      </View>
      {searched && results.length === 0 && (
        <View style={s.empty}><Text style={s.emptyText}>{t('noResults')}</Text></View>
      )}
      <FlatList data={results} numColumns={2} columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
            <View style={s.image}><Text style={{ fontSize: 32, color: colors.light.textTertiary }}>📷</Text></View>
            <View style={s.info}>
              <Text style={s.name} numberOfLines={2}>{item.name?.[locale]}</Text>
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
  searchBar: { padding: spacing.md, backgroundColor: colors.light.surface, borderBottomWidth: 1, borderColor: colors.light.border },
  input: { backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.full, fontSize: 16, color: colors.light.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { color: colors.light.textSecondary, fontSize: 16 },
  card: { flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden' },
  image: { height: 160, backgroundColor: colors.light.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  info: { padding: spacing.md },
  name: { fontSize: 13, fontWeight: '600', color: colors.light.text, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
});

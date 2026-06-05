import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL, setLocale, getLocale } from '../i18n';

export default function SettingsScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={s.title}>{t('settings')}</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>{locale === 'ar' ? 'اللغة' : 'Language'}</Text>
        <View style={s.row}>
          <TouchableOpacity style={[s.langBtn, getLocale() === 'ar' && s.langActive]} onPress={() => setLocale('ar')}>
            <Text style={[s.langText, getLocale() === 'ar' && s.langTextActive]}>عربي</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.langBtn, getLocale() === 'en' && s.langActive]} onPress={() => setLocale('en')}>
            <Text style={[s.langText, getLocale() === 'en' && s.langTextActive]}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{locale === 'ar' ? 'العملة' : 'Currency'}</Text>
        <View style={s.row}>
          {['YER ﷼', 'SAR ر.س', 'USD $'].map(c => (
            <TouchableOpacity key={c} style={s.currBtn}><Text style={s.currText}>{c}</Text></TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{locale === 'ar' ? 'حول التطبيق' : 'About'}</Text>
        <Text style={s.aboutText}>{locale === 'ar' ? 'نوام شيب - منصة التسوق v1.0' : 'NwamCheap - Shopping Platform v1.0'}</Text>
        <Text style={s.aboutText}>shop.greatapps.online </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  title: { fontSize: 24, fontWeight: '800', marginBottom: spacing.xl },
  card: { backgroundColor: colors.light.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.light.border },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  langBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center' },
  langActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  langText: { fontWeight: '600', color: colors.light.textSecondary },
  langTextActive: { color: colors.primary },
  currBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center' },
  currText: { fontWeight: '600', color: colors.light.text },
  aboutText: { fontSize: 14, color: colors.light.textSecondary, marginBottom: 4 },
});

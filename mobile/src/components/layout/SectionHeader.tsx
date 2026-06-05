import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme';
import { isRTL } from '../../i18n';

interface Props { title: string; children: React.ReactNode; onViewAll?: () => void; }

export default function SectionHeader({ title, children, onViewAll }: Props) {
  const locale = isRTL() ? 'ar' : 'en';
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>{title}</Text>
        {onViewAll && <TouchableOpacity onPress={onViewAll}><Text style={s.viewAll}>{locale === 'ar' ? 'عرض الكل' : 'View All'}</Text></TouchableOpacity>}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.light.text },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});

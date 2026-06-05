import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme';

interface Props { icon: string; title: string; description?: string; }

export default function EmptyState({ icon, title, description }: Props) {
  return (
    <View style={s.container}>
      <Text style={s.icon}>{icon}</Text>
      <Text style={s.title}>{title}</Text>
      {description && <Text style={s.desc}>{description}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: 18, fontWeight: '700', color: colors.light.text, marginBottom: spacing.sm, textAlign: 'center' },
  desc: { fontSize: 14, color: colors.light.textSecondary, textAlign: 'center' },
});

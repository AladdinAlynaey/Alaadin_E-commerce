import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

interface Props {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export default function Badge({ text, variant = 'primary' }: Props) {
  const variantColors: Record<string, { bg: string; text: string }> = {
    primary: { bg: colors.primary + '20', text: colors.primary },
    success: { bg: colors.success + '20', text: colors.success },
    warning: { bg: colors.warning + '30', text: '#E17055' },
    error: { bg: colors.error + '20', text: colors.error },
  };
  const v = variantColors[variant];

  return (
    <View style={[s.badge, { backgroundColor: v.bg }]}>
      <Text style={[s.text, { color: v.text }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  text: { fontSize: 11, fontWeight: '700' },
});

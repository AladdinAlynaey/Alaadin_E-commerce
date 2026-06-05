import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', size = 'md', disabled, fullWidth, style }: Props) {
  const sizeStyles = { sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 }, md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15 }, lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 } };
  const variantStyles: Record<string, any> = {
    primary: { bg: colors.primary, text: '#fff', border: 'transparent' },
    secondary: { bg: colors.light.surfaceSecondary, text: colors.light.text, border: colors.light.border },
    ghost: { bg: 'transparent', text: colors.light.text, border: 'transparent' },
    danger: { bg: colors.error, text: '#fff', border: 'transparent' },
  };
  const v = variantStyles[variant];
  const sz = sizeStyles[size];

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} activeOpacity={0.8}
      style={[{ backgroundColor: v.bg, paddingVertical: sz.paddingVertical, paddingHorizontal: sz.paddingHorizontal, borderRadius: radius.md, borderWidth: 1, borderColor: v.border, alignItems: 'center', opacity: disabled ? 0.5 : 1 }, fullWidth && { width: '100%' }, style]}>
      <Text style={{ color: v.text, fontWeight: '700', fontSize: sz.fontSize }}>{title}</Text>
    </TouchableOpacity>
  );
}

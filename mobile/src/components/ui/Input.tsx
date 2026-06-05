import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
  error?: string;
}

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, multiline, error }: Props) {
  return (
    <View style={s.container}>
      {label && <Text style={s.label}>{label}</Text>}
      <TextInput style={[s.input, error && s.inputError, multiline && { height: 80, textAlignVertical: 'top' }]}
        placeholder={placeholder} value={value} onChangeText={onChangeText}
        secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoCapitalize={autoCapitalize}
        multiline={multiline} placeholderTextColor={colors.light.textTertiary} />
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.light.textSecondary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.md, fontSize: 15, color: colors.light.text, borderWidth: 1, borderColor: colors.light.border },
  inputError: { borderColor: colors.error },
  error: { fontSize: 12, color: colors.error, marginTop: spacing.xs },
});

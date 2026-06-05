import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>{t('login')}</Text>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <TextInput style={s.input} placeholder={t('email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.light.textTertiary} />
        <TextInput style={s.input} placeholder={t('password')} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.light.textTertiary} />
        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
          <Text style={s.btnText}>{loading ? '...' : t('login')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background, justifyContent: 'center', padding: spacing.xl },
  card: { backgroundColor: colors.light.surface, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.light.text, textAlign: 'center', marginBottom: spacing.md },
  error: { color: colors.error, fontSize: 13, textAlign: 'center', padding: spacing.sm, backgroundColor: colors.error + '15', borderRadius: radius.md },
  input: { backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.md, fontSize: 15, color: colors.light.text, borderWidth: 1, borderColor: colors.light.border },
  btn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.lg, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

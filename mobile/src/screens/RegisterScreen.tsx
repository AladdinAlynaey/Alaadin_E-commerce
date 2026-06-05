import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', nameAr: '', nameEn: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async () => {
    setError(''); setLoading(true);
    try {
      await register({ email: form.email, password: form.password, name: { ar: form.nameAr, en: form.nameEn }, phone: form.phone });
      navigation.goBack();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={s.title}>{t('register')}</Text>
      {error ? <Text style={s.error}>{error}</Text> : null}
      <TextInput style={s.input} placeholder={locale === 'ar' ? 'الاسم بالعربية' : 'Name (AR)'} value={form.nameAr} onChangeText={v => u('nameAr', v)} placeholderTextColor={colors.light.textTertiary} />
      <TextInput style={s.input} placeholder={locale === 'ar' ? 'الاسم بالإنجليزية' : 'Name (EN)'} value={form.nameEn} onChangeText={v => u('nameEn', v)} placeholderTextColor={colors.light.textTertiary} />
      <TextInput style={s.input} placeholder={t('email')} value={form.email} onChangeText={v => u('email', v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.light.textTertiary} />
      <TextInput style={s.input} placeholder={locale === 'ar' ? 'الهاتف' : 'Phone'} value={form.phone} onChangeText={v => u('phone', v)} keyboardType="phone-pad" placeholderTextColor={colors.light.textTertiary} />
      <TextInput style={s.input} placeholder={t('password')} value={form.password} onChangeText={v => u('password', v)} secureTextEntry placeholderTextColor={colors.light.textTertiary} />
      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
        <Text style={s.btnText}>{loading ? '...' : t('register')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  title: { fontSize: 24, fontWeight: '800', marginBottom: spacing.xl, textAlign: 'center' },
  error: { color: colors.error, textAlign: 'center', marginBottom: spacing.md, padding: spacing.sm, backgroundColor: colors.error + '15', borderRadius: radius.md },
  input: { backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.md, fontSize: 15, color: colors.light.text, borderWidth: 1, borderColor: colors.light.border, marginBottom: spacing.md },
  btn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.md },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

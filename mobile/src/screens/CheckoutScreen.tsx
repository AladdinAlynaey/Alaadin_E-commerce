import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function CheckoutScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { token } = useAuth();
  const [address, setAddress] = useState({ street: '', city: '', state: '', country: '', phone: '' });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const u = (key: string, val: string) => setAddress(prev => ({ ...prev, [key]: val }));

  const placeOrder = async () => {
    if (!token) { Alert.alert(locale === 'ar' ? 'يرجى تسجيل الدخول' : 'Please login'); return; }
    setLoading(true);
    try {
      const order = await api.post<any>('/orders', { shippingAddress: address, notes, items: [], subtotal: 0, total: 0, currency: 'YER' });
      Alert.alert(
        locale === 'ar' ? 'تم تأكيد الطلب!' : 'Order Placed!',
        `${locale === 'ar' ? 'رقم الطلب' : 'Order #'}: ${order.orderNumber}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Orders') }]
      );
    } catch (err: any) {
      Alert.alert(locale === 'ar' ? 'خطأ' : 'Error', err.message);
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'street', label: locale === 'ar' ? 'الشارع' : 'Street' },
    { key: 'city', label: locale === 'ar' ? 'المدينة' : 'City' },
    { key: 'state', label: locale === 'ar' ? 'المحافظة' : 'State' },
    { key: 'country', label: locale === 'ar' ? 'الدولة' : 'Country' },
    { key: 'phone', label: locale === 'ar' ? 'الهاتف' : 'Phone' },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={s.title}>{locale === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</Text>
      {fields.map(f => (
        <View key={f.key} style={s.field}>
          <Text style={s.label}>{f.label}</Text>
          <TextInput style={s.input} value={(address as any)[f.key]} onChangeText={v => u(f.key, v)} placeholderTextColor={colors.light.textTertiary} />
        </View>
      ))}
      <View style={s.field}>
        <Text style={s.label}>{locale === 'ar' ? 'ملاحظات' : 'Notes'}</Text>
        <TextInput style={[s.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline placeholderTextColor={colors.light.textTertiary} />
      </View>
      <TouchableOpacity style={s.btn} onPress={placeOrder} disabled={loading}>
        <Text style={s.btnText}>{loading ? '...' : locale === 'ar' ? 'تأكيد الطلب' : 'Place Order'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.light.text, marginBottom: spacing.xl },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.light.textSecondary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.md, fontSize: 15, color: colors.light.text, borderWidth: 1, borderColor: colors.light.border },
  btn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.xl },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

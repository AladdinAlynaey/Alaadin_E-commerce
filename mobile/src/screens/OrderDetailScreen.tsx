import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function OrderDetailScreen({ route }: any) {
  const { order } = route.params;
  const locale = isRTL() ? 'ar' : 'en';
  const { token } = useAuth();

  const uploadProof = async () => {
    try {
      await api.put(`/orders/${order._id}/payment-proof`, { proofPath: '/demo' });
      Alert.alert('✓', locale === 'ar' ? 'تم الرفع' : 'Uploaded');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={s.title}>#{order.orderNumber}</Text>
      <View style={s.card}>
        <View style={s.row}><Text style={s.label}>{locale==='ar'?'المبلغ':'Total'}</Text><Text style={s.val}>{order.total} {order.currency}</Text></View>
        <View style={s.row}><Text style={s.label}>{locale==='ar'?'الحالة':'Status'}</Text><Text style={s.val}>{order.orderStatus}</Text></View>
        <View style={s.row}><Text style={s.label}>{locale==='ar'?'الدفع':'Payment'}</Text><Text style={s.val}>{order.paymentStatus}</Text></View>
      </View>
      {order.paymentStatus === 'pending' && (
        <TouchableOpacity style={s.btn} onPress={uploadProof}>
          <Text style={s.btnText}>📤 {locale==='ar'?'رفع إثبات الدفع':'Upload Payment Proof'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  title: { fontSize: 22, fontWeight: '800', marginBottom: spacing.xl },
  card: { backgroundColor: colors.light.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.light.border },
  label: { color: colors.light.textSecondary },
  val: { fontWeight: '600' },
  btn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.xl },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

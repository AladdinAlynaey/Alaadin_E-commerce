import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { t, isRTL } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function OrdersScreen({ navigation }: any) {
  const locale = isRTL() ? 'ar' : 'en';
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (token) api.get<any>('/orders/my-orders?limit=20').then(r => setOrders(r.data || [])).catch(() => {});
  }, [token]);

  const statusColor: Record<string, string> = { pending: colors.warning, payment_uploaded: colors.primary, payment_approved: colors.success, processing: colors.primary, shipped: colors.primaryLight, delivered: colors.success, cancelled: colors.error };

  if (orders.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📦</Text>
        <Text style={s.emptyText}>{locale === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</Text>
      </View>
    );
  }

  return (
    <FlatList style={s.container} data={orders} keyExtractor={item => item._id}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
          <View style={s.row}>
            <Text style={s.orderNum}>#{item.orderNumber}</Text>
            <View style={[s.badge, { backgroundColor: (statusColor[item.orderStatus] || colors.primary) + '20' }]}>
              <Text style={[s.badgeText, { color: statusColor[item.orderStatus] || colors.primary }]}>{item.orderStatus}</Text>
            </View>
          </View>
          <View style={[s.row, { marginTop: spacing.sm }]}>
            <Text style={s.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={s.total}>{item.total?.toLocaleString()} {item.currency}</Text>
          </View>
          <View style={[s.row, { marginTop: spacing.sm }]}>
            <Text style={s.itemCount}>{item.items?.length || 0} {locale === 'ar' ? 'منتج' : 'items'}</Text>
            <View style={[s.badge, { backgroundColor: (item.paymentStatus === 'approved' ? colors.success : colors.warning) + '20' }]}>
              <Text style={[s.badgeText, { color: item.paymentStatus === 'approved' ? colors.success : colors.warning }]}>{item.paymentStatus}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.background },
  emptyText: { fontSize: 16, color: colors.light.textSecondary },
  card: { backgroundColor: colors.light.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNum: { fontSize: 15, fontWeight: '700', color: colors.light.text },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 13, color: colors.light.textSecondary },
  total: { fontSize: 16, fontWeight: '800', color: colors.primary },
  itemCount: { fontSize: 13, color: colors.light.textTertiary },
});

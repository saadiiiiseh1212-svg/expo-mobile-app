// src/screens/OrderSummaryScreen.js
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SERVICE_CHARGE_RATE = 0.05; // 5%
const SALES_TAX_RATE = 0.15; // 15%

export default function OrderSummaryScreen({ navigation }) {
  const { state } = useCart();
  const { colors } = useTheme();

  // Q8 Requirement: useMemo for calculating totals efficiently
  const { subtotal, serviceCharge, salesTax, discountAmount, grandTotal } = useMemo(() => {
    const sub = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (sub * state.discountPercent) / 100;
    const discountedSub = sub - discount;
    const sCharge = discountedSub * SERVICE_CHARGE_RATE;
    const tax = discountedSub * SALES_TAX_RATE;
    const total = discountedSub + sCharge + tax;

    return {
      subtotal: sub,
      serviceCharge: sCharge,
      salesTax: tax,
      discountAmount: discount,
      grandTotal: total
    };
  }, [state.items, state.discountPercent]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Order Summary</Text>

      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subText }]}>No items to summarize.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemRow, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name} (x{item.quantity})</Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>Rs. {item.price * item.quantity}</Text>
          </View>
        )}
      />

      {state.items.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.rowText, { color: colors.text }]}>Subtotal: Rs. {subtotal.toFixed(2)}</Text>
          {state.discountPercent > 0 && (
            <Text style={[styles.rowText, { color: '#2e7d32' }]}>Discount ({state.discountPercent}%): - Rs. {discountAmount.toFixed(2)}</Text>
          )}
          <Text style={[styles.rowText, { color: colors.text }]}>Service Charge (5%): Rs. {serviceCharge.toFixed(2)}</Text>
          <Text style={[styles.rowText, { color: colors.text }]}>Sales Tax (15%): Rs. {salesTax.toFixed(2)}</Text>
          <View style={[styles.divider, { backgroundColor: colors.subText }]} />
          <Text style={[styles.grandTotalText, { color: colors.text }]}>Grand Total: Rs. {grandTotal.toFixed(2)}</Text>

          <TouchableOpacity 
            style={styles.proceedBtn}
            onPress={() => alert('Order Summary Verified!')}
          >
            <Text style={styles.proceedText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 6, marginBottom: 8, elevation: 1 },
  itemName: { fontSize: 14, fontWeight: '500' },
  itemPrice: { fontSize: 14, fontWeight: 'bold' },
  summaryCard: { padding: 15, borderRadius: 8, marginTop: 10, elevation: 2 },
  rowText: { fontSize: 14, marginBottom: 6 },
  divider: { height: 1, marginVertical: 8 },
  grandTotalText: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  proceedBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 6, alignItems: 'center' },
  proceedText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
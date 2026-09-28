// src/screens/CartScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen() {
  const { state, dispatch } = useCart();
  const { colors } = useTheme();
  const [promoInput, setPromoInput] = useState('');

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * state.discountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Your Cart</Text>

      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subText }]}>Your cart is empty.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.subText }]}>Rs. {item.price} x {item.quantity}</Text>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={styles.stepBtn} 
                onPress={() => dispatch({ type: 'DECREMENT', payload: { id: item.id } })}
              >
                <Text style={styles.stepText}>-</Text>
              </TouchableOpacity>
              
              <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
              
              <TouchableOpacity 
                style={styles.stepBtn} 
                onPress={() => dispatch({ type: 'INCREMENT', payload: { id: item.id } })}
              >
                <Text style={styles.stepText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
              style={styles.removeBtn}
            >
              <Text style={{ color: '#ff3b30', fontSize: 12 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {state.items.length > 0 && (
        <View style={[styles.summaryContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.promoRow}>
            <TextInput
              style={[styles.promoInput, { color: colors.text, borderColor: colors.subText }]}
              placeholder="Promo Code (e.g. WELCOME10)"
              placeholderTextColor={colors.subText}
              value={promoInput}
              onChangeText={setPromoInput}
            />
            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => dispatch({ type: 'APPLY_PROMO', payload: { code: promoInput } })}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {state.promoCode && (
            <View style={styles.appliedPromoRow}>
              <Text style={{ color: '#2e7d32', fontSize: 12 }}>Promo Applied: {state.promoCode} ({state.discountPercent}% off)</Text>
              <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_PROMO' })}>
                <Text style={{ color: '#d32f2f', fontSize: 12 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.totalText, { color: colors.text }]}>Subtotal: Rs. {subtotal}</Text>
          {state.discountPercent > 0 && (
            <Text style={[styles.totalText, { color: '#2e7d32' }]}>Discount: - Rs. {discountAmount}</Text>
          )}
          <Text style={[styles.grandTotalText, { color: colors.text }]}>Grand Total: Rs. {grandTotal}</Text>

          <TouchableOpacity 
            style={styles.clearCartBtn}
            onPress={() => dispatch({ type: 'CLEAR_CART' })}
          >
            <Text style={styles.clearCartText}>Clear Cart</Text>
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
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  itemName: { fontSize: 15, fontWeight: 'bold' },
  itemPrice: { fontSize: 13, marginTop: 2 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  stepBtn: { backgroundColor: '#007AFF', width: 25, height: 25, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  stepText: { color: '#fff', fontWeight: 'bold' },
  qtyText: { marginHorizontal: 8, fontWeight: 'bold' },
  removeBtn: { padding: 5 },
  summaryContainer: { padding: 15, borderRadius: 8, marginTop: 10, elevation: 2 },
  promoRow: { flexDirection: 'row', marginBottom: 10 },
  promoInput: { flex: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, height: 38, fontSize: 13 },
  applyBtn: { backgroundColor: '#007AFF', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 6, marginLeft: 8 },
  applyText: { color: '#fff', fontWeight: 'bold' },
  appliedPromoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalText: { fontSize: 14, marginBottom: 4 },
  grandTotalText: { fontSize: 16, fontWeight: 'bold', marginVertical: 6 },
  clearCartBtn: { backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  clearCartText: { color: '#fff', fontWeight: 'bold' }
});
// src/screens/ManagerDashboardScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const initialOrders = [
  { id: 'o1', customer: 'Ali Khan', items: '2x Burger, 1x Fries', status: 'Pending', total: 850 },
  { id: 'o2', customer: 'Ayesha Ahmed', items: '1x Pizza, 2x Coke', status: 'Preparing', total: 1450 },
  { id: 'o3', customer: 'Bilal Raza', items: '3x Pasta', status: 'Out for Delivery', total: 2100 },
];

const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function ManagerDashboardScreen() {
  const [orders, setOrders] = useState(initialOrders);
  const { colors } = useTheme();

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Manager Dashboard - Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.orderId, { color: colors.text }]}>Order #{item.id} - {item.customer}</Text>
              <Text style={[styles.statusBadge, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>

            <Text style={[styles.itemsText, { color: colors.subText }]}>{item.items}</Text>
            <Text style={[styles.totalText, { color: colors.text }]}>Total: Rs. {item.total}</Text>

            <Text style={[styles.actionLabel, { color: colors.subText }]}>Update Status:</Text>
            <View style={styles.statusContainer}>
              {statuses.map(st => (
                <TouchableOpacity
                  key={st}
                  style={[styles.statusBtn, item.status === st && styles.activeStatusBtn]}
                  onPress={() => updateOrderStatus(item.id, st)}
                >
                  <Text style={[styles.statusBtnText, item.status === st && { color: '#fff' }]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#d32f2f';
    case 'Preparing': return '#f57c00';
    case 'Out for Delivery': return '#007AFF';
    case 'Delivered': return '#2e7d32';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 15, borderRadius: 8, marginBottom: 12, elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: 'bold' },
  statusBadge: { fontSize: 13, fontWeight: 'bold' },
  itemsText: { fontSize: 13, marginVertical: 4 },
  totalText: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  actionLabel: { fontSize: 11, marginBottom: 4 },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  statusBtn: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e0e0e0', borderRadius: 4 },
  activeStatusBtn: { backgroundColor: '#007AFF' },
  statusBtnText: { fontSize: 10, fontWeight: 'bold', color: '#333' }
});
// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile & Settings</Text>
      
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.label, { color: colors.subText }]}>Name:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user?.name || 'Guest User'}</Text>

        <Text style={[styles.label, { color: colors.subText }]}>Email:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user?.email || 'N/A'}</Text>

        <Text style={[styles.label, { color: colors.subText }]}>Role:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user?.role || 'Customer'}</Text>
      </View>

      <View style={[styles.row, { backgroundColor: colors.cardBackground }]}>
        <Text style={{ color: colors.text, fontSize: 16 }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  label: { fontSize: 12, marginBottom: 2 },
  value: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  logoutBtn: { backgroundColor: '#d32f2f', padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
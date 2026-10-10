// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert, Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { CartProvider } from './src/context/CartContext';
import MenuScreen from './src/screens/MenuScreen';
import { placeDummyOrder } from './src/services/api';

export default function App() {
  const [status, setStatus] = useState('');

  const showMessage = (title, msg) => {
    if (Platform.OS === 'web') window.alert(title + ': ' + msg);
    else Alert.alert(title, msg);
  };

  const handleDummyOrder = async () => {
    setStatus('Order bheja ja raha hai...');
    try {
      const order = await placeDummyOrder();
      setStatus('✅ Order placed! ID: ' + order._id);
      showMessage('Success', 'Order ID: ' + order._id);
    } catch (e) {
      setStatus('❌ Error: ' + e.message);
      showMessage('Error', e.message);
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <View style={styles.container}>
            <View style={styles.btn}>
              <Button title="Place Dummy Order" onPress={handleDummyOrder} />
              {status !== '' && <Text style={styles.status}>{status}</Text>}
            </View>
            <MenuScreen />
          </View>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  btn: { marginTop: 40, marginHorizontal: 16 },
  status: { marginTop: 8, marginBottom: 8, color: '#000', fontWeight: '600' },
});
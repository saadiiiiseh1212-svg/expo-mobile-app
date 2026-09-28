// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { CartProvider } from './src/context/CartContext';

// Screens import kar rahe hain (testing ke liye aap yahan koi bhi screen render kar sakte hain)
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrderSummaryScreen from './src/screens/OrderSummaryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import ManagerDashboardScreen from './src/screens/ManagerDashboardScreen';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <View style={styles.container}>
            {/* Filhal hum yahan MenuScreen render kar rahe hain, aap chahayen toh koi aur screen bhi rakh sakte hain */}
            <MenuScreen />
          </View>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});